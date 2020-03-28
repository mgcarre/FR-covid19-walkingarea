type AdresseType = 'housenumber' | 'street' | 'locality' | 'municipality';

export interface IAdresse {
    label: string;
    score: number;
    housenumber: string;
    id: string;
    type: AdresseType;
    x: number;
    y: number;
    importance: number;
    name: string;
    postcode: string;
    citycode: string;
    city: string;
    context: string;
    street: string;
    distance: number;
}