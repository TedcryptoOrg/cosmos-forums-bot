import {Article} from "../../types/Article";
import {ForumProviders} from "../../enums/ForumProviders";

export interface ForumProvider {
    /**
     * Returns the articles from the provider to all communities
     */
    getArticles(): Promise<Article[]>;

    /**
     * Returns the communities that this provider supports
     */
    getCommunities(): string[];

    /**
     * Returns the name of the provider
     */
    getName(): ForumProviders;
}