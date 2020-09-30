
const moment = require('moment');
const request = require('request');

module.exports = {

    //url: "https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga",
    url: "https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401219793",
    ESPNObj: null,
    tournament: {},

    getTournamentData: function(callback){

    request({
        url: this.url,
        method: 'GET'
    }, (error, response, body) => {
        
        if (!error && response.statusCode == 200) {
            this.ESPNObj = JSON.parse(body).events; 
            
            //Build JSON object that will be passed to Client Side

            var event = this.ESPNObj[0];

            //Tournament Details
            this.tournament.name = event.shortName;
            this.tournament.date = this.getEventDate(event);
            this.tournament.location = this.getEventLocation(event);
            this.tournament.statusCode = event.status.type.name;
            this.tournament.status = event.status.type.description;


            //Load the Players

            this.tournament.players = [];


            if (this.tournament.statusCode != "STATUS_SCHEDULED"){

                var espnPlayers = event.competitions[0].competitors;


                for(var i in espnPlayers) {    

                    var espnPlayer = espnPlayers[i];   

                    this.tournament.players.push({ 
                        "name" : espnPlayer.athlete.displayName,
                        "position"  : espnPlayer.status.position.displayName,
                        "posId"     : parseInt(espnPlayer.status.position.id),
                        "flagHref"  : espnPlayer.athlete.flag.href,
                        "score"     : espnPlayer.statistics[0].displayValue,
                        "thru"      : this.getPlayerThru(espnPlayer),
                        "id"        : espnPlayer.athlete.id,
                        "sortOrder" : espnPlayer.sortOrder
                    });
                }
            }


            //Function to send SocketNotification with the Tournament Data
            callback(this.tournament);
        }
    });


    },



    getEventDate: function(event){
        var startDate = moment(event.date, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
        var endDate = moment(event.endDate, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
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