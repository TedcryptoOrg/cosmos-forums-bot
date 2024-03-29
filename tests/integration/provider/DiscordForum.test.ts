import {DiscordForum} from "../../../src/forum/provider/DiscordForum";
import {DiscordClient} from "../../../src/clients/DiscordClient";

let discordClientId = process.env.DISCORD_CLIENT_ID ?? undefined;
let discordBotToken = process.env.DISCORD_BOT_TOKEN ?? undefined;

let discordClient = new DiscordClient(String(discordClientId), String(discordBotToken));

// Skip: We don't have a Discord server to test against, use this in local for development
describe.skip("Discord forum Integration", () => {
    let discordForum: DiscordForum;

    beforeAll(async () => {
        await discordClient.start();
        discordForum = new DiscordForum(discordClient);
    })

    afterAll(async () => {
        await discordClient.stop();
    })

    describe("getTopics", () => {
        it("should return a list of topics", async () => {
            const threads = await discordForum.fetchNewThreads('kujira');
            expect(threads).toBeDefined();
            expect(threads.threads.size).toBeGreaterThan(0);
        });
    });

    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            const articles = await discordForum.getArticles();
            expect(articles).toBeDefined();
            expect(articles.length).toBeGreaterThan(0);
        });
    });
});