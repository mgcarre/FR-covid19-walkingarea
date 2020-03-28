import { Feature } from "@turf/turf";
import { IAdresse } from "./IAdresse";

export interface IFAdresse extends Feature {
    properties: IAdresse;
}