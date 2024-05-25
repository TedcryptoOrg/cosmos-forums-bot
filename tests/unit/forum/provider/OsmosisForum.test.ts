import axios from 'axios';
const Parser = require('rss-parser');
import {ForumProviders} from "../../../../src/enums/ForumProviders";
import {OsmosisForum} from "../../../../src/forum/provider/OsmosisForum";

jest.mock('axios');
jest.mock('rss-parser');

describe('OsmosisForum', () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;
    const mockParser = Parser as jest.Mocked<typeof Parser>;
    const mockParserResult = {
        items: [
            {
                title: 'Test Article 1',
                link: 'https://test.com/article1',
                categories: ['Proposal Discussion'],
            },
            {
                title: 'Test Article 2',
                link: 'https://test.com/article2',
                categories: ['Proposal Discussion'],
            },
            {
                title: 'Test Article 3',
                link: 'https://test.com/article3',
                categories: ['Other'],
            },
        ],
    };

    beforeEach(() => {
        mockAxios.get.mockReset();
        mockParser.mockReset();
    });

    describe('getArticles', () => {
        it('should return an array of Article objects when there are new articles', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: 'test feed text' });
            mockParser.prototype.parseString.mockImplementationOnce((xml: string) => {
                return Promise.resolve(mockParserResult);
            });

            const result = await new OsmosisForum().getArticles();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                title: 'Test Article 1',
                url: 'https://test.com/article1',
                community: 'osmosis',
                provider: ForumProviders.OsmosisForum,
            });
            expect(result[1]).toEqual({
                title: 'Test Article 2',
                url: 'https://test.com/article2',
                community: 'osmosis',
                provider: ForumProviders.OsmosisForum,
            });
        });

        it('should return an empty array and log when there are no new articles', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: 'test feed text' });
            mockParser.prototype.parseString.mockImplementationOnce((xml: string) => {
                return Promise.resolve({});
            });

            expect(await new OsmosisForum().getArticles()).toEqual([]);
        });
    });

    it('should return an array containing "osmosis"', () => {
        expect(new OsmosisForum().getCommunities()).toEqual(['osmosis']);
    });

    it('getName()', () => {
        expect( new OsmosisForum().getName()).toEqual(ForumProviders.OsmosisForum);
    });
});
