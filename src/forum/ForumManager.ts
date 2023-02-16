import {CommonWealth} from "./provider/CommonWealth";
import {CosmosForum} from "./provider/CosmosForum";
import {ForumProvider} from "./provider/ForumProvider";
import {MarsForum} from "./provider/MarsForum";

class ForumManager {
    private providers: {
        [key: string]: ForumProvider
    };

    constructor() {
        let providers = [
            new CommonWealth(),
        ]

        this.providers = {};
        for(const provider of providers) {
            this.providers[String(provider.getName())] = provider;
        }
    }

    getProviders(): {[key: string]: ForumProvider}
    {
        return this.providers;
    }

    getProvider(name: string): ForumProvider|null {
        return this.providers[name] || null;
    }
}

export const forumManager = new ForumManager();