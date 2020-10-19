/* Magic Mirror
 * Module: MMM-PGA
 *
 * By mcl8on
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
var ESPN = require('./ESPN.js');
const OWGR = require('./OWGR.js');
const FEDEXCUP = require('./FEDEXCUP.js');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);    
    },

    // Core function of franewor that schedules the Update
    scheduleUpdate: function () {

        //schedule the updates for Subsequent Loads
        var self =this; 

        var num = this.config.numTournaments;

        setInterval(() => {
            self.getPGAData(num);
        }, self.config.updateInterval);
        
    },

    getPGAData: function(numTournaments){

        var self = this;


        ESPN.getTournamentData(function (tournament){
            self.sendSocketNotification("PGA_RESULT",tournament);});
        
        ESPN.getTournaments(numTournaments, function (tournaments){
            self.sendSocketNotification("PGA_TOURNAMENT_LIST",tournaments);});
    },

    getRankingData: function(){

    },


    socketNotificationReceived: function(notification, payload) {

        var self = this;

        if (notification === 'CONFIG') {
            console.log ("MMM-PGA config received");
            this.config = payload;
            if (this.started !== true) {
              this.started = true;
              this.scheduleUpdate(); 
              
              
            }

            //Load Data to begin with so we dont have to wait for next server load
            //Each client will make a call at startup
            this.getPGAData(this.config.numTournaments);

            OWGR.getOWGRData(function(owgrRanking){
                self.sendSocketNotification("OWGR_RANKING",owgrRanking);});

            FEDEXCUP.getFedExCupData(function(fcRanking){
                    self.sendSocketNotification("FEDEXCUP_RANKING",fcRanking);});


        }
        
            
    }
});
