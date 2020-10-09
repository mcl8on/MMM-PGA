
/* Magic Mirror
 * Module: MMM-PGA
 *
 * By mcl8on
 */


Module.register("MMM-PGA", {

    requiresVersion: "2.1.0",

    // Module config defaults.
    defaults: {
        useHeader: true,
        header: "PGA Tournanment",
        headerTournamentList: "UPCOMING PGA TOURNAMENTS",

        minWidth: "300px",
        rotateInterval: 30 * 1000,
        animationSpeed: 0, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,
        colored: true,
        showBoards: true,
        showLocation: true,
        numTournaments: 3,
        numLeaderboard: 5,
        maxLeaderboard: 10,
        includeTies: true,
        showLogo: false,
        showFlags: false,
        favorites: [],
    },



    getStyles: function () {
        return ["MMM-PGA.css"];
    },

    /* Called whe Module starts set up some gloab config info*/

    start: function () {
        Log.info("Starting module: " + this.name);

        var self=this;

        // Set locale.
        this.pgalogohtml = "<img src='./modules/MMM-PGA/PGAlogo.png' alt='' align=bottom height=15 width=15></img> ";
        this.flaghtml = "<img src='http' alt='' align=top height=22 width=22></img>";
        this.grayScaleStyle = "<img style='filter:grayscale(1)'";

        this.boardIndex = 0;       //Starts with the Leaderboard
        this.leaderboardHeader ="LEADERBOARD";
        this.rotateInterval = null;
        this.tournament = null;
        this.tournaments = null;
        this.loaded = false;
        this.tournamentsLoaded = false;

        if (!this.config.colored){
            this.pgalogohtml = this.pgalogohtml.replace("<img", this.grayScaleStyle);
        }

        this.numBoards = 1 + this.config.favorites.length;

        //Schedule the data Retrival on the server side
        this.sendSocketNotification("CONFIG",this.config);

    },

    //Create a TH of the Leader Board
    buildTh: function (val, left = false,span =false) {

        var th = document.createElement("th");
        th.classList.add("xsmall", "bright");
        if (this.config.colored) th.classList.add("th-color");
        if (left) th.classList.add("th-left-aligned");
        if (span) th.colSpan = 2;

        th.innerHTML = val;
        return th;

    },

    //Crete a TD for the Leader Board

    buildTD: function (val, classlist = []) {

        var td = document.createElement("td");
        td.classList.add("xsmall", "bright");
        if (classlist.length >0) td.classList.add(...classlist);
        td.innerHTML = val;
            
        return td;

    },
    /* Builds the Dom for the Board*/
    buildLeaderBoard: function (tournament) {

        var self = this;

        var players = tournament.players;
        
        players.sort(function (a, b) { return a.sortOrder - b.sortOrder; });

        //If Favorites is enabled create Array with only the Favorites
        while (this.boardIndex >= 1) {
            favs = players.filter(function (player) {
                return self.config.favorites[self.boardIndex-1].favoriteList.includes(player.id);

            });


            if (favs.length == 0){ 
                this.boardIndex++;
                if (this.boardIndex == this.numBoards) this.boardIndex=0;
            } else {
                players = favs;
                len = players.length;
                break;
            }    
        }

         
        
        if (this.boardIndex == 0) {
            len = players.length < this.config.maxLeaderboard ? players.length : this.config.maxLeaderboard;
        }

        // Create Board Header
        var leaderboard = document.createElement("div");
        var leaderboardSeparator = document.createElement("div");
        leaderboardSeparator.classList.add("leaderboard-separator");
        leaderboard.appendChild(leaderboardSeparator);

        var boardName = document.createElement("span");
        //Set  Board header Text
        if (this.boardIndex == 0){
            boardHeader = this.leaderboardHeader;
        } else {
            boardHeader = this.config.favorites[this.boardIndex-1].headerName;
        }
        boardName.innerHTML = boardHeader;
        leaderboardSeparator.appendChild(boardName);

        var boardStatus = document.createElement("span");
        boardStatus.classList.add("event-status");
        boardStatus.innerHTML = tournament.status;
        leaderboardSeparator.appendChild(boardStatus);




        // Build table with Score details
        var lbTable = document.createElement("table");
        lbTable.classList.add("leaderboard-table");
        leaderboard.appendChild(lbTable);

        //Leader Board Table Header
        var lbhead = document.createElement("tr");
        lbTable.appendChild(lbhead);
        lbhead.appendChild(this.buildTh("POS", true));
        lbhead.appendChild(this.buildTh("Player Name", true, this.config.showFlags));
        lbhead.appendChild(this.buildTh("TOTAL"));
        lbhead.appendChild(this.buildTh("THRU"));

        //Body of the Table Loop through the Players add a Row For Each Player        
        var lastpos = 0;
        for (i = 0; i < len; i++) {

            var player = players[i];
            var playerpos = player.posId;

            //Only do tie logic for Leaderboards
            //Favorites will display ALL
            if (this.boardIndex == 0) {

                if (i == this.config.numLeaderboard - 1) lastpos = playerpos;

                if (i > this.config.numLeaderboard - 1) {
                    if (playerpos > lastpos || !this.config.includeTies) break;
                } 
            }

            //Leader Board Row
            var lbrow = document.createElement("tr");
            lbTable.appendChild(lbrow);


            lbrow.appendChild(this.buildTD(player.position));
            if (this.config.showFlags) {

                var fHTML = this.flaghtml.replace("http", player.flagHref);
                if (!this.config.colored) fHTML = fHTML.replace("<img",this.grayScaleStyle);
                lbrow.appendChild(this.buildTD(fHTML,["td-img"]));
                
            }
            lbrow.appendChild(this.buildTD(player.name));

            var cl = ["td-center-aligned"];

            if (this.config.colored) {

                if (player.score == "E")  colorClass = "td-total-even";
                if (player.score.charAt(0) == '-') colorClass = "td-total-under";
                if (player.score.charAt(0) == '+') colorClass = "td-total-above";
                cl.push(colorClass);
            }

            lbrow.appendChild(this.buildTD(player.score, cl));
            lbrow.appendChild(this.buildTD(player.thru, ["td-center-aligned"]));
            
        }

        return leaderboard;
    },

    buildTournamentList: function(tournaments, border = true){
        // Build the list of upcming tournaments
        
        //Create the HTML table
        var tourTable = document.createElement("table");
        tourTable.classList.add("tournament-table");

        var firstRowClasses = [ "xsmall", "bright" ];
        

        for(var i in tournaments) { 

            
            var tournament = tournaments[i];
            
            var trow = document.createElement("tr");
            tourTable.appendChild(trow);

            var dateTd = document.createElement("td");
            dateTd.classList.add( ...firstRowClasses, "date-cell");
            if (border) dateTd.classList.add("border");
            if (this.config.showLocation) dateTd.rowSpan =2;
            dateTd.innerHTML = tournament.date;
            trow.appendChild(dateTd);

            var nameTd = document.createElement("td");
            nameTd.classList.add(...firstRowClasses);
            if (!this.config.showLocation && border) nameTd.classList.add("border");
            nameTd.innerHTML = tournament.name;
            trow.appendChild(nameTd);

            var purseTd = document.createElement("td");

            purseTd.classList.add(...firstRowClasses,"purse-cell");
            if(border) purseTd.classList.add("border");
            if (this.config.showLocation) purseTd.rowSpan =2;
            purseTd.innerHTML = "Purse: " + tournament.purse;
            trow.appendChild(purseTd);

            tourTable.appendChild(trow);

            //Second Row
            if (this.config.showLocation){

                var secondRow = document.createElement("tr");
            
                tourTable.appendChild(secondRow);

                var locationTd = document.createElement("td");
                locationTd.colSpan =2;
                locationTd.classList.add("xsmall");
                if (border) locationTd.classList.add("border");
                locationTd.innerHTML = tournament.location; 
                secondRow.appendChild(locationTd);
            }
        }
        

        return tourTable;

    },

    buildHeader: function(list=true){

        var header = document.createElement("header");
        header.classList.add("xsmall", "bright", "light", "header");
        var headerText =(list)?this.config.headerTournamentList:this.config.header;
        header.innerHTML =  headerText;
        if (this.config.showLogo){
            header.innerHTML = this.pgalogohtml + header.innerHTML;
        }

        return header;
        


    },

    /* Main Magic Mirror module to build the Contect of the module*/

    getDom: function () {

        var self = this;
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // If Data is not Loaded yet display the Loading Caption
        if (!this.loaded || !this.tournamentsLoaded) {
            wrapper.innerHTML = "Loading . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        var tourney = this.tournament;
        var tourneyScheduled = (tourney.statusCode == "STATUS_SCHEDULED");

        // creating the header
        if (this.config.useHeader != false) {   
            wrapper.appendChild(this.buildHeader(tourneyScheduled));
        }

        //If Tounament not in Progress Show the upcoming tournaments based on the Config
        //tourney.statusCode = "STATUS_SCHEDULED";      
        if (tourneyScheduled || !this.config.showBoards){
            list = this.buildTournamentList(this.tournaments);
            wrapper.appendChild(list);
            return wrapper;
        }    

        //Tounament is in progress and Module is confugred to show boards
        //So build the boards
        curTourneyList = [tourney];
        tdetails = this.buildTournamentList(curTourneyList,false);
        wrapper.appendChild(tdetails);

        if (this.config.showBoards) {
            var leaderboard = this.buildLeaderBoard(tourney);
            wrapper.appendChild(leaderboard);
        }

        return wrapper;

    }, 


    // this rotates your data
    scheduleCarousel: function () {
        console.log("schedule carousle MMM-PGA"); // uncomment to see if data is rotating (in dev console)
        this.rotateInterval = setInterval(() => {

            if (this.config.favorites.length == 0) {
                this.boardIndex = 0;
            } else {
                this.boardIndex = (this.boardIndex == this.numBoards - 1) ? 0 : this.boardIndex + 1;
            }
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },


    // Called by MM Framework when new data has been retrieved
    socketNotificationReceived: function (notification, payload) {
        
        if (notification === "PGA_RESULT") {
            this.tournament =payload;
            this.loaded=true;
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }

        else if (notification == "PGA_TOURNAMENT_LIST") {
            this.tournaments = payload;
            this.tournamentsLoaded = true;
            this.updateDom(this.config.animationSpeed);

        }  
        else {
            this.updateDom(this.config.initialLoadDelay);
        }
    },
});