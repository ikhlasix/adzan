const express = require('express');
var bodyParser = require('body-parser');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Middleware function to log request protocol
app.use('/things', function(req, res, next){
   console.log("A request for things received at " + Date.now());
   next();
});

// Route handler that sends the response
app.post('/api/', urlencodedParser, function(req, res){
   const adhan = require('adhan');
   const moment = require('moment-timezone');

   var prayerName = {
      "fajr" : "Fajr",
      "sunrise" : "Sunrise",
      "dhuhr" : "Dhuhr",
      "asr" : "Asr",
      "maghrib" : "Maghrib",
      "isha" : "Isha",
   };

   const coordinates = new adhan.Coordinates(req.body.lat,req.body.lon);
   const params = adhan.CalculationMethod.Egyptian();
   const date = new Date(req.body.date);

   const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
   const sunnahTimes = new adhan.SunnahTimes(prayerTimes);

   const fajr = moment(prayerTimes.fajr).tz('Asia/Jakarta').format('MMMM DD, YYYY h:mm A');
   const sunrise = moment(prayerTimes.sunrise).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const dhuhr = moment(prayerTimes.dhuhr).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const asr = moment(prayerTimes.asr).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const maghrib = moment(prayerTimes.maghrib).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const isha = moment(prayerTimes.isha).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const mon = moment(sunnahTimes.middleOfTheNight).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const ton = moment(sunnahTimes.lastThirdOfTheNight).tz('America/New_York').format('MMMM DD, YYYY h:mm A');
   const curr = prayerName[prayerTimes.currentPrayer()];
   const qibla = adhan.Qibla(coordinates);

   res.json({
               "status": res.statusCode,
               "request": req.body,
               "result": {
                  "fajr": fajr,
                  "sunrise": sunrise, 
                  "dhuhr": dhuhr, 
                  "asr": asr, 
                  "maghrib": maghrib,
                  "isha": isha, 
                  "middle_of_night": mon, 
                  "last_third_of_night": ton, 
                  "current_prayer": curr, 
                  "qibla": qibla
               }
            });
});

app.get('/api/', urlencodedParser, function(req, res){
   res.status(404);
   res.statusMessage = "Not Found"
   res.json({
      "status": res.statusCode,
      "request": req.body,
      "result": {
         "message": res.statusMessage
      }
   });
});

app.listen(3000);