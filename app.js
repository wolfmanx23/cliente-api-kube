/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var cors = require('cors');
var maintainToneHistory = false;

// The following requires are needed for logging purposes
var uuid = require('uuid');
var vcapServices = require('vcap_services');
var basicAuth = require('basic-auth-connect');

// The app owner may optionally configure a cloudand db to track user input.
// This cloudand db is not required, the app will operate without it.
// If logging is enabled the app must also enable basic auth to secure logging
// endpoints
//var cloudantCredentials = vcapServices.getCredentials('cloudantNoSQLDB');
//var cloudantUrl = null;
//if (cloudantCredentials) {
//  cloudantUrl = cloudantCredentials.url;
//}
//cloudantUrl = cloudantUrl || process.env.CLOUDANT_URL; // || '<cloudant_url>';
var logs = null;
var app = express();

// Bootstrap application settings
app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

app.get('/apicalcula', function(req, res) {
    var query = req.query;
    console.log('query: ', query);
    var monto= query.monto;
    var duracion= query.duracion;
    var tasa= query.tasa;
    var options = { method: 'GET',
      url: 'https://api.us-south.apiconnect.appdomain.cloud/pedrombaorg-thinksummit/sb/apifinanciar/calcular',
      qs:
       { monto: monto,
         duracion: duracion,
         tasa: tasa },
      headers:
       { accept: 'application/json',
         'x-ibm-client-id': 'd46a863e-4f3f-491d-800e-5c749713974e' } };
    console.log('options: ', options);
    var request = require("request");



    request(options, function (error, response, body)
    {
        if (error)
          return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
        return res.json(body);
        //return body;
    });
});
module.exports = app;
