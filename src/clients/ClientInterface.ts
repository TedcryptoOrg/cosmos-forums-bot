import {Platforms} from "../enums/Platforms";

export interface ClientInterface {
    start(): Promise<void>;
    getName(): Platforms;
}