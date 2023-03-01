import * as readline from "readline";
import {Platforms} from "../src/enums/Platforms";
import {forumManager} from "../src/forum/ForumManager";
import {notificationChannelManager} from "../src/services/notification/NotificationChannelManager";
import {twitterClientManager} from "../src/services/twitter/TwitterClientManager";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const util = require('util');
const question = util.promisify(rl.question).bind(rl);

const database = require('./../src/Database').database;

async function main(): Promise<void> {
    await database.connect();
    await database.initializeDB();
    const twitterClients = await twitterClientManager.getTwitterClients();
    if (!twitterClients.length) {
        console.error('No twitter clients found');
        rl.close();
        return;
    }

    let listOfClients = '';
    for (const client of twitterClients) {
        listOfClients += `${client.id} - ${client.name}`
    }

    const twitterClient = await question('Current twitter clients:\n\n' + listOfClients + '\n\nSelect client: ');
    const provider = await question(`Select provider (${Object.keys(forumManager.getProviders()).join(', ')}):`);
    const forumProvider = forumManager.getProvider(provider);
    if (!forumProvider) {
        console.error('Provider not found');
        rl.close();
        return;
    }
    const community = await question(`Select community (${forumProvider.getCommunities().join(', ')}): `);
    if (!forumProvider.getCommunities().includes(community)) {
        console.error('Community not found');
        rl.close();
        return;
    }

    await notificationChannelManager.createNotificationChannel(twitterClient, twitterClient, Platforms.Twitter, provider, community);
    console.log('Channel created');
    rl.close();
}

Promise.resolve(main()).catch(console.error);
