import {TwitterClient} from "../../models/TwitterClient";

class TwitterClientManager {
    async getTwitterClients(): Promise<TwitterClient[]> {
        return await TwitterClient.findAll();
    }
}

export const twitterClientManager = new TwitterClientManager();