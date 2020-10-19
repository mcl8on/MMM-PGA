
const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const flags = require("./flags.js");


//TODO: Add comments

module.exports = {

    url: "http://www.owgr.com/ranking",
  
    getOWGRData: function(callback){

    request({
        url: this.url,
        method: 'GET'
    }, (error, response, body) => {


        console.log("MMM-PGA retrieving OWGR");
        
        if (!error && response.statusCode == 200) {

            var owgrRanking={pointsHeading: "Average Points", rankings: []};

           

            var dom = new JSDOM(response.body);
           
            var tblCont = dom.window.document.getElementsByClassName("table_container");
            var tblRows = tblCont[0].querySelectorAll("tr");
            for (var i = 1; i < tblRows.length; i++) {
                

                //TODO: Add Flag Reference. Should I add arrow shpowing moving position
                owgrRanking.rankings.push({ 
                    "name"          : tblRows[i].cells[4].textContent,
                    "curPosition"   : tblRows[i].cells[0].textContent,
                    "lwPosition"    : tblRows[i].cells[1].textContent,
                    "points"        : tblRows[i].cells[5].textContent,
                    "flagUrl"       : flags.getFlagURL(tblRows[i].cells[4].textContent)
                });
            }

            //console.log("MMM-PGA OWGR RANKINGS: " + JSON.stringify(owgrRanking));
            //Function to send SocketNotification with the Tournament Data
            callback(owgrRanking);
        }
    });
    }

};