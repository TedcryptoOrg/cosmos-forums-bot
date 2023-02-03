import {Command} from './Command';
import {database} from "../Database";
import {CommandStructure} from "../types/CommandStructure";
import {CommandResult} from "../types/CommandResult";

export class Start implements Command {
    public name: string;
    public description: string;
    public usage: string;

    constructor() {
        this.name = 'start';
        this.description = 'Start!';
        this.usage = 'start';
    }

    async run(command: CommandStructure): Promise<CommandResult> {
        if (!command.userId || !command.channelId)
            throw new Error('User ID or channel ID is missing.');

        const user = await database.getNotificationChannel(command.channelId, command.platform);
        if (user) {
            return {
                success: true,
                message: 'Notification channel already exists.'
            }
        } else {
            await database.createNotificationChannel(command.userId, command.channelId, command.platform);
            return {
                success: true,
                message: `Notification channel created! User Id: ${command.userId}, Channel ID: ${command.channelId}, Platform: ${command.platform}.`
            }
        }
    }
}
