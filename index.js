const myMap = {
    coordinates: [],
    businesses: [],
    markers: {},
    map: {},


    //build map
    makeMap() {
        this.map = L.map(('map'), {
                center: this.coordinates
            }).setView(this.coordinates, 13)
            //open streetmap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        let userMarker = L.marker(this.coordinates).addTo(this.map).bindPopup('You are here').openPopup()
    },



    // console.log(getCoords())




    //add markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                    this.businesses[i].lat,
                    this.businesses[i].long,
                ])
                .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
                .addTo(this.map)
        }
    },
}

//get users location

async function getCoords() {

    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    return [pos.coords.latitude, pos.coords.longitude]

}

//get coordinates via geolocation api
async function getFourSquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3wugdCkxYAqgVhWt/UPYC3uJc5oPwsNnH1sc5y3xm/Xg='
        }
    }

    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https:api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}

//process foursquare array
function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        }
        return location
    })
    return businesses
}



//Getting business type from User with event listener
document.getElementById('submit').addEventListener('click', async(event) => {

    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await getFourSquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
})






//window load
window.onload = async() => {
    const coords = await getCoords()
    console.log(coords)
    myMap.coordinates = coords
    myMap.makeMap()

}