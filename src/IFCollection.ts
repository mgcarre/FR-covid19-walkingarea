import { FeatureCollection } from "@turf/turf";
import { IFAdresse } from "./IFAdresse";

export interface IFCollection extends FeatureCollection {
    features: IFAdresse[];
}