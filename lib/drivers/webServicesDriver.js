/*******************************************************************************
 *  Code contributed to the webinos project
 * 
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Author: Daniela Ventura - University of Catania
 * 
 ******************************************************************************/

var util = require('util')
  , fs = require("fs")
  , path = require("path")
  , driversLocation = __dirname+'/exernalServices/';
;

var handlers = {};

(function () {
    'use strict';

    var driverId = null;
    var registerFunc = null;
    var removeFunc = null;
    var callbackFunc = null;

    var moduleDrivers = new Object();
    var elementsList = new Array();


    /*
    * This function is called to initialize the driver.
    * @param dId Identifier of the driver
    * @param regFunc This is the function to call to register a new sensor/actuator
    * @param cbkFunc This is the function to call to send back data
    *
    */

    exports.init = function(dId, regFunc, remFunc, cbkFunc) {
        console.log('Exernal Web Services driver init - id is ' + dId);
        driverId = dId;
        registerFunc = regFunc;
        removeFunc = remFunc;
        callbackFunc = cbkFunc;

        try{
            var filePath = path.resolve(__dirname, "../../config.json");
            fs.readFile(filePath, function(err,data) {
                if (!err) {
                    var settings = JSON.parse(data.toString());
                    var drivers = settings.params.drivers;
                    try{
                        for (var key in drivers) { 
                            var module = drivers[key];

                            //set elementList
                            elementsList.push({
                                'type': key,
                                'name': module.name,
                                'description': module.description,
                                'sa': 1,
                                'range' : [ []],
                                'interval': 0,
                                'value': 0,
                                'running': false,
                                'id': 0
                            });

                            //set moduleDrivers
                            moduleDrivers[key] = require(driversLocation + module.filename);

                            moduleDrivers[key].exernalServiceInit();
                        }
                        setTimeout(initElem, 2000);
                    }
                    catch(e){
                        console.log("Error to load config file - Check please!" + e);
                    }
                }
            });
        }
        catch(err){
            console.log("Error : "+err);
        }
    }

    /*
    * This function is called to execute a command
    * @param cmd The command
    * @param eId Identifier of the element that should execute the command
    * @param data Data of the command
    *
    */
    exports.execute = function(cmd, eId, data, errorCB, successCB) {
        switch(cmd) {
            case 'value':
                var elem = {};
                for(var i in elementsList) {
                    if(elementsList[i].id == eId){
                        elem = elementsList[i];
                        break;
                    }
                }
                moduleDrivers[elem.type].doPost(data);
                callbackFunc('data', elem.id, data);
                break;
            default:
                console.log('HTTP driver 1 - unrecognized cmd');
        }
    }

    function initElem(){
        for(var i in elementsList) {
            var json_info = {type:elementsList[i].type, name:elementsList[i].name, description:elementsList[i].description, range:elementsList[i].range};
            elementsList[i].id = registerFunc(driverId, elementsList[i].sa, json_info);
        };
    }




}());
