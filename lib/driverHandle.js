(function () {
    var fs = require('fs');
    var path = require("path");
    var managerDriversLocation = __dirname+'/drivers/webServicesDriver.js';

    exports.getDrivers = function(){
        var drivers = new Array();
        try {
            drivers.push(require(managerDriversLocation));
        }
        catch(e) {
            console.log('Error: cannot load driver ' + managerDriversLocation);
            console.log(e.message);
        }
        return drivers;
    };

}()); 
