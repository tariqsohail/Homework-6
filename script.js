$(document).ready(function () {
    showPreviousCities();
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    $('#submitWeather').click(function (event) {
        event.preventDefault();
        var newCity = $("#locale").val().trim();
        cities = JSON.parse(localStorage.getItem("cities")) || [];

        if (newCity != "") {
            cities.unshift(newCity);
            cities = Array.from(new Set(cities));
            if (cities.length >= 12) {
                cities.pop();
            }
        }

        localStorage.setItem('cities', JSON.stringify(cities));
        //console.log(cities);
        var city = $("#locale").val();
        renderCityButtons();
        getTheWeather(city);

    });
    $(document).on("click", ".fatCity", function () {
        var city = $(this).attr("data-name");
        getTheWeather(city);
    });
});
$('#clearStorage').click(function (event) {
    clearStorage();
});

var cities = [];
var startDate = moment();
var dateOne = moment(startDate, 'dddd').add(24, 'hours');
var dateTwo = moment(startDate, 'dddd').add(48, 'hours');
var dateThree = moment(startDate, 'dddd').add(72, 'hours');
var dateFour = moment(startDate, 'dddd').add(96, 'hours');
var dateFive = moment(startDate, 'dddd').add(120, 'hours');


function postToHtml(response) {
    $(".icon").empty();
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(".tempF").text("Temperature" + tempF + "Fahrenheit");
    var iconcode = response.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";

    $(".city").html("<h1>" + response.name + " <img class='smIcon' src='" + iconurl + "' ></h1>");
    $(".time").html("<h3>" + startDate.format('dddd') + ",  " + startDate.format('LL') + "</h3>");
    $(".wind").text("Wind Speed: " + response.wind.speed.toFixed(0) + " mph");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".temp").text("Temperature: " + tempF.toFixed(0) + "°F");
};


function fiveDayForecast(response) {
    $("#dayContainer").empty();
    var tally = 0;
    for (i = 0; i < 40; i++) {
        anotherDay = response.list[i].dt_txt;
        anotherDay = anotherDay.slice(-8);

        if (anotherDay === "15:00:00") {
            tally++;
          
            var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
            $("#dayContainer").append("<div class='column' id='dayColumn'><div id='forecastBox'><p id='time" + tally + "'><hr></p> <div class='weatherIcon" + tally + "day'></div><div class='temp" + tally + "day'></div><div class='humidity" + tally + "day'></div></div>'");

            var iconcode = response.list[i].weather[0].icon;
            //console.log(iconcode);
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            //console.log(iconurl);

            var weatherData = ".weatherIcon" + tally + "day";
            //console.log(weatherData);
            $(weatherData).append("<img src='" + iconurl + "'>");
            var humidityData = ".humidity" + tally + "day";
            //console.log(humidityData);
            $(humidityData).text("Humidity: " + response.list[i].main.humidity + "%");
            var tempData = ".temp" + tally + "day";
            //console.log(tempData);
            $(tempData).text("Temperature: " + tempF.toFixed(0) + "°F");
            
        } 
    } 
    
    $("#time1").html("<h4>" + dateOne.format('dddd') + "<h4>");
    $("#time2").html("<h4>" + dateTwo.format('dddd') + "<h4>");
    $("#time3").html("<h4>" + dateThree.format('dddd') + "<h4>");
    $("#time4").html("<h4>" + dateFour.format('dddd') + "<h4>");
    $("#time5").html("<h4>" + dateFive.format('dddd') + "<h4>");
}



function renderCityButtons() {
    $("#buttons-view").empty();
    for (var i = 0; i < cities.length; i++) {
        var a = $("<button id='cityButton'>");
        a.addClass("fatCity");
        a.attr("data-name", cities[i]);
        a.text(cities[i]);
        $("#buttons-view").append(a);
    }
}

function renderUV(data) {
    $("#uvValue").html("UV Index: <div id = 'dataValue'>" + data.value + "</div>");
    if (data.value > 5) {
        $("#dataValue").css("background", "red");
    }
    else if (data.value >= 3 && data.value <= 5) {
        $("#dataValue").css("background", "yellow")
    }
    else if (data.value <= 2) {
        $('#dataValue').css('background', 'green');
    }
}



function showPreviousCities() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    
    $("#buttons-view").empty();
    
    for (var i = 0; i < cities.length; i++) {

       
        var a = $("<button>");
       
        a.addClass("fatCity");
        
        a.attr("data-name", cities[i]);
       
        a.text(cities[i]);
        
        $("#buttons-view").append(a);
    }

}
function getTheWeather(city) {
   
    if (city != '') {
        $("#error").html(""); 

        $.ajax({ 
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=05704eed827c348a42aefa846e03d80c",
            method: "GET"
        }).then(function (response) {

            
            postToHtml(response);
            $.ajax({ 
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&APPID=05704eed827c348a42aefa846e03d80c",
                method: "GET"
            }).then(function (data) { 
                
                renderUV(data);

            });
        });
        $.ajax({ 
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=790cf6ec7fe5512d347deb73bd7b4690",
            method: "GET"
        }).then(function (response) { 
            //console.log(response);
            fiveDayForecast(response);
        });
    } else { 
        $("#error").html('Field cannot be empty');
    }
}
function clearStorage() {
   
    localStorage.clear();
    $("#buttons-view").empty();
}