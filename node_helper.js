/* Magic Mirror
 * Module: MMM-PGA
 *
 * By mcl8on
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getPGA: function(url) {
;
        
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            console.log ("Error"+error);
            console.log("response"+response);
            if (!error && response.statusCode == 200) {
                console.log("before parse MMM-PGA");
                var result = JSON.parse(body).events;
				// console.log(response.statusCode + JSON.stringify(result,null,4)); // uncomment to see in terminal
                this.sendSocketNotification('PGA_RESULT', result);
		
            }
        });
    
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("In socketnotificationreceived MMM-PGA" + payload) ;
        if (notification === 'GET_PGA') {
            this.getPGA(payload);
        }
    }
});
