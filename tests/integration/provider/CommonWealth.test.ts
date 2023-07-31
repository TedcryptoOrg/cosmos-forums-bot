import {CommonWealth} from "../../../src/forum/provider/CommonWealth";

describe("CommonWealth Integration", () => {
    let commonWealth: CommonWealth;

    beforeAll(() => {
        commonWealth = new CommonWealth();
    })

    describe("fetchCommunities", () => {
        it("should return a list of communities", async () => {
            const communities = await commonWealth.fetchCommunities({
                community_id: 'osmosis'
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
                        "bech32_prefix": "osmo",
                        "block_explorer_ids": null,
                        "category": ["DeFi", "DAO"],
                        "chain_node_id": 20,
                        "collapsed_on_homepage": false,
                        "created_at": "2021-07-28T05:55:16.509Z",
                        "custom_domain": "gov.osmosis.zone",
                        "custom_stages": "[\"Discussion\",\"Drafted - Pre-Voting\",\"On Chain\",\"Passed\",\"Rejected\",\"Withdrawn\",\"Abandoned\",\"Revised Thread Posted\"]",
                        "default_page": null,
                        "default_summary_view": true,
                        "default_symbol": "OSMO",
                        "description": "The Interchain Dex",
                        "discord": "https://discord.com/invite/osmosis",
                        "discord_config_id": null,
                        "element": "",
                        "github": "https://github.com/osmosis-labs/osmosis",
                        "has_chain_events_listener": true,
                        "has_homepage": false,
                        "hide_projects": null,
                        "icon_url": "https://assets.commonwealth.im/osm.png",
                        "id": "osmosis",
                        "name": "Osmosis",
                        "network": "osmosis",
                        "ss58_prefix": null,
                        "stages_enabled": true,
                        "substrate_spec": null,
                        "telegram": "https://t.me/osmosis_chat",
                        "terms": "",
                        "token_name": null,
                        "type": "chain",
                        "website": "https://osmosis.zone/",
                    }
                ],
                "count": 1
            });
        });
    });

    describe("getTopics", () => {
        it("should return a list of topics", async () => {
            const communities = await commonWealth.getTopics({community_id: 'osmosis'});
            expect(communities.status).toBe("Success");
            expect(communities.result.count).toBeGreaterThan(0);
        });
    });

    describe("getThreads", () => {
        it("should return a list of threads", async () => {
            const communities = await commonWealth.getThreads({community_id: 'osmosis'});
            expect(communities.status).toBe("Success");
            expect(communities.result.count).toBeGreaterThan(0);
        });
    });

    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            const articles = await commonWealth.getArticles();
            expect(articles.length).toBeGreaterThan(0);
        });
    });
});
