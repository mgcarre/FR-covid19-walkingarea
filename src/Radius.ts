import { Feature, Polygon, circle, Coord, Units, point, pointsWithinPolygon } from "@turf/turf";
import { Map, Marker, Popup, GeolocateControl } from 'mapbox-gl';
import { IGeolocationCoordinates } from "./IGeolocationCoordinates";
import { IGeolocationPosition } from "./IGeolocationPosition";
import Push from 'push.js';

export class Radius {
    public center: number[];
    public geolocateElement: Element;
    private allowedZone: Feature<Polygon> = null;
    private map: Map;
    private zoneId = '1000mzone';
    private geoloc: GeolocateControl;
    private okGeoloc: boolean;

    constructor(map: Map) {
        this.map = map;
        this.center = [];
        this.addGeolocationControl();
    }

    public setCenterCoords(coords: number[]): Radius {
        if (this.center.length === 0) {
            this.center = coords;
        }
        this.map.flyTo({ center: this.center, zoom: 14 });
        return this;
    }
    public setAllowedZone(steps?: number, units?: Units): void;
    public setAllowedZone(steps: number, units?: Units): void;
    public setAllowedZone(steps = 60, units: Units = 'meters'): void {
        if (this.allowedZone === null) {
            const radius = 1000;
            this.allowedZone = circle(this.center, radius, { steps, units });
            this.drawPolygon();
            this.addMarker();
            this.addPopup();
        }
    }
    public erasePolyon(): void {
        if (this.map.getSource(this.zoneId)) {
            this.map.removeLayer(this.zoneId)
            this.map.removeSource(this.zoneId)
        }
    }
    private addGeolocationControl(): void {
        this.geoloc = new GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
        this.addGeolocateControl();
        this.okGeoloc = true;
    }
    public addGeolocEvent(element: Element): Radius {
        console.log(this);
        if (this.okGeoloc === true) {
            this.geolocateElement = element;
            this.geoloc.on('geolocate', (e: IGeolocationPosition) => this.updateGeolocateElement(e.coords));
        }
        return this;
    }
    private updateGeolocateElement(geolocation: IGeolocationCoordinates): void {
        if (this.center.length > 0) {
            const center = point([geolocation.longitude, geolocation.latitude]);
            const elems = pointsWithinPolygon(center, this.allowedZone)
            if (elems.features.length === 0) {
                this.notifierOutOfBounds();
            } else {
                this.notifierInBounds();
            }
        } else {
            this.geolocateElement.innerHTML = 'Pas de données';
        }
    }
    private notifierOutOfBounds(): void {
        this.geolocateElement.innerHTML = 'Hors Zone !';
        this.geolocateElement.classList.remove('in-green');
        this.geolocateElement.classList.add('in-red');

        Push.create("En dehors des limites", {
            body: "L'appareil que vous utilisez indique que vous êtes sorti de la limite des 1000m fixé pour le confinement",
            vibrate: true,
            requireInteraction: true,
            tag: 'notif-1000m'
        });
    }
    private notifierInBounds(): void {
        this.geolocateElement.innerHTML = 'Dernière position OK';
        this.geolocateElement.classList.remove('in-red');
        this.geolocateElement.classList.add('in-green');

        Push.close('notif-1000m');
    }
    private addGeolocateControl(): void {
        this.map.addControl(this.geoloc);
    }
    private drawPolygon(): void {
        if (this.allowedZone != null) {
            this.erasePolyon();
            this.map.addSource(this.zoneId, {
                'type': 'geojson',
                'data': this.allowedZone
            });
            this.map.addLayer({
                'id': this.zoneId,
                'type': 'fill',
                'source': this.zoneId,
                'layout': {},
                'paint': {
                    'fill-color': 'rgba(200, 100, 240, 0.4)',
                    'fill-outline-color': 'rgba(200, 100, 240, 1)'
                }
            });
        }
    }
    private addMarker(): void {
        new Marker()
            .setLngLat(this.center)
            .addTo(this.map);
    }
    private addPopup(): void {
        new Popup()
            .setText('Zone de tolérance pour laquelle il est possible de faire de l\'exercice muni d\'une attestation dûement remplie')
            .setLngLat(this.center)
            .addTo(this.map);
    }
}