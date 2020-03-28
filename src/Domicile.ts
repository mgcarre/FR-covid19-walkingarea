import { IFCollection } from "./IFCollection";

export class Domicile {
    public lat: number;
    public lng: number;
    private LSKey = 'mondomicile';
    private adresse: string;

    public setCoords(lat: number, lng: number): void {
        this.lat = lat;
        this.lng = lng;
        this.setDomicileToLocalStorage();
        console.log(this);
    }
    public getCoords(): number[] {
        return this.getDomicileFromLocalStorage();
    }
    public async getAdresse() {
        if (this.adresse === '' || !this.adresse) {
            this.adresse = await this.loadAdresse();
        }
        return this.adresse;
    }
    public async loadAdresse(): Promise<string> {
        const [lng, lat] = this.getDomicileFromLocalStorage();
        const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}`
        return await fetch(url).then(r => r.json()).then((adresses: IFCollection) => adresses.features.map(a => a.properties.label)[0]);
    }
    private getDomicileFromLocalStorage(): number[] {
        const dom = JSON.parse(localStorage.getItem(this.LSKey));
        if (dom !== null) {
            return dom;
        }
        return [];
    }
    private setDomicileToLocalStorage(): void {
        const dom = JSON.stringify([this.lng, this.lat]);
        if (this.getDomicileFromLocalStorage().length === 0) {
            localStorage.setItem(this.LSKey, dom);
        }
    }
}