import mapboxgl from 'mapbox-gl';
import { Radius } from './Radius';

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

map.on('click', (e) => {
    radius.setCenterCoords([e.lngLat.lng, e.lngLat.lat]).setAllowedZone();
});


