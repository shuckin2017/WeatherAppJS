const city = 'moscow';
const key = 'd4ed96f83af6fc00c1799436b53137b6';
const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=ru`;

const weatherCity = document.querySelector('.weather-content__title'),
      inputCity = document.querySelector('.weather-header__input'),
      buttonAddCity = document.querySelector('.weather-header__btn'),
      weatherCityList = document.querySelector('.city-block__list');

buttonAddCity.addEventListener('click', (e)=> eventBtn(e));

buttonAddCity.addEventListener('keydown', (e) => {
  if (e.keyCode == 13) {
    eventBtn(e)
  }
});

const eventBtn = (e) => {
  e.preventDefault();
    weatherCityList.innerHTML = '';
    sendWeatherCity(inputCity.value);
    inputCity.value = '';
};

const mapWeatherDays = (data) => {
    const tempArrC = [],
          timeArr = [];
  
    let cityArr = JSON.parse(data);
    addCityName(cityArr.city.name);
  
    let mainArr = JSON.parse(data);
      mainArr.list.forEach((elem) => {
        const weatherMathF = elem.main.temp;
        tempArrC.push(Math.floor(weatherMathF - 273.15));
        const formatDate =`${new Date(elem.dt_txt).toLocaleDateString()}, ${new Date(elem.dt_txt).toLocaleTimeString()}`;
        timeArr.push(formatDate);
        sendWeatherInfo(elem.main.temp_min, elem.main.temp_max, elem.dt_txt, elem.weather[0].icon);
      });
      showChart(tempArrC, timeArr);
};

const sendWeatherCity = (newCity) => {
  const newUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${newCity}&appid=${key}&lang=ru`;
  const promiseWeather = getPromiseWeather(newUrl);
  promiseWeather.then((data) => mapWeatherDays(data));
};

const myRequest = new XMLHttpRequest();

function getPromiseWeather(newUrl){
  return new Promise((resolve, regect) => {
    console.log('Loading...');
    if(newUrl) {
      myRequest.open('GET', newUrl);
    } else {
      myRequest.open('GET', url);
    }
    myRequest.send();
    myRequest.onload = ()=> {
      const status = myRequest.status;
      if(status < 400) {
        // resolve - callback внути then
        resolve(myRequest.response);
      } else {
        console.log('Ошибка запроса');
      }
    };
  });
}

const addCityName = (city) => {
  if(city) {
    weatherCity.innerHTML = city;
  } else {
    weatherCity.innerHTML = 'Error';
  }
};

const createWeatherElem = (temp_min, temp_max, dt_txt, url) => {
  
  const itemWeather = document.createElement('div'),
        iconWeather = document.createElement('img'),
        tempWeather = document.createElement('div'),
        dataWeather = document.createElement('div');

 itemWeather.className = 'city-block__item';
 iconWeather.className = 'icon svg-weather';
 tempWeather.className = 'city-block__temp';
 dataWeather.className = 'city-block__day';

//  if(temp_min < 0) {
//   itemWeather.style.backgroundColor = 'red';
//  }

 iconWeather.src = url;
 tempWeather.innerHTML = `${temp_min}/${temp_max}`;
 dataWeather.innerHTML = dt_txt;

 itemWeather.appendChild(iconWeather);
 itemWeather.appendChild(tempWeather);
 itemWeather.appendChild(dataWeather);
 weatherCityList.appendChild(itemWeather);
 return weatherCityList;
};

const sendWeatherInfo = (minTemp, maxTemp, date, icon) => {
  const daysList = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const day = daysList[new Date(date).getDay()];

  const mixTempC = Math.floor(minTemp - 273.15);
  const maxTempC = Math.floor(maxTemp - 273.15);
  const data = `${new Date(date).getDate()}, ${day}`;
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  createWeatherElem(maxTempC, mixTempC, data, iconUrl);
};

const testPromise = getPromiseWeather();

testPromise.then((data) => mapWeatherDays(data));

  function showChart(dataOy, dataOx, datуColor) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataOx,
            datasets: [{
                label: weatherCity.innerHTML,
                data: dataOy,
                backgroundColor: [
                    'rgba(104, 190, 162, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
              labels: {
                  // This more specific font property overrides the global property
                  fontColor: 'black',
                  FontSize: 8
              }
          }
        }
    });
};

