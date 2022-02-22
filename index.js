let coordinates = null;
let userSelect = document.querySelector('#selectChoice')




//build map
function makeMap() {
    var map = L.map(('map'), {
        center: coordinates
    }).setView(coordinates, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    let userMarker = L.marker(coordinates).addTo(map).bindPopup('You are here').openPopup
}

//get users location
window.onload = async() => {
    coordinates = await getCoords()
    makeMap()
}
async function getCoords() {

    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    return [pos.coords.latitude, pos.coords.longitude]

}

console.log(getCoords())

//Getting business type from User