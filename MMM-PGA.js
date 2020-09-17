/* Magic Mirror
 * Module: MMM-UFO
 *
 * By Mykle1
 *
 */
Module.register("MMM-PGA", {

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "PGA Upcoming Tournanment", // Any text you want
        minWidth: "300px",
        rotateInterval: 30 * 1000,
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-PGA.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga";
        this.UFO = [];
        this.activeItem = 0;         // <-- starts rotation at item 0 (see Rotation below)
        this.rotateInterval = null;  // <-- sets rotation time (see below)
        this.scheduleUpdate();       // <-- When the module updates (see below)
    },

    getDom: function() {
		
		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Waiting for PGA Info . . !";
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

            // Rotating the data
            /*var Keys = Object.keys(this.UFO);
            if (Keys.length > 0) {
                if (this.activeItem >= Keys.length) {
                    this.activeItem = 0;
                }*/

            // var UFO = this.UFO[Keys[this.activeItem]];

            var event = this.PGA[keys[0]];

            var course = event.courses[0];



                
            // Creating the div's for your data items
            var top = document.createElement("div");
            
            
            // Tournament Name element from data
            var tname = document.createElement("span");
            tname.classList.add("xsmall", "bright", "name");
            tname.innerHTML = event.shortName;
            wrapper.appendChild(tname);

            // sRournament Start
            var tstart = document.createElement("span");
            tstart.classList.add("xsmall", "bright", "date");
            tstart.innerHTML = moment(event.date, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
            wrapper.appendChild(tstart);

            // Tournament End
            var tend = document.createElement("span");
            tend.classList.add("xsmall", "bright", "date");
            tend.innerHTML = moment(event.endDate, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
            wrapper.appendChild(tend);

            // Course
            var tcourse = document.createElement("span");
            tcourse.classList.add("xsmall", "bright", "location");
            tcourse.innerHTML = course.name+ " " + course.address.city + ", " + course.address.state;
            wrapper.appendChild(tcourse);
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
            this.activeItem++;
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