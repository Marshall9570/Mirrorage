

//API Key Specific to user account with openweathermap.org
var API_KEY = "YOURAPIKEY";

//city ID provided by openweathermap.org
var cityid = 6049429;

//variables used to obtain data
var temp;
var loc;
var desc;
var tempmin;
var tempmax;
var humidity;
var icon;

//when the page loads, the variables will initialize corresponding to those on the html page
window.onload = function() {
	loc = document.getElementById("location");
	temp = document.getElementById("temperature");
	desc = document.getElementById("description");
	tempmin = document.getElementById("temperaturemin");
	tempmax = document.getElementById("temperaturemax");
	humidity = document.getElementById("humidity");
	icon = document.getElementById("icon");
	
	//building our object with some default values/strings incase something is offline these will remain
	var weather = {};
	weather.humidity = 35;
	weather.loc = "Location";
	weather.temp = "Actual Temp";
	weather.tempmin = "Min Temp";
	weather.tempmax = "Max Temp";
	weather.desc = "Description";
	weather.icon = "01d";
	
	//calls start time to begin
	startTime();
	//calls updatebyid to begin the data pulling from openweathermap
	UpdateById(cityid);
}

function update(weather){
	//removing trailing decimals from numerical values
	weather.temp = weather.temp.toFixed(0);
	weather.tempmin = weather.tempmin.toFixed(0);
	weather.tempmax = weather.tempmax.toFixed(0);
	
	//sending weather variables to html file to be displayed
	humidity.innerHTML = weather.humidity;
	temp.innerHTML = weather.temp;
	desc.innerHTML = weather.desc;
	tempmin.innerHTML = weather.tempmin;
	tempmax.innerHTML = weather.tempmax;
	loc.innerHTML = weather.loc;
	//updating soure location per icon response
	icon.src = "img/" + weather.icon + ".png";
}

//builds the request with the city ID and the user API key
function UpdateById(id){
	var url = "http://api.openweathermap.org/data/2.5/weather?" + "id=" + id + "&appid=" + API_KEY;
	
	SendRequest(url);
	
}

//creates an xmlhttp request which is a built-in js function that allows
function SendRequest(url){
	var xmlhttp = new XMLHttpRequest();
	//when the request gets a response back from openweathermap; callback
	xmlhttp.onreadystatechange = function(){
		//if the ready state is 4 it means we have recieved an object back
		//if the status is 200, it means the request was successfult
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			//using built in json functionality to allow use to sift through the data
			var data = JSON.parse(xmlhttp.responseText);
			//construct weather object
			var weather = {};
			//assigning the json we got back to the various fields used in display
			weather.humidity = data.main.humidity;
			weather.desc = data.weather[0].description;
			weather.loc = data.name;
			weather.temp = data.main.temp - 273.15;
			weather.tempmin = data.main.temp_min - 273.15;
			weather.tempmax = data.main.temp_max - 273.15;
			weather.icon = data.weather[0].icon;
			//call update weather function to send values over to html page
			update(weather);
			
		}
	};
	//open with a get request with the url
	xmlhttp.open("GET", url, true);
	//once opened, send is called which will push our request to openweathermap
	xmlhttp.send();
}

//interval functions used to make sure everything remains up to date
//whole page will reload once a day
setInterval(function() {
	window.location.reload();
}, 86400000); 

//weather will update every 10 mins
setInterval(function(){
	UpdateById(cityid);
}, 600000);

//function used to show real time using the system time
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
	//check what hours is at to obtain am or pm
    var ampm = (h >= 12) ? "PM" : "AM";
	//brings weather to 12 hours time
	if(h>12){
		h=h-12;
	}
	//send time data over to html page 
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s + " " + ampm;
    var t = setTimeout(startTime, 500);
	//send date over to html page
	document.getElementById("date").innerHTML = today.toDateString();
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


