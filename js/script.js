"use strict";

const apiKey = "at_a8h5P03D0MPft1u9Cg58Fz6T156Ci";

const currentIp = document.querySelector(".data__ip");
const currentLocation = document.querySelector(".data__location");
const currentTimeZone = document.querySelector(".data__zone");
const currentIsp = document.querySelector(".data__isp");

const searchInput = document.querySelector(".search__input");
console.log(searchInput);
const searchBtn = document.querySelector(".search__btn");

if (
  navigator.geolocation &&
  searchInput.value === ""
  // &&  searchInput.value != null
)
  // Shows my location
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    updateCoords(coords);
    console.log(position);
  });

const updateCoords = (coords) => {
  // Checks if there is the map
  const container = L.DomUtil.get("map");
  console.log(container);
  if (container != null) {
    container._leaflet_id = null;
  }
  // If so, update to the new map
  const map = L.map("map").setView(coords, 13);
  console.log(map);
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Transform marker icon
  const markerIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [32, 40], // size of the icon
    iconAnchor: [10, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [2, -40], // point from which the popup should open relative to the iconAnchor
  });
  // The marker icon shows the location
  L.marker(coords, { icon: markerIcon }).addTo(map).openPopup();
  console.log(coords);
};

const renderLocationData = (data) => {
  currentIp.innerHTML = data.ip;
  currentLocation.innerHTML = `${data.location.city} ${data.location.country} ${data.location.postalCode}`;
  currentTimeZone.innerHTML = data.location.timezone;
  currentIsp.innerHTML = data.isp;
  const { lat } = data.location;
  const { lng } = data.location;
  const coords = [lat, lng];
  updateCoords(coords);
  console.log(data);
};

const ipData = (ipRequested) => {
  fetch(
    // `https://geo.ipify.org/api/v2/country,city?apiKey=at_a8h5P03D0MPft1u9Cg58Fz6T156Ci&ipAddress=${ipRequested}`
    `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipRequested}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderLocationData(data);
    });
  // .catch((error) => alert("Please enter valid IP Address"));
};

// my ip
const myIp = fetch("https://api.ipify.org?format=json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    ipData(data.ip);
  });
// my ip end

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInput.value != "" && searchInput.value != null) {
    ipData(searchInput.value);
    console.log(searchInput.value);

    return;
  }
  // alert("Please enter a valid IP Address");
  // console.log(ipData());
});
