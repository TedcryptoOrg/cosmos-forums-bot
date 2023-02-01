const nock = require("nock");
const cosmosForum = require("../../../src/forum/provider/CosmosForum").cosmosForum;

describe("Cosmos", () => {
    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            const exampleResponse = `
                <?xml version="1.0" encoding="UTF-8"?>
                <rss version="2.0">
                    <channel>
                        <title>Cosmos Forum</title>
                        <item>
                            <title>First article</title>
                            <link>https://forum.cosmos.network/first</link>
                        </item>
                        <item>
                            <title>Second article</title>
                            <link>https://forum.cosmos.network/second</link>
                        </item>
                    </channel>
                </rss>
            `;

            nock("https://forum.cosmos.network")
                .get("/latest.rss")
                .reply(200, exampleResponse);

            const articles = await cosmosForum.getArticles();

            expect(articles).toEqual([
                {
                    title: "First article",
                    url: "https://forum.cosmos.network/first"
                },
                {
                    title: "Second article",
                    url: "https://forum.cosmos.network/second"
                }
            ]);
        });
    });
});
