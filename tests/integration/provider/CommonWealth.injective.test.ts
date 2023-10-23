import {CommonWealth} from "../../../src/forum/provider/CommonWealth";

describe("CommonWealth Integration (Injective)", () => {
    let commonWealth: CommonWealth;

    beforeAll(() => {
        commonWealth = new CommonWealth();
    })

    describe("fetchCommunities", () => {
        it("should return a list of communities", async () => {
            const communities = await commonWealth.fetchCommunities({
                community_id: 'injective'
            });

            // assert key exist and delete it, so we don't have to maintain further updates
            expect(Object.keys(communities.result.communities[0])).toContain('updated_at');
            delete communities.result.communities[0].updated_at;

            expect(communities.status).toBe("Success");
            expect(communities.result).toEqual({
                "communities": [
                    {
                        "active": true,
                        "admin_only_polling": null,
                        "base": "cosmos",
                        "bech32_prefix": "inj",
                        "block_explorer_ids": null,
                        "category": null,
                        "chain_node_id": 6,
                        "collapsed_on_homepage": false,
                        "created_at": "2021-08-05T22:14:02.535Z",
                        "custom_domain": "gov.injective.network",
                        "custom_stages": "[\"Discussion\", \"Polling\", \"Vote\"]",
                        "default_page": null,
                        "default_summary_view": true,
                        "default_symbol": "INJ",
                        "description": "Access Limitless DeFi Markets with Zero Barriers.",
                        "discord": "https://discord.com/invite/NK4qdbv",
                        "discord_bot_webhooks_enabled": false,
                        "discord_config_id": null,
                        "element": null,
                        "github": "https://github.com/InjectiveLabs/",
                        "has_chain_events_listener": false,
                        "has_homepage": false,
                        "hide_projects": null,
                        "icon_url": "https://assets.commonwealth.im/3a051b60-788f-4a45-ae33-0f7bb1bb22e4.1632888838186",
                        "id": "injective",
                        "name": "Injective",
                        "network": "injective",
                        "ss58_prefix": null,
                        "stages_enabled": true,
                        "substrate_spec": null,
                        "telegram": "https://t.me/joininjective",
                        "terms": null,
                        "token_name": null,
                        "type": "chain",
                        "website": "https://injective.com/",
                    }
                ],
                "count": 1
            });
        });
    });

    describe("getTopics", () => {
        it("should return a list of topics", async () => {
            const communities = await commonWealth.getTopics({community_id: 'injective'});
            expect(communities.status).toBe("Success");
            expect(communities.result.count).toBeGreaterThan(0);
        });
    });

    describe("getThreads", () => {
        it("should return a list of threads", async () => {
            const communities = await commonWealth.getThreads({community_id: 'injective'});
            expect(communities.status).toBe("Success");
            expect(communities.result.count).toBeGreaterThan(0);
        });
    });
});
