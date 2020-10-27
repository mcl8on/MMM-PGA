
const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const flags = require('./flags.js');


//TODO: Add comments

module.exports = {

    url: "https://www.pgatour.com/fedexcup/official-standings.html",
  
    getFedExCupData: function(maxPlayers, callback){

    request({
        url: this.url,
        method: 'GET'
    }, (error, response, body) => {


        console.log("MMM-PGA retrieving FedEx Cup Standings");
        
        if (!error && response.statusCode == 200) {

            var fcRanking={pointsHeading: "Total Points", rankings: []};
           

            var dom = new JSDOM(response.body);
           
            var tblCont = dom.window.document.getElementsByClassName("table-fedexcup-standings");

            var tblRows = tblCont[0].querySelectorAll("tr");
            numPlayers = 0;
            for (var i = 1; i < tblRows.length; i++) {
                
                
                if (tblRows[i].cells.length >1){

                    numPlayers++;

                    name = tblRows[i].cells[2].textContent;
                    fcRanking.rankings.push({ 
                        "name"          : name,
                        "curPosition"   : tblRows[i].cells[0].textContent,
                        "lwPosition"    : tblRows[i].cells[1].textContent,
                        "points"        : tblRows[i].cells[4].textContent.trim(),
                        "flagUrl"       : flags.getFlagURL(name)
                    });

                    if (numPlayers == maxPlayers) break;
                }
            }
            //Function to send SocketNotification with the Tournament Data
            callback(fcRanking);
        } else {
            console.log("MMM-PGA Error Loading Fedex Cup Data Error Code:" + JSON.stringify(error) + " Status Code: " + response.statusCode );
        }
    });
    }

};