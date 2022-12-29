"use strict";

const apiKey = "at_SQ2YPNBbRxw1cx3rU2QLwBHMsHyFi";

const currentIp = document.querySelector(".data__ip");
const currentLocation = document.querySelector(".data__location");
const currentTimeZone = document.querySelector(".data__zone");
const currentIsp = document.querySelector(".data__isp");

const searchInput = document.querySelector(".search__input");
const searchBtn = document.querySelector(".search__btn");
const errorMessage = document.querySelector(".error-message");

const renderError = (msg) => {
  errorMessage.textContent = msg;
  setTimeout(() => {
    errorMessage.textContent = "";
  }, 4000);
};
// Map creation start
const map = L.map("map");

L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// marker icon/icon size
const myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [32, 40],
  iconAnchor: [10, 30],
});

let markerIcon;
// Map view by coords(lat/lng)
const updateCoords = (coords) => {
  map.setView(coords, 16);

  // If marker icon is on the map (marker icon not null), we remove it, if there is we render marker icon.(this happens when we render a web page for the firs time)
  if (markerIcon != null && markerIcon != undefined) markerIcon.remove();
  // We update marker icon coords (lat/lng) and add on the map
  markerIcon = L.marker(coords, { icon: myIcon });
  markerIcon.addTo(map);
};

const renderLocationData = (data) => {
  currentIp.innerHTML = data.ip;
  currentLocation.innerHTML = `${data.location.city} ${data.location.country} ${data.location.postalCode}`;
  currentTimeZone.innerHTML = data.location.timezone;
  currentIsp.innerHTML = data.isp;
  const { lat } = data.location;
  const { lng } = data.location;
  const coords = [lat, lng];
  console.log(coords);
  updateCoords(coords);
};

const noIpData = (data) => {
  currentIp.innerHTML = data;
  currentLocation.innerHTML = data;
  currentTimeZone.innerHTML = data;
  currentIsp.innerHTML = data;
};

const ipData = (ipRequested = "") => {
  const url =
    ipRequested === ""
      ? `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=`
      : `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipRequested}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        noIpData("N/A");
        throw new Error(`Please enter a valid IP address`);
      }
      return response.json();
    })
    .then((data) => {
      renderLocationData(data);
    })

    .catch((err) => {
      console.error(`${err}`);
      renderError(`${err.message} and try again!`);
    });
};
ipData("");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInput.value != "" && searchInput.value != null) {
    ipData(searchInput.value);
    return;
  }
});
