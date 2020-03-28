import { Feature, Polygon, circle, Coord, Units, point, pointsWithinPolygon } from "@turf/turf";
import { Map, Marker, Popup, GeolocateControl } from 'mapbox-gl';
import { IGeolocationCoordinates } from "./IGeolocationCoordinates";
import { IGeolocationPosition } from "./IGeolocationPosition";

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
        this.requestGeolocation();
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
    private async requestGeolocation(): Promise<PermissionDescriptor | void> {
        return await navigator.permissions.query({ name: 'geolocation' })
            .then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                    this.geoloc = new GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true
                    })
                    this.addGeolocateControl();
                    this.okGeoloc = true;
                }
                else {
                    navigator.geolocation.getCurrentPosition(() => console.log('ok'), () => console.log('not ok'));
                }
            });
    }
    public addGeolocEvent(element: Element): Radius {
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
                console.log('hors zone');
                this.geolocateElement.innerHTML = 'Hors Zone !';
                this.geolocateElement.classList.remove('in-green');
                this.geolocateElement.classList.add('in-red');
            } else {
                this.geolocateElement.innerHTML = 'Dernière position OK';
                this.geolocateElement.classList.remove('in-red');
                this.geolocateElement.classList.add('in-green');
                console.info('Position is in circle', elems);
            }
        } else {
            this.geolocateElement.innerHTML = 'Pas de données';
        }
    }
    private addGeolocateControl(): void {
        this.map.addControl(this.geoloc);
    }
    private drawPolygon(): void {
        if (this.allowedZone != null) {
            if (this.map.getSource(this.zoneId)) {
                this.map.removeLayer(this.zoneId)
                this.map.removeSource(this.zoneId)
            }
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