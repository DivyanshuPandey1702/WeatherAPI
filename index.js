const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const city = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=" +
    unit +
    "&appid=" +
    apiKey;
  var weatherData;

  https
    .get(url, (response) => {
      response.on("data", function (data) {
        weatherData = JSON.parse(data);
        console.log(weatherData);
        const name = weatherData.name;
        const temp = weatherData.main.temp;
        const img =
          "http://openweathermap.org/img/wn/" +
          weatherData.weather[0].icon +
          "@2x.png";
        res.write(
          "<h1>The temperature in " +
            name +
            " is " +
            temp +
            " degree celsius.</h1>"
        );
        const description =
          "<p>The weather is currently " +
          weatherData.weather[0].description +
          "</p>";
        res.write(description);
        res.write("<img src='" + img + "'></img>");
        res.send();
      });
    })
    .on("error", (e) => {
      console.error(e);
    });
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
