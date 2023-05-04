//aquí aplico FETCH a una API externa y gratuita llamada weatherApi. Esta api requiere que te suscribas y una vez que lo haces, te llega al mail un ID

//aqui llamo algunos elementos del Dom, que deje preparados en el HTML para mostrar mis datos de busqueda
let results = document.querySelector(".results");
const form = document.querySelector(".get-weather");
const nameCity = document.getElementById("city");
const nameCountry = document.getElementById("country");

//evento click que  mediante la funcion callApi hace un fetch a la API
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (nameCity.value == "") {
    showError("el campo es obligatorio");
  }
  callApi(nameCity.value);
});
//La funcion callApi hace un fetch cuya url toma como urlParam la constante apiId que posee el ID que me llego por mail.
//se traen los datos en formato json. uno de ellos es el cod, que si no es 404 se llama a las funciones limpiar y showWeather(que trae todos los datos climatico) y si es 404 llamo a la funcion showError declarada mas abajo
function callApi(city) {
  const apiId = "f0a7f0f3db4828fe53d745728a831568";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&appid=${apiId}`;
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((dataJSON) => {
      if (dataJSON.cod === "404") {
        showError("ciudad no encontrada");
      } else {
        limpiar();
        showWeather(dataJSON);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function showWeather(data) {
  //aquí, por medio de destructuring traemos todos los datos climáticos de la API
  const {
    name,
    sys: { country },
    wind: { speed },
    main: { temp, pressure, humidity, feels_like },
    weather: [arr],
  } = data;
  //paso de kelvin a centígrados
  function kelvinACentigrados(temp) {
    return parseInt(Math.round(temp - 273.15));
  }
  //paso de nudos a km/h
  function nudosAkm(speed) {
    return Math.round(speed * 1.852);
  }
  //uso de la libreria luxon
  let DateTime = luxon.DateTime;
  let tiempo = DateTime.now();

  const velocidad = nudosAkm(speed);
  const degree = kelvinACentigrados(temp);
  const st = kelvinACentigrados(feels_like);

  //genero un div donde através de template strings armo la tarjetita con todos los datos para mostrar
  const content = document.createElement("div");
  content.innerHTML = `   
 <h2>Clima en ${name}, ${country}, a las ${tiempo.toLocaleString(
    DateTime.TIME_SIMPLE
  )}</h2>
 <img src="http://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="">
 
 <h3>${arr.description}</h2>
 
 <h3>temperatura:</h3><h5>${degree}°C</h5>
 <h3>sensación térmica:</h3><h5>${st}°C</h5>
 <h3>viento:</h3> <h5> ${velocidad} km/h</h5>
 <h3>presión atmosférica: </h3> <h5> ${pressure} hppa</h5>
 <h3>humedad:</h3> <h5> ${humidity} %</h5>
 `;

  results.appendChild(content);
}

//funcion showError que muestra el msj cada vez que el codigo es 404
function showError(msg) {
  console.log(msg);
  const alert = document.createElement("p");
  alert.classList.add("alert-message");
  alert.innerHTML = msg;
  form.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

//funcion limpiar, para limpiar cada busqueda cada vez que me fijo el clima de una nueva ciudad
function limpiar() {
  results.innerHTML = "";
}

