import { IGeolocationCoordinates } from "./IGeolocationCoordinates";

export interface IGeolocationPosition {
    readonly coords: IGeolocationCoordinates;
    readonly timestamp: DOMTimeStamp;
    readonly type?: string;
}