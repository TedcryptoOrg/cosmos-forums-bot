import {CosmosForum} from "../../../src/forum/provider/CosmosForum";

describe("Cosmos", () => {
    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            const cosmosForum = new CosmosForum();
            const articles = await cosmosForum.getArticles();
            expect(articles.length).toBeGreaterThan(0);
            expect(articles[0].title).not.toBe('');
            expect(articles[0].url).not.toBe('');
        });
    });
});
