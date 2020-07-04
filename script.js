var CN = document.querySelector('.cityName')
var time = document.querySelector('.time')
var stan = document.querySelector('.stan')
var temp = document.querySelector('.temp')
var WindSpeed = document.querySelector('.WindSpeed')
var pressure = document.querySelector('.pressure')
var wilgotnosc = document.querySelector('.wilgotnosc')
var precip = document.querySelector('.precip')

var cities = [];
var input = document.getElementById('pogoda_search');
var suggestions  = document.querySelector('.suggestions');

var namelist;

var mylat;
var mylon;
var cityName;
var cityCountry;
var citylat;
var citylog;


navigator.geolocation.watchPosition( (e) => {
    mylat = e.coords.latitude;
    mylon = e.coords.longitude;
})



window.addEventListener('load' , (e) => {
    // fetch('http://api.ipapi.com/api/check?access_key=bfb01d6aca397cf9e58443613499b282')
    // .then(response => {
    // return response.json();
    // })
    // .then( data => {
    // var cityName = data.city;

    fetch(`http://api.weatherstack.com/current?access_key=f866cf8d34f93acb9477a397ccc1a89a&query=${mylat},${mylon}`)
    .then(result => {
        return result.json()
    })
    .then( data => {
        
        setWeather(data);
    })

})

function setWeather(data) {
    console.log(data)
        CN.innerHTML = data.location.name;
        time.innerHTML = data.location.localtime
        stan.innerHTML = data.current.weather_descriptions[0];
        temp.innerHTML = data.current.temperature;

        WindSpeed.innerHTML = data.current.wind_speed + " km/h";
        pressure.innerHTML = data.current.pressure + " hPa";
        wilgotnosc.innerHTML = data.current.humidity + "%";
        precip.innerHTML = data.current.precip + "%";
};


fetch('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json')
.then(response  => {
    return response.json();
})
.then( data => {
    cities.push(...data)
})
.then(data => {
    input.addEventListener('keyup', (e) => {
        if(e.code == "Enter"){
            inputFinder(e);
        }
    });
});

function inputFinder(e){ 
    var filter = filterFunction(e.path[0].value, cities)
    var html = filter.map( place => {
        cityName = place.name;
        cityCountry = place.country;
        citylat = place.lat;
        citylon = place.lng;
        return `
        <li>
            <span class="name" style="width: 100%;">${cityName}, ${cityCountry}</span>
            <span style="display:none;">${citylat}, ${citylon}</span>
        </li>`;
    }).join('');

    setHTML(html);
};

function filterFunction(myvalue, listcities){
    return listcities.filter( place => {
        const regex = new RegExp(myvalue, "i");
         return place.name.match(regex);
    })
};
function setHTML(html){
    suggestions.innerHTML = html;
    namelist = document.querySelectorAll('.name');
    checklist(namelist);
}

function checklist(list){
    list.forEach( l => {
        l.addEventListener('click', (e) => {
            var l_location = e.path[0].innerHTML;
            
            fetch(`http://api.weatherstack.com/current?access_key=f866cf8d34f93acb9477a397ccc1a89a&query=${l_location}`)
            .then(result => {
                return result.json()
            })
            .then( data => {
                setWeather(data);
            })
            .then(
                suggestions.innerHTML = "<li>Filter for a city</li>"
            )

        })
    })
}


