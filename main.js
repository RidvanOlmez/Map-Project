import { detecType, setStorage, detecIcon} from "./helpers.js";

const form = document.querySelector("form");
const list = document.querySelector("ul");

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);


var map;
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];
var layerGroup = [];

navigator.geolocation.getCurrentPosition(
    loadMap,
    
);

function onMapClick(e) {
    form.style.display = "flex";
    coords = [e.latlng.lat, e.latlng.lng];
    //   console.log(coords);
  }

function loadMap(e) {
    // console.log(e);
    map = new L.map('map').setView([e.coords.latitude, e.coords.longitude], 10);
    L.control;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

layerGroup = L.layerGroup().addTo(map);
renderNoteList(notes);
 map.on("click", onMapClick);


}
function renderMarker(item){
    L.marker(item.coords, { icon: detecIcon(item.status) })
    
    .addTo(layerGroup)
    
    .bindPopup(`${item.desc}`);
}

function handleSubmit(e){
    e.preventDefault();
    if (!desc) return;
    const desc = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;
    notes.push({ id: new Date().getTime(), desc, date, status, coords });
    
    setStorage(notes);
    renderNoteList(notes);
    form.style.display = "none";
}
function renderNoteList(item) {
    
    list.innerHTML = "";
    layerGroup.clearLayers();
     item.forEach((item) => {
      const listElement = document.createElement("li");
      
      listElement.dataset.id = item.id;
      listElement;
      listElement.innerHTML = `
          <div>
              <p>${item.desc}</p>
              <p><span>Tarih:</span>${item.date}</p>
              <p><span>Durum:</span>${detecType(item.status)}</p>
  
              <i class="bi bi-x" id="delete"></i>
              <i class="bi bi-airplane-fill" id="fly"></i>
          </div>
      `;
       list.insertAdjacentElement("afterbegin", listElement);
       renderMarker(item);
    });
}
function handleClick(e) {
    
    const id = e.target.parentElement.parentElement.dataset.id;
  
    if (e.target.id === "delete") {
      
     
      notes = notes.filter((note) => note.id != id);
      
      setStorage(notes);
      
      renderNoteList(notes);
    }
    if (e.target.id === "fly") {
      const note = notes.find((note) => note.id == id);
      // console.log(note);
      map.flyTo(note.coords);
    }
  }