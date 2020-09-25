
/* Magic Mirror
 * Module: MMM-PGA
 *
 * By mcl8on
 *
 */

Module.register("MMM-PGA", {

    requiresVersion: "2.1.0",

    // Module config defaults.
    defaults: {
        useHeader: true,
        header: "PGA Tournanment",
        minWidth: "300px",
        rotateInterval: 30 * 1000,
        animationSpeed: 0, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 5 * 1000,
        colored: true,
        showBoards: true,
        numLeaderboard: 5,
        maxLeaderboard: 10,
        includeTies: true,
        showLogo: false,
        favorites: [],
    },



    getStyles: function () {
        return ["MMM-PGA.css"];
    },

    /* Called whe Module starts set up some gloab config info*/

    start: function () {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.url = "https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga";
        this.pgalogohtml = "<img src='./modules/MMM-PGA/PGAlogo.png' alt='' align=bottom height=15 width=15></img> ";
        this.boardIndex = 0;       //Starts with the Leaderboard
        this.boards = ["LEADERBOARD", "MY FAVORITES"];
        this.rotateInterval = null;
        this.PGA = null;
        this.scheduleUpdate();
        var self = this;
    },

    /* Formats the thru Information correctly. Adds a * if the player is starting on the back 9*/

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


    //Create a TH of the Leader Boare
    buildTh: function (val, left = false) {

        var th = document.createElement("th");
        th.classList.add("xsmall", "bright");
        if (this.config.colored) th.classList.add("th-color");
        if (left) th.classList.add("th-left-aligned");

        th.innerHTML = val;
        return th;

    },
    /* Builds the Dom for the Board*/
    buildLeaderBoard: function (event) {

        var self = this;

        // Sort Players accorting to score
        var players = event.competitions[0].competitors;
        players.sort(function (a, b) { return a.sortOrder - b.sortOrder; });

        //If Favorites is enabled create Array with only the Favorites
        if (this.boardIndex == 1) {
            favs = players.filter(function (player) {
                return self.config.favorites.includes(player.athlete.id);
            });


            //If no favorites are playing then revert to leaderboard view
            if (favs.length == 0){ 
                this.boardIndex = 0;
            } else {
                players = favs;
                len = players.length;
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
        boardName.innerHTML = this.boards[this.boardIndex];
        leaderboardSeparator.appendChild(boardName);

        var boardStatus = document.createElement("span");
        boardStatus.classList.add("event-status");
        boardStatus.innerHTML = this.PGA.eventStatus;
        leaderboardSeparator.appendChild(boardStatus);




        // Build table with Score details
        var lbTable = document.createElement("table");
        lbTable.classList.add("leaderboard-table");
        leaderboard.appendChild(lbTable);

        //Leader Board Table Header
        var lbhead = document.createElement("tr");
        lbTable.appendChild(lbhead);
        lbhead.appendChild(this.buildTh("POS", true));
        lbhead.appendChild(this.buildTh("Player Name", true));
        lbhead.appendChild(this.buildTh("TOTAL"));
        lbhead.appendChild(this.buildTh("THRU"));

        //Body of the Table Loop through the Players add a Row For Each Player        
        var lastpos = 0;
        for (i = 0; i < len; i++) {

            var player = players[i];
            var playerpos = parseInt(player.status.position.id);


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

            var playerPos = document.createElement("td");
            playerPos.classList.add("xsmall", "bright");
            playerPos.innerHTML = player.status.position.displayName;
            lbrow.appendChild(playerPos);


            var playerName = document.createElement("td");
            playerName.classList.add("xsmall", "bright");
            playerName.innerHTML = player.athlete.displayName;
            lbrow.appendChild(playerName);

            var playerScore = document.createElement("td");
            playerScore.classList.add("xsmall", "bright", "td-center-aligned");

            if (this.config.colored) {

                if (player.statistics[0].displayValue == "E") playerScore.classList.add("td-total-even");
                if (player.statistics[0].displayValue.charAt(0) == '-') playerScore.classList.add("td-total-under");
                if (player.statistics[0].displayValue.charAt(0) == '+') playerScore.classList.add("td-total-above");
            }

            playerScore.innerHTML = player.statistics[0].displayValue;
            lbrow.appendChild(playerScore);

            var playerThru = document.createElement("td");
            playerThru.classList.add("xsmall", "bright", "td-center-aligned");
            playerThru.innerHTML = this.getPlayerThru(player);
            lbrow.appendChild(playerThru);
        }

        return leaderboard;
    },

    /* Main Magic Mirror module to build the Contect of the module*/

    getDom: function () {

        var self = this;

        // creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Loading . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        // creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML =  this.config.header;
            if (this.config.showLogo){
                header.innerHTML = this.pgalogohtml + header.innerHTML;
            }
            wrapper.appendChild(header);
        }

        var PGA = this.PGA;


        if (PGA.eventAvailable) {



            // Creating the div's for your data items
            var tdiv = document.createElement("div");
            tdiv.classList.add("tournament-details");
            wrapper.appendChild(tdiv);


            // Tournament Name element from data
            var tname = document.createElement("div");
            tname.classList.add("xsmall", "bright", "tournament-item");
            tname.innerHTML = PGA.eventName;
            tdiv.appendChild(tname);

            // Tournament Date
            var tdates = document.createElement("div");
            tdates.classList.add("xsmall", "bright", "tournament-item-nowrap");
            tdates.innerHTML = PGA.eventDate;
            tdiv.appendChild(tdates);

            // Course
            var tcourse = document.createElement("div");
            tcourse.classList.add("xsmall", "bright", "tournament-item-right");
            tcourse.innerHTML = PGA.eventLocation;
            tdiv.appendChild(tcourse);


            /*
        
                    var tdiv2 = document.createElement("div");
                    tdiv2.classList.add("tournament-details","detail-line");
                    wrapper.appendChild(tdiv2);
        
                     
        
                    //Defending Champion
                    var defChamp = document.createElement("span");
                    defChamp.classList.add("xsmall", "tournament-details", "detail-line", "tournament-field-right");
                    defChamp.innerHTML="Prev Champ: " + PGA.eventDefendingChampion;
                    tdiv2.appendChild(defChamp);
        
             */

            if (PGA.tournamentStatus != "STATUS_SCHEDULED" && this.config.showBoards) {
                var leaderboard = this.buildLeaderBoard(PGA.eventObj);
                wrapper.appendChild(leaderboard);
            }




        }
        return wrapper;

    }, 
    // Processes the Data recieve from the API
    processPGA: function (data) {
        this.PGA = data;
        this.loaded = true;
    },


    // this rotates your data
    scheduleCarousel: function () {
        console.log("schedule carousle MMM-PGA"); // uncomment to see if data is rotating (in dev console)
        this.rotateInterval = setInterval(() => {

            if (this.config.favorites.length == 0) {
                this.boardIndex = 0;
            } else {
                this.boardIndex = (this.boardIndex == this.boards.length - 1) ? 0 : this.boardIndex + 1;
            }
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },


    // Core function of franewor that schedules the Update
    scheduleUpdate: function () {
        //console.log("In Schedule Update MMM-PGA");
        setInterval(() => {
            this.getPGA();
        }, this.config.updateInterval);
        this.getPGA(this.config.initialLoadDelay);
        var self = this;
    },


    // Sends Socket request to server to Retrieve data from the API
    getPGA: function () {
        this.sendSocketNotification('GET_PGA', this.url);
    },


    // Called by MM Framework when new data has been retrieved
    socketNotificationReceived: function (notification, payload) {
        console.log("notification Received im MMS-PGA" + notification + payload);
        if (notification === "PGA_RESULT") {
            this.processPGA(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});