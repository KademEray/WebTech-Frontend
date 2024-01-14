// highscore.test.js
import Highscore from '../component/Highscore';

global.fetch = jest.fn();
global.console.error = jest.fn();

beforeEach(() => {
    fetch.mockClear();
});

describe('Highscore class', () => {
    test('fetchHighscores returns data on success', async () => {
        const highscores = [{ name: 'Alice', score: 100 }, { name: 'Bob', score: 90 }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(highscores),
        });

        const highscore = new Highscore();
        const data = await highscore.fetchHighscores();

        expect(data).toEqual(highscores);
        expect(fetch).toHaveBeenCalledWith('/api/users/highscores');
    });

    test('fetchHighscores returns empty array on non-ok response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve('Not Found'),
        });

        const highscore = new Highscore();
        const data = await highscore.fetchHighscores();

        expect(data).toEqual([]);
        expect(fetch).toHaveBeenCalledWith('/api/users/highscores');
    });

    test('fetchHighscores returns empty array on network error', async () => {
        fetch.mockRejectedValue(new Error('Network Error'));

        const highscore = new Highscore();
        const data = await highscore.fetchHighscores();

        expect(data).toEqual([]);
        expect(fetch).toHaveBeenCalledWith('/api/users/highscores');
    });
});
