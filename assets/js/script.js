$(document).ready(function() {
    localStorage.clear();
});
// for loop to carry data to HTML
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
   
    var cityName = $(".listing").addClass("list");
  
    cityName.append("<li>" + city + "</li>");
}

  
// API Key
var apiKey = "92f60150913e612e49519c5ef9cef745";
var keyCount = 0;
 
// Search button click event
$(".button").click(()=> {
    //User input value
    var userInput = $(".input").val(); 

    getCityData(userInput);
    fiveDays(userInput);
});

//function to getCityData for today
function getCityData(city) {
    var today = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&Appid=" + apiKey + "&units=imperial";
    //reload data 
    //throw error if null
    if (city == null) {
        throw "No value entered for city";
    }
    //log empty string if no string entered
    else if (city == "") {
        console.log(city);
    } else {
        //Ajax request to get city weather data for today
        $.ajax({
            url: today,
            method: "GET"
        }).then((response) => {
            var cityName = $(".list-group").addClass("list");
            
            
            

            //append response to cityName list
            cityName.append("<button class=cityBtn id=cityBtn onclick=prevBtnDetails()> <li id=cityList>" +  city + "</li> </button>");
            // Local storage
            var local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;
    
            // Start Current Weather append 
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            
            currentCard.append(currentName);
    
            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp 
            var currentTemp = currentName.append("<p>");
            // .addClass("card-text");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");
    
            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;
    
            // UV Index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {
    
                var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentTemp.append(currentUV);
                // currentUV.append("UV Index: " + response.value);
            });
        
            
        });
            }

}

//function to get city data for the next 5 days
function fiveDays(city) {
    var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&Appid=" + apiKey + "&units=imperial";
    if (city == null) {
        throw "No value entered for city";
    }
    //log empty string if no string entered
    else if (city == "") {
        console.log(city);
    } else {
        // Start call for 5-day forecast 
        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(function (response) {
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach( (i) => {
                var UTC1 = new Date(response.list[i].dt * 1000);
                UTC1 = UTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=cardColor>" + "<p>" + UTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");


            })

        });
    }

}

function prevBtnDetails() {
    var city = document.getElementById("cityList").innerHTML;
    getCityData(city);
    fiveDays(city);
}
