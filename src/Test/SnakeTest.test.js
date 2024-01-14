import Snake from '../component/Snake';

describe('Snake', () => {
    let snake;
    let mockCtx;
    let mockStore;

    beforeEach(() => {
        mockCtx = {
            fillStyle: null,
            shadowColor: null,
            shadowBlur: 0,
            beginPath: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
            fillRect: jest.fn(),
            arc: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
        };
        mockStore = {
            state: {
                currentSkin: {
                    color: '#000000',
                    shape: 'rectangle',
                }
            }
        };

        snake = new Snake(mockCtx, mockStore);});

    test('initializes with default properties', () => {
        expect(snake.snake).toEqual([]);
        expect(snake.direction).toBe('up');
    });

    test('initializes snake on the grid', () => {
        snake.initSnake(50, 50);
        expect(snake.snake.length).toBe(3);
        expect(snake.snake[0]).toEqual({ x: 40, y: 40 });
    });

    test('draws the snake', () => {
        snake.initSnake(50, 50);
        snake.drawSnake();
        expect(mockCtx.fillStyle).toBe('#000000');
        expect(mockCtx.fillRect).toHaveBeenCalledTimes(snake.snake.length);
    });

    test('moves the snake', () => {
        snake.initSnake(50, 50);
        const initialHead = { ...snake.snake[0] };
        snake.moveSnake();
        expect(snake.snake[0]).not.toEqual(initialHead);
    });

    test('changes direction', () => {
        snake.changeDirection('ArrowRight');
        expect(snake.direction).toBe('right');
    });

    test('prevents reversing direction', () => {
        snake.changeDirection('ArrowUp');
        snake.changeDirection('ArrowDown');
        expect(snake.direction).toBe('up');
    });

    test('grows when eating', () => {
        snake.initSnake(50, 50);
        const initialLength = snake.snake.length;
        snake.grow();
        expect(snake.snake.length).toBe(initialLength + 1);
    });

    test('detects self-collision', () => {
        snake.initSnake(50, 50);
        snake.grow();
        snake.snake[3] = snake.snake[0]; // Force a self-collision
        expect(snake.checkSelfCollision()).toBe(true);
    });

});
