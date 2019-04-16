restconsumer = require("./rest-client");

restconsumer.reqJSON((err, res) => {
  if (err) {
    return console.log("Error : " + err);
  }
  console.log(res);
});

postdata = { title: "nodejs", text: "Hello From Nodejs" };

//restconsumer.reqPost(postdata);
