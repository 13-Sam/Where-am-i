// 'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// // Our First AJAX Call: XMLHttpRequest

// // const getCountryAndNeighbour = function (country) {
// //   //   const newReq = fetch(`https://restcountries.com/v2/name/${country}`);
// //   //   const data = newReq.JSON();
// //   const request = new XMLHttpRequest();
// //   request.open('GET', `https://restcountries.com/v2/name/${country}`);
// //   request.send();

// //   request.addEventListener('load', function () {
// //     const [data] = JSON.parse(this.responseText);
// //     console.log(data);

// //     // render country 1
// //     renderCountry(data);

// //     //neighbour country
// //     const [neighbour] = data.borders;
// //     if (!neighbour) return;

// //     //ajx call 2
// //     const request2 = new XMLHttpRequest();
// //     request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
// //     request2.send();

// //     request2.addEventListener('load', function () {
// //       const data2 = JSON.parse(this.responseText);
// //       console.log(data2);
// //       renderCountry(data2, 'neighbour');
// //     });
// //   });
// // };

// // getCountryAndNeighbour('portugal');
// const getJson = function (url, errorMsg = 'Something went wrong') {
//   return fetch(url).then(response => {
//     if (!response.ok) throw new Error(errorMsg);
//     return response.json();
//   });
// };

// const getCountryData = function (country) {
//   return getJson(
//     `https://restcountries.com/v2/name/${country}`,
//     'Country Not Found'
//   )
//     .then(data => {
//       console.log(data);
//       renderCountry(data[0]);
//       const neighbour = data[0].borders[0];
//       if (!neighbour) throw new Error('Neighbour not found');
//       console.log(neighbour);
//       return getJson(
//         `https://restcountries.com/v2/alpha/${neighbour}`,
//         'meighbour  not found'
//       );
//       //   return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
//     })
//     .then(data => {
//       console.log(data);
//       renderCountry(data, 'neighbour');
//     })
//     .catch(err => console.log(err))
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };
// getCountryData('pakistan');
// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   err => console.log(err)
// );
//
// // getPosition().then(pos => console.log(pos));
// const whereAmI = function () {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longtide: lng } = pos.coords;

//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//       );
//     })

//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.countryCode}`);

//       return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found (${res.status})`);

//       return res.json();
//     })
//     .then(data => {
//       console.log(data[0]);
//       renderCountry(data[0]);
//     })
//     .catch(err => console.error(`${err.message} 💥`));
//   btn.style.opacity = 0;
// };
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const whereAmI = async function () {
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;
  // const data = await pos.json();
  // console.log(lat, lng);
  const country = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  );
  const countryData = await country.json();
  if (!country) throw new Error('Country Not Found');

  console.log(countryData);
  const geoCountry = await fetch(
    `https://restcountries.com/v2/name/${countryData.countryName}`
  );
  const geoCountryData = await geoCountry.json();
  if (!geoCountryData) throw new Error('Something went wrong');
  console.log(geoCountryData);
  console.log(geoCountryData[0].borders[0]);

  renderCountry(geoCountryData[0]);
  const neighbour = geoCountryData[0].borders[0];
  const neighbourCountry = await fetch(
    `https://restcountries.com/v2/alpha/${neighbour}`
  );
  const neighbourCountryData = await neighbourCountry.json();
  if (!neighbourCountryData) throw new Error('Neighbour not found');
  renderCountry(neighbourCountryData, 'neighbour');
  // const neighbour = geoCountryData[0].border[0];

  // if (!neighbour) return;
  // const neighbourData = await fetch(
  //   `https://restcountries.com/v2/alpha/${neighbour}`
  // );
  // console.log(neighbourData);
};
whereAmI();

const getJson = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(errorMsg);
    return response.json();
  });
};
const datas = Promise.all([
  getJson(`https://restcountries.com/v2/name/italy`),
  getJson(`https://restcountries.com/v2/name/usa`),
  getJson(`https://restcountries.com/v2/name/bangladesh`),
]).then(res => console.log(res.map(r => r[0].capital)));
