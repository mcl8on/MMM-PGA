/* Heper module to work with data provided by the api. Runs on the server side.
This module will be refactored in the Next version of the applcation*/




const moment = require('moment');

module.exports = {


    VAL: "12",
    pgaObj : null,
    event: null,
    course: null,

    set pgaData(pgaObj){
        this.pgaObj = pgaObj;
        this.event = pgaObj[0];
        this.course = this.event.courses[0];
    },

    setUndefStr: function(obj,defStr = ""){
        return (typeof obj == "undefined")?defStr:obj;
    },


    get pgaData(){
        return this.pgaObj;
    },

    get coursename(){
        return "course Name";
    },
    get purse(){
        return "$" + this.VAL;
    },


    get eventObj(){
        return this.event;
    },

    get eventName(){    
        return this.event.shortName;
        //return "U.S. Open";
    },

    get eventStatus(){
        return this.event.competitions[0].status.type.shortDetail;
    },

    get eventDate(){

        var startDate = moment(this.event.date, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
        var endDate = moment(this.event.endDate, "YYYY-MM-DD HH:mm Z").local().format("MMM DD");
        return startDate + " - " + endDate;
    },

    get eventDefendingChampion(){
        return this.setUndefStr(this.event.defendingChampion.athlete.displayName,"None");
    },

    get eventPurse(){
        return this.setUndefStr(this.event.displayPurse,"None");
    },

    get eventLocation(){

        var city = this.setUndefStr(this.course.address.city);
        var state = this.setUndefStr(this.course.address.state);
        var appendstring =", ";

        if (city.length == 0 || state.length ==0){
            appendstring = "";
        }


        return this.course.name+ " " + city + appendstring + state;
        //return "Winged Foot, Mamaroneck NY";
    },

    get eventAvailable(){
        return true;

    },

    get tournamentStatus(){
        return this.event.status.type.name;
    }

   
};