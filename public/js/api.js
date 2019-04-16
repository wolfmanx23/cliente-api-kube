// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/mensaje';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal
    // methods
    // from calling the methods without any of the callbacks that are added
    // elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      console.log("***ENVIANDO CONTEXTO***"+context);
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    console.log("por llamar url>>"+text+"<<>>"+context+"<<>>"+payloadToWatson.input.text);
    var params = JSON.stringify(payloadToWatson);
    console.log("params>>"+params);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    //if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    //}

    http.open('GET', messageEndpoint+"?texto="+text+"&contexto="+context, false);
    console.log("llamo url");
    console.log("headers");
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    http.setRequestHeader("Content-length", params.length);
    http.setRequestHeader("Connection", "close");

    http.onreadystatechange = function() {
      console.log("respuesta");
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        //window.alert("regreso la respuesta");
        console.log(http.responseText);
        var respuesta=JSON.parse(http.responseText);
        console.log(respuesta);
        Api.setResponsePayload(http.responseText);

      }
    };


    // Send request
    http.send(params);
  }
}());
