import axios from 'axios';
const Parser = require('rss-parser');
import {MarsForum} from "../../../../src/forum/provider/MarsForum";
import {ForumProviders} from "../../../../src/enums/ForumProviders";

jest.mock('axios');
jest.mock('rss-parser');

describe('MarsForum', () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;
    const mockParser = Parser as jest.Mocked<typeof Parser>;
    const mockParserResult = {
        items: [
            {
                title: 'Test Article 1',
                link: 'https://test.com/article1',
                category: 'MRC',
            },
            {
                title: 'Test Article 2',
                link: 'https://test.com/article2',
                category: 'MRC',
            },
            {
                title: 'Test Article 3',
                link: 'https://test.com/article3',
                category: 'Other',
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

            const marsForum = new MarsForum();
            const result = await marsForum.getArticles();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                title: 'Test Article 1',
                url: 'https://test.com/article1',
                community: 'mars',
                provider: ForumProviders.MarsForum,
            });
            expect(result[1]).toEqual({
                title: 'Test Article 2',
                url: 'https://test.com/article2',
                community: 'mars',
                provider: ForumProviders.MarsForum,
            });
        });

        it('should return an empty array and log when there are no new articles', async () => {
            mockAxios.get.mockResolvedValueOnce({ data: 'test feed text' });
            mockParser.prototype.parseString.mockImplementationOnce((xml: string) => {
                return Promise.resolve({});
            });

            const marsForum = new MarsForum();

            const result = await marsForum.getArticles();

            expect(result).toEqual([]);
        });
    });

    describe('getCommunities', () => {
        it('should return an array containing "mars"', () => {
            const marsForum = new MarsForum();
            const result = marsForum.getCommunities();
            expect(result).toEqual(['mars']);
        });
    });

    describe('getName', () => {
        it('should return ForumProviders.MarsForum', () => {
            const marsForum = new MarsForum();
            const result = marsForum.getName();
            expect(result).toEqual(ForumProviders.MarsForum);
        });
    });
});
