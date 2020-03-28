import mapboxgl from 'mapbox-gl';
import { Radius } from './Radius';
import { Domicile } from './Domicile';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 5.5,
    center: {
        lng: 1.5625822341863795,
        lat: 46.77358845248355
    }
});
const radius = new Radius(map).addGeolocEvent(document.querySelector('.in-area'));
const d = new Domicile();

map.on('click', (e) => {
    d.setCoords(e.lngLat.lat, e.lngLat.lng);
    radius.setCenterCoords(d.getCoords()).setAllowedZone();
    d.getAdresse().then(str => {
        document.querySelector('.overlay').innerHTML = `Votre adresse a été définie sur :<br>${str}`;
    });
});


