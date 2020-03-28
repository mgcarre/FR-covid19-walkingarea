import mapboxgl from 'mapbox-gl';
import { circle, Feature, Polygon, pointsWithinPolygon, point } from '@turf/turf';

let allowedZone: Feature<Polygon> = null;
const zoneId = '1000mzone'

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

map.on('click', (e) => {
    const center = [e.lngLat.lng, e.lngLat.lat];
    const radius = 1000;
    allowedZone = circle(center, radius, { steps: 60, units: 'meters' });
    drawPolygon();
    new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map)
    new mapboxgl.Popup()
        .setText('Zone de tolérance pour laquelle il est possible de faire de l\'exercice muni d\'une attestation dûement remplie')
        .setLngLat(center)
        .addTo(map)
})
const geoloc = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
})
geoloc.on('geolocate', (e) => {
    const retourVisuel = document.querySelector('.in-area');
    if (allowedZone !== null) {
        const center = point([e.coords.longitude, e.coords.latitude]);
        const elems = pointsWithinPolygon(center, allowedZone)
        if (elems.features.length === 0) {
            console.log('hors zone');
            retourVisuel.innerHTML = 'Hors Zone !';
            retourVisuel.classList.add('in-red');
        } else {
            retourVisuel.innerHTML = 'Dernière position OK';
            retourVisuel.classList.add('in-green');
            console.info('Position is in circle', elems);
        }
    } else {
        retourVisuel.innerHTML = 'Pas de données';

    }
})

map.addControl(geoloc);

function drawPolygon(): void {
    if (allowedZone != null) {
        if (map.getSource(zoneId)) {
            map.removeLayer(zoneId)
            map.removeSource(zoneId)
        }
        map.addSource(zoneId, {
            'type': 'geojson',
            'data': allowedZone
        });
        map.addLayer({
            'id': zoneId,
            'type': 'fill',
            'source': zoneId,
            'layout': {},
            'paint': {
                'fill-color': 'rgba(200, 100, 240, 0.4)',
                'fill-outline-color': 'rgba(200, 100, 240, 1)'
            }
        });
    }
}