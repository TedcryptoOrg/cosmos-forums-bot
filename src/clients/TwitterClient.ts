import {Client} from 'twitter.js';
import {CommandStructure} from "../types/CommandStructure";
import {Commands} from "../types/Commands";
import {Platforms} from "../enums/Platforms";
import {ClientInterface} from "./ClientInterface";
import {ClientCredentialsInterface} from "twitter.js/dist/types/structures";

export class TwitterClient implements ClientInterface {
    private client: Client;
    private readonly configuration: ClientCredentialsInterface;
    private readonly commands: Commands;
    
    constructor(config: ClientCredentialsInterface) {
        this.client = new Client({ events: ['FILTERED_TWEET_CREATE'] });
        this.configuration = config;
        this.commands = {}
    }

    async start(): Promise<void> {
        await this.client.login(this.configuration);
    }

    async sendMessage(option: any, text: string) {
        await this.client.tweets.create({
            text: text
        });
    }

    getName(): Platforms {
        return Platforms.Twitter;
    }
}
