/* Magic Mirror
 * Module: MMM-PGA
 *
 * By mcl8on
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
var PGA = require('./PGATournament.js');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
        
    },

    getPGA: function(url) {
        
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).events;
                PGA.pgaData = result;                
                this.sendSocketNotification('PGA_RESULT', PGA);
		
            }
        });
    
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_PGA') {
            this.getPGA(payload);
        }
    }
});
