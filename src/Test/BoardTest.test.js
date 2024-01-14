import Board from '../component/Board';
import Snake from '../component/Snake';


describe('Board class', () => {
    let board;
    let ctxMock;
    let snake;
    let storeMock;

    beforeEach(() => {
        ctxMock = {
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            createRadialGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
            beginPath: jest.fn(),
            fill: jest.fn(),
            arc: jest.fn(), // Stellen Sie sicher, dass arc gemockt ist
        };

        storeMock = {
            state: {
                currentSkin: { color: '#000000', shape: 'rectangle' },
            },
        };

        snake = new Snake(ctxMock, storeMock);
        snake.drawSnake = jest.fn(); // Mock drawSnake-Methode

        board = new Board(ctxMock, 600, 400);
        board.initGame(snake);
    });

    it('initializes the game correctly', () => {
        board.initGame(snake);
        expect(board.snake).toBe(snake);
        expect(board.food).toBeDefined();
    });

    it('spawns food correctly', () => {
        board.spawnFood();
        expect(board.food).toBeDefined();
        expect(board.food.x).toBeGreaterThanOrEqual(0);
        expect(board.food.x).toBeLessThan(board.width);
        expect(board.food.y).toBeGreaterThanOrEqual(0);
        expect(board.food.y).toBeLessThan(board.height);
    });

    it('checks for collision correctly', () => {
        board.initGame(snake);
        // Setze die Position des Schlangenkopfes für den Test
        snake.getHead = jest.fn().mockReturnValue({ x: -20, y: 0 });
        expect(board.checkCollision()).toBeTruthy();
        snake.getHead = jest.fn().mockReturnValue({ x: 0, y: 0 });
        expect(board.checkCollision()).toBeFalsy();
    });

    it('draws the game elements correctly', () => {
        board.initGame(snake);
        board.draw();

        expect(ctxMock.clearRect).toHaveBeenCalledWith(0, 0, board.width, board.height);
        expect(ctxMock.fillRect).toHaveBeenCalled();
        if (board.snake) {
            expect(board.snake.drawSnake).toHaveBeenCalled();
        }
        expect(ctxMock.createRadialGradient).toHaveBeenCalled();
        expect(ctxMock.arc).toHaveBeenCalled();
        expect(ctxMock.fill).toHaveBeenCalled();
    });

    it('draws the grid correctly', () => {
        board.drawGrid();

        expect(ctxMock.fillStyle).toBeDefined();
        expect(ctxMock.fillRect).toHaveBeenCalled(); // Überprüft, ob Quadrate für das Raster gezeichnet wurden
    });

    it('draws the border correctly', () => {
        board.drawBorder();

        expect(ctxMock.fillStyle).toBe("#000");
        expect(ctxMock.fillRect).toHaveBeenCalledTimes(4); // Es sollte vier Mal aufgerufen werden, um den Rahmen zu zeichnen
    });

    it('draws the food correctly', () => {
        board.spawnFood(); // Platziere das Essen, um es zu zeichnen
        board.drawFood();

        expect(ctxMock.fillStyle).toBeDefined();
        expect(ctxMock.fillRect).toHaveBeenCalledWith(board.food.x, board.food.y, expect.any(Number), expect.any(Number)); // Überprüft, ob das Essen gezeichnet wurde
    });

    it('spawns food not on the snake', () => {
        const mockSnake = {
            snake: [{ x: 40, y: 40 }, { x: 60, y: 60 }] // Beispielpositionen der Schlangensegmente
        };
        board.snake = mockSnake;
        board.spawnFood();

        const foodOnSnake = mockSnake.snake.some(segment => segment.x === board.food.x && segment.y === board.food.y);
        expect(foodOnSnake).toBeFalsy();
        expect(board.food.x).toBeGreaterThanOrEqual(0);
        expect(board.food.x).toBeLessThan(board.width);
        expect(board.food.y).toBeGreaterThanOrEqual(0);
        expect(board.food.y).toBeLessThan(board.height);
    });

    it('detects collision with the game boundaries', () => {
        const mockSnake = {
            getHead: () => ({ x: -20, y: 20 }) // Beispielposition für eine Kollision
        };
        board.snake = mockSnake;
        expect(board.checkCollision()).toBeTruthy();

        mockSnake.getHead = () => ({ x: 50, y: 50 }); // Beispielposition ohne Kollision
        expect(board.checkCollision()).toBeFalsy();
    });


});