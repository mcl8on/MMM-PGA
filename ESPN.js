
const moment = require('moment');
const request = require('request');


module.exports = {

    url: "https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga",
    //url: "https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401219795",
    urlTournamentList: "https://www.espn.com/golf/schedule/_/tour/pga?_xhr=pageContent&offset=-04%3A00",

    getTournamentData: function(callback){

    request({
        url: this.url,
        method: 'GET'
    }, (error, response, body) => {


        console.log("MMM-PGA retrieving Tournament Data");
        
        if (!error && response.statusCode == 200) {
            var ESPNObj = JSON.parse(body).events; 
            
            //Build JSON object that will be passed to Client Side
            var event = ESPNObj[0];

            tournament = {};

            //Tournament Details
            tournament.name = event.shortName;
            tournament.date = this.getEventDate(event.date, event.endDate);
            tournament.location = this.getEventLocation(event);
            tournament.statusCode = event.status.type.name;
            tournament.status = event.competitions[0].status.type.detail;
            tournament.purse = event.displayPurse;
            tournament.defendingChamp = event.defendingChampion.athlete.displayName;
            tournament.currentRound = this.getCurrentRound(event);
            tournament.playoff = false;


           //Load the Players for the tournament

            tournament.players = [];

            if (tournament.statusCode != "STATUS_SCHEDULED"){

                var espnPlayers = event.competitions[0].competitors;


                for(var i in espnPlayers) {    

                    var espnPlayer = espnPlayers[i];
                    if (espnPlayer.status.playoff) tournament.playoff = true;
                    
                    tournament.players.push({
                        "name"      : espnPlayer.athlete.displayName,
                        "position"  : espnPlayer.status.position.displayName,
                        "posId"     : parseInt(espnPlayer.status.position.id),
                        "flagHref"  : espnPlayer.athlete.flag.href,
                        "score"     : espnPlayer.statistics[0].displayValue,
                        "thru"      : this.getPlayerThru(espnPlayer),
                        "roundScore": this.getRoundScore(espnPlayer, tournament.currentRound),
                        "id"        : espnPlayer.athlete.id,
                        "sortOrder" : espnPlayer.sortOrder,
                        "playoff"   : espnPlayer.status.playoff
                    });
                }
            } 
            //Function to send SocketNotification with the Tournament Data
            callback(tournament);
        } else {
            console.log("MMM-PGA Error Loading Tournament Error Code:" + JSON.stringify(error) + " Status Code: " + response.statusCode );

        }
    });


    },

    getTournaments: function(numTournaments, callback){

        request({
            url: this.urlTournamentList,
            method: 'GET'
        }, (error, response, body) => {
            
            console.log("MMM-PGA Retrieving Tounament List");

            if (!error && response.statusCode == 200) {
                var ESPNObj = JSON.parse(body).events; 

                //Only look at future Tournaments
                ESPNObj = ESPNObj.filter(function (tournament){
                    return ((tournament.status == "pre")||(tournament.status == "in"));
                });

                tournaments = [];

                for (i=0;i<numTournaments;i++){
                    var tournament = ESPNObj[i];
                    tournaments.push({
                        "name"           : tournament.name,
                        "date"           : this.getEventDate(tournament.startDate,tournament.endDate),
                        "location"       : tournament.locations[0].venue.fullName,
                        "purse"          : this.setUndefStr(tournament.purse,"TBD"),
                        "defendingChamp" : this.setUndefStr(tournament.athlete.name)

                    });
                }

                callback(tournaments);

            } else {
                console.log("MMM-PGA Error Loading Tournaments Error Code:" + JSON.stringify(error) + " Status Code: " + response.statusCode );
            }

        });
    },

    getCurrentRound: function(event){


        //logic to handle playoffs For now we only showing information pertaininhg to rounds in regulation

        currentRound = event.competitions[0].status.period;
        totalRounds = event.tournament.numberOfRounds;
        return (currentRound<=totalRounds)?currentRound:totalRounds;

    },



    getEventDate: function(start, end){
        var startDate = moment(start, "YYYY-MM-DD HH:mm Z").local().format("MMM D");
        var endDate = moment(end, "YYYY-MM-DD HH:mm Z").local().format("MMM D");
        return startDate + " - " + endDate;

    },

    getEventLocation: function(event){

        var course = event.courses[0];

        var city = this.setUndefStr(course.address.city);
        var state = this.setUndefStr(course.address.state);
        var appendstring =", ";

        if (city.length == 0 || state.length ==0){
            appendstring = "";
        }


        return course.name+ " " + city + appendstring + state;

    },

    getRoundScore: function (player,round){
       
        var roundScore = "-";
        var linescore = player.linescores[round-1];

        if (!(typeof linescore == 'undefined' || linescore == null)){
            roundScore = linescore.displayValue;
        }

        return roundScore;
    },

    getPlayerThru: function (player) {


        var displayValue = player.status.displayValue;
        var append = (player.status.startHole == "1") ? "" : "*";

        if (typeof displayValue == 'undefined' || displayValue == null) {

            return player.status.displayThru + append;

        }
        var teeTime = moment(displayValue, "YYYY-MM-DD HH:mm:ss Z");
        if (teeTime.isValid()) {
            return teeTime.local().format("h:mm a") + append;
        }

        return displayValue;
    },

    setUndefStr: function(obj, defStr = ""){
        return (typeof obj == "undefined")?defStr:obj;
    }


};