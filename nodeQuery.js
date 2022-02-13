'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
var util = require('util');
var hana = require('@sap/hana-client');

var connOptions = {
    serverNode: "2a4c1176-a34f-4781-926e-dc3ffcab9492.hana.trial-eu10.hanacloud.ondemand.com:443",
    encrypt: "true",
    sslValidateCertificate: "false",
    uid: "DBADMIN",
    pwd: "Neabstract1!",
  };

  var connection = hana.createConnection();
  connection.connect(connOptions);

var sql = 'select TITLE, FIRSTNAME, NAME from HOTEL.CUSTOMER;';
var t0 = performance.now()
var result = connection.exec(sql);
console.log(util.inspect(result, { colors: true }));
var t1 = performance.now();
console.log("time in ms " +  (t1 - t0));
connection.disconnect();