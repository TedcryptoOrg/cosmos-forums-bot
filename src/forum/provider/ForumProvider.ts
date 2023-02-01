import {Article} from "../../types/Article";

export interface ForumProvider {
    getArticles(): Promise<Article[]>;
    getName(): string;
}