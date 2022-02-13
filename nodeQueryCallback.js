'use strict';
var util = require('util');
var hana = require('@sap/hana-client');

var connOptions = {
    serverNode: "2a4c1176-a34f-4781-926e-dc3ffcab9492.hana.trial-eu10.hanacloud.ondemand.com:443",
    encrypt: "true",
    sslValidateCertificate: "false",
    uid: "DBADMIN",
    pwd: "Neabstract1!",
  };

//Asynchronous example calling a stored procedure with callbacks
var connection = hana.createConnection();

connection.connect(connOptions, function(err) {
    if (err) {
        return console.error(err);
    }
    //Prepared statement example
    const statement = connection.prepare('CALL HOTEL.SHOW_RESERVATIONS(?,?)');
    const parameters = [11, '2020-12-24'];
    var results = statement.execQuery(parameters, function(err, results) {
        if (err) {
            return console.error(err);
        }
        processResults(results, function(err) {
            if (err) {
                return console.error(err);
            }
            results.close(function(err) {
                if (err) {
                    return console.error(err);
                }
                statement.drop(function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    return connection.disconnect(function(err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                });
            });
        });
    });
});

function processResults(results, cb) {
    results.next(function (err, hasValues) {
        if (err) {
            return console.error(err);
        }
        if (hasValues) {
            results.getValues(function (err, row) {
                console.log(util.inspect(row, { colors: false }));
                processResults(results, cb);
            });
        }
        else {
            return cb();
        }
    });
}