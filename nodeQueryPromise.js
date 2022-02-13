"use strict";
var util = require("util");
var hana = require("@sap/hana-client");
var PromiseModule = require("@sap/hana-client/extension/Promise.js");

var connOptions = {
  serverNode:
    "2a4c1176-a34f-4781-926e-dc3ffcab9492.hana.trial-eu10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Neabstract1!",
};

var connection = hana.createConnection();
var statement;

PromiseModule.connect(connection, connOptions)
    .then(() => {
         //Prepared statement example
         return PromiseModule.prepare(connection, 'CALL HOTEL.SHOW_RESERVATIONS(?,?)');
    })
    .then((stmt) => {
        statement = stmt;
        const parameters = [11, '2020-12-24'];
        return PromiseModule.executeQuery(stmt, parameters);
    })
    .then((results) => {
        return processResults(results);
    })
    .then((results) => {
        return PromiseModule.close(results);
    })
    .then(() => {
        PromiseModule.drop(statement);
    })
    .then(() => {
        PromiseModule.disconnect(connection);
    })
    .catch(err =>  {
        console.error(err);
    });

function processResults(results) {
    return new Promise((resolve, reject) => {
    var done = false;
        PromiseModule.next(results)
            .then((hasValues) => {
                if (hasValues) {
                    return PromiseModule.getValues(results);
                }
                else {
                    done = true;
                }
            })
            .then((values) => {
                if (done) {
                    resolve(results);
                }
                else {
                    console.log(util.inspect(values, { colors: true }));
                    return processResults(results);
                }
            })
            .catch (err => {
                reject(err);
            });
    })
}