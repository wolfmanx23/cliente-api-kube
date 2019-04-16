var request = require("request");

module.exports = {

  reqJSON: () => {
    var options = { method: 'GET',
      url: 'https://api.us-south.apiconnect.appdomain.cloud/pedrombaorg-thinksummit/sb/apifinanciar/calcular',
      qs:
       { monto: '200',
         duracion: '4',
         tasa: '1' },
      headers:
       { accept: 'application/json',
         'x-ibm-client-id': 'd46a863e-4f3f-491d-800e-5c749713974e' } };

    request(options, function (error, response, body) {
      if (error) return console.error('Failed: %s', error.message);

      console.log('Success: ', body);
    });
  }
};
