/* Magic Mirror
 * Module: MMM-UFO
 *
 * By Mykle1
 *
 */
Module.register("MMM-PGA", {

    requiresVersion: "2.1.0",

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "PGA Tournanment", // Any text you want
        minWidth: "300px",
        rotateInterval: 30 * 1000,
        animationSpeed: 0, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 2 * 1000,
        numLeaderboard: 5,
        maxLeaderboard: 10,
        favorites: ["462", "5467", "4848", "3702" ],
    },

    

    getStyles: function() {
        return ["MMM-PGA.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        

        // Set locale.
        this.url = "https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga";
        this.boardIndex = 0;         // <-- starts rotation at item 0 (see Rotation below)
        this.boards = ["LEADERBOARD","MY FAVORITES"];
        this.rotateInterval = null;  // <-- sets rotation time (see below)
        this.scheduleUpdate();       // <-- When the module updates (see below)

        var self = this;
    },

    getPlayerThru: function (player){


        var displayValue = player.status.displayValue;
        var append = (player.status.startHole == "1") ?"":"*";

        if (typeof displayValue == 'undefined' || displayValue == null ){

            return player.status.displayThru + append;

        }
        var teeTime = moment(displayValue, "YYYY-MM-DD HH:mm:ss Z");
        if (teeTime.isValid()){
            return teeTime.local().format("h:mm a") + append;
        }

        return displayValue;
    },

    buildLeaderBoard: function(event) {
        //Show LeaderBoard

        var self = this;

        var leaderboard = document.createElement("div");

        var eventStatus = event.competitions[0].status.type.shortDetail;
        

        var leaderboardSeparator = document.createElement("div");
        leaderboardSeparator.classList.add("leaderboard-separator");
        //leaderboardSeparator.innerHTML = " + "-" + eventStatus + "</span>";
        leaderboard.appendChild(leaderboardSeparator);

        var boardName = document.createElement("span");
        boardName.innerHTML=this.boards[this.boardIndex];
        leaderboardSeparator.appendChild(boardName);

        var boardStatus = document.createElement("span");
        boardStatus.classList.add("event-status");
        boardStatus.innerHTML=eventStatus;
        leaderboardSeparator.appendChild(boardStatus);


        var players = event.competitions[0].competitors; 
        players.sort(function (a,b){return a.sortOrder - b.sortOrder;});

        //If Favorites is enabled create Array with only the Favorites
        if (this.boardIndex == 1){    
            players = players.filter( function (player){
               return self.config.favorites.includes(player.athlete.id);
            });
        }   
        
        var len = players.length < this.config.maxLeaderboard ? players.length : this.config.maxLeaderboard;     
        
        var lbTable = document.createElement("table");
        lbTable.classList.add("leaderboard-table");
        leaderboard.appendChild(lbTable);

        

        //Leader Board Table Header
        var lbhead = document.createElement("tr");
        lbTable.appendChild(lbhead);

        var posHeadCell = document.createElement("th");
        posHeadCell.classList.add("xsmall","bright","th-left-aligned");
        posHeadCell.innerHTML="POS";
        lbhead.appendChild(posHeadCell);
        
        var playerHeadCell = document.createElement("th");
        playerHeadCell.classList.add("xsmall", "bright","th-left-aligned");
        playerHeadCell.innerHTML="PLAYER NAME";
        lbhead.appendChild(playerHeadCell);

        var scoreHeadCell = document.createElement("th");
        scoreHeadCell.classList.add("xsmall", "bright");
        scoreHeadCell.innerHTML="TOTAL";
        lbhead.appendChild(scoreHeadCell);

        var thruHeadCell = document.createElement("th");
        thruHeadCell.classList.add("xsmall", "bright");
        thruHeadCell.innerHTML="THRU";
        lbhead.appendChild(thruHeadCell);

        

        var lastpos = 0;
        for (i=0; i<len; i++){
            var player = players[i];
            var playerpos = parseInt(player.status.position.id);


            //Only do tie logic for Leaderboards
            //Favorites will display ALL
            if (this.boardIndex == 0) {

                if (i == this.config.numLeaderboard-1) lastpos = playerpos;
        
                if (i > this.config.numLeaderboard-1){
                    console.log("start checking for a break MMM-PGA");
                    if (playerpos > lastpos) break;
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

            if (player.statistics[0].displayValue == "E") playerScore.classList.add("td-total-even");
            if (player.statistics[0].displayValue.charAt(0) == '-') playerScore.classList.add("td-total-under");
            if (player.statistics[0].displayValue.charAt(0) == '+') playerScore.classList.add("td-total-above");

            playerScore.innerHTML = player.statistics[0].displayValue;
            lbrow.appendChild(playerScore);

            var playerThru = document.createElement("td");
            playerThru.classList.add("xsmall", "bright", "td-center-aligned");
            playerThru.innerHTML = this.getPlayerThru(player);
            lbrow.appendChild(playerThru);
        }

          return leaderboard;
    },

    getDom: function() {

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
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var keys = Object.keys(this.PGA);
        
        if (keys.length>0){



            var event = this.PGA[keys[0]];

            var course = event.courses[0];
                
            // Creating the div's for your data items
            var tdiv = document.createElement("div");
            tdiv.classList.add("tournament-details");
            wrapper.appendChild(tdiv);
            
            
            // Tournament Name element from data
            var tname = document.createElement("span");
            tname.classList.add("xsmall", "bright", "name");
            tname.innerHTML = event.shortName;
            tdiv.appendChild(tname);

            // Tournament Date

            var startDate = moment(event.date, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
            var endDate = moment(event.endDate, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");

            var tdates = document.createElement("span");
            tdates.classList.add("xsmall", "bright", "date");
            tdates.innerHTML = startDate + " - " + endDate;
            tdiv.appendChild(tdates);


            // Course
            var tcourse = document.createElement("span");
            tcourse.classList.add("xsmall", "bright", "location");
            tcourse.innerHTML = course.name+ " " + course.address.city + ", " + course.address.state;
            tdiv.appendChild(tcourse);

            var leaderboard = this.buildLeaderBoard(event);
            wrapper.appendChild(leaderboard);
        
        
      
    } 
        return wrapper;
		
    }, // <-- closes the getDom function from above

	// this processes your data
    processPGA: function(data) { 
        this.PGA = data; 
        //console.log(this.UFO); // uncomment to see if you're getting data (in dev console)
        this.loaded = true;
    },
	
	
	// this rotates your data
    scheduleCarousel: function() { 
        console.log("schedule carousle MMM-PGA"); // uncomment to see if data is rotating (in dev console)
        this.rotateInterval = setInterval(() => {
            this.boardIndex = (this.boardIndex == this.boards.length -1) ? 0 : this.boardIndex +1;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },
	
	
// this tells module when to update
    scheduleUpdate: function() { 
        console.log("In Schedule Update MMM-PGA");
        setInterval(() => {
            this.getPGA();
        }, this.config.updateInterval);
        this.getPGA(this.config.initialLoadDelay);
        var self = this;
    },
	
	
	// this asks node_helper for data
    getPGA: function() { 
        console.log("In getPGA MMM-PGA");
        this.sendSocketNotification('GET_PGA', this.url);
    },
	
	
	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) {            
        console.log("notification Received im MMS-PGA" + notification+payload);
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