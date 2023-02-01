const cosmosForum = require("../../../src/forum/provider/CosmosForum").cosmosForum;

describe("Cosmos", () => {
    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            const articles = await cosmosForum.getArticles();
            expect(articles.length).toBeGreaterThan(0);
            expect(articles[0].title).not.toBe('');
            expect(articles[0].url).not.toBe('');
        });
    });
});
