import {Platforms} from "../enums/Platforms";

export type CommandStructure = {
    command: string,
    arguments: string[],
    platform: Platforms,
    channelId?: string|null|void,
    userId?: string|null|void,
}