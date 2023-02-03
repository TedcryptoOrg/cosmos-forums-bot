import {CommandStructure} from "../types/CommandStructure";
import {CommandResult} from "../types/CommandResult";

export interface Command {
    name: string;
    description: string;
    usage?: string;
    options?: void|{name: string, description: string, required: boolean}[];

    run(command: CommandStructure): Promise<CommandResult>;
}
