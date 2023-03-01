import {CosmosForum} from "../../../../src/forum/provider/CosmosForum";
import axios from 'axios';
const Parser = require('rss-parser');

jest.mock('axios');
jest.mock('rss-parser');

describe("Cosmos", () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;
    const mockParser = Parser as jest.Mocked<typeof Parser>;
    const mockParserResult = {
        items: [
            {
                title: "First article",
                link: "https://forum.cosmos.network/first",
                community: 'cosmos',
                provider: 'cosmos-forum',
            },
            {
                title: "Second article",
                link: "https://forum.cosmos.network/second",
                community: 'cosmos',
                provider: 'cosmos-forum',
            }
        ],
    };

    beforeEach(() => {
        mockAxios.get.mockReset();
        mockParser.mockReset();
    });

    describe("getArticles", () => {
        it("should return a list of articles", async () => {
            mockAxios.get.mockResolvedValueOnce({ data: 'test feed text' });
            mockParser.prototype.parseString.mockImplementationOnce((xml: string) => {
                return Promise.resolve(mockParserResult);
            });

            const cosmosForum = new CosmosForum();
            const result = await cosmosForum.getArticles();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                    title: "First article",
                    url: "https://forum.cosmos.network/first",
                    community: 'cosmos',
                    provider: 'cosmos-forum',
            });
            expect(result[1]).toEqual({
                    title: "Second article",
                    url: "https://forum.cosmos.network/second",
                    community: 'cosmos',
                    provider: 'cosmos-forum',
            });
        });
    });
});
