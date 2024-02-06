/*
things we need to do:
    - get the user's location
    - create the leaflet map
    - after a category is selected (addEventListener)
        - make a fetch request to Foursquare API
            - user the place search method
            - specify lat/long, categories, and sort
                - programatically render a list of results
                - map the locations on the map
*/

let select = document.querySelector('select');
let listEl = document.querySelector('ul');

let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



navigator.geolocation.getCurrentPosition((position) => {
    let { coords: { latitude, longitude } } = position

    console.log('It works:', position)
    map.setView([latitude, longitude])
    var marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup('<p1><b>This is where you are!</b></p1>').openPopup();
}
    , (error) => {
        console.log(error)
    })

document.querySelector('button').addEventListener('click', (event) => {
    const categoryID = document.querySelector('select').value

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3YBoSNhfugctcSVPiZaFmWGlrEVxE4iQL2Usanq0dT14='
        }
    };

    fetch(`https://api.foursquare.com/v3/places/search?categories=${categoryID}&sort=DISTANCE&limit=5`, options)
        .then(response => response.json())
        .then(({ results }) => {
            listEl.innerHTML = ''

            for (let i = 0; i < results.length; i++) {
                results[i]
                const listItem = document.createElement('li')
                listItem.textContent = results[i].name
                listEl.append(listItem)

                function mapBusinesses() {
                    let businessLocations = results[i].geocodes.main;
                    let locationsArray = [businessLocations.latitude, businessLocations.longitude];
                    locationsArray.forEach(() => {
                        L.marker(locationsArray).addTo(map);
                    })
                    console.log(locationsArray);
                }
                mapBusinesses();
            }
        })
        .catch(err => console.error(err));

})