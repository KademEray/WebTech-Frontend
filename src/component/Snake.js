export default class Snake {
    constructor(ctx, store) {
        this.ctx = ctx;
        this.store = store;
        this.snake = [];
        this.direction = 'up'; // Starte nach oben gerichtet
        this.isActive = false;
    }

    initSnake(midX, midY, startDirection = 'up') {
        // Stellen Sie sicher, dass midX und midY auf dem Gitter liegen
        midX = Math.floor(midX / 20) * 20;
        midY = Math.floor(midY / 20) * 20;

        this.snake = [
            { x: midX, y: midY },
            { x: midX, y: midY + 20 },
            { x: midX, y: midY + 40 }
        ];
        this.direction = startDirection;
    }

    drawSnake() {
        const snakeSize = 20;
        const selectedColor = this.store.state.currentSkin ? this.store.state.currentSkin.color : '#000000';
        const selectedShape = this.store.state.currentSkin ? this.store.state.currentSkin.shape : 'rectangle';

        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            let direction;

            if (i === 0) {
                // Kopfsegment hat die allgemeine Bewegungsrichtung der Schlange
                direction = this.direction;
                // Zeichne den Kopf mit einem weißen Leuchteffekt
                this.ctx.fillStyle = selectedColor;
                this.ctx.shadowColor = 'blue';
                this.ctx.shadowBlur = 20;
            } else {
                // Zeichne andere Segmente ohne Leuchteffekt
                this.ctx.fillStyle = selectedColor;
                this.ctx.shadowBlur = 0;
            }

            // Bestimme die Richtung basierend auf der Position des nächsten Segments
            if (i > 0) {
                const nextSegment = this.snake[i - 1];
                if (nextSegment.x === segment.x) {
                    direction = nextSegment.y > segment.y ? 'up' : 'down';
                } else {
                    direction = nextSegment.x > segment.x ? 'left' : 'right';
                }
            }

            // Zeichne die Segmente
            if (selectedShape === 'triangle') {
                this.ctx.beginPath();
                this.drawTriangle(segment, snakeSize, direction);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
                if (selectedShape === 'rectangle') {
                    this.ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
                } else if (selectedShape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(segment.x + snakeSize / 2, segment.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        // Setze Schatten-Einstellungen zurück
        this.ctx.shadowColor = 'none';
        this.ctx.shadowBlur = 0;
    }

    drawTriangle(segment, size, direction) {
        switch (direction) {
            case 'up':
                this.ctx.moveTo(segment.x + size / 2, segment.y);
                this.ctx.lineTo(segment.x, segment.y + size);
                this.ctx.lineTo(segment.x + size, segment.y + size);
                break;
            case 'down':
                this.ctx.moveTo(segment.x + size / 2, segment.y + size);
                this.ctx.lineTo(segment.x, segment.y);
                this.ctx.lineTo(segment.x + size, segment.y);
                break;
            case 'left':
                this.ctx.moveTo(segment.x, segment.y + size / 2);
                this.ctx.lineTo(segment.x + size, segment.y);
                this.ctx.lineTo(segment.x + size, segment.y + size);
                break;
            case 'right':
                this.ctx.moveTo(segment.x + size, segment.y + size / 2);
                this.ctx.lineTo(segment.x, segment.y);
                this.ctx.lineTo(segment.x, segment.y + size);
                break;
        }
    }

    moveSnake() {
        let head = { ...this.snake[0] };
        const step = 20;
        switch (this.direction) {
            case "up":
                head.y -= step;
                break;
            case "down":
                head.y += step;
                break;
            case "left":
                head.x -= step;
                break;
            case "right":
                head.x += step;
                break;
        }
        this.snake.unshift(head);
        this.snake.pop();
    }

    changeDirection(key) {
        const newDirection = key.replace('Arrow', '').toLowerCase();
        const oppositeDirections = {
            up: 'down',
            down: 'up',
            left: 'right',
            right: 'left',
        };

        if (this.direction !== oppositeDirections[newDirection]) {
            this.direction = newDirection;
        }
    }

    getHead() {
        return this.snake[0];
    }

    getSegments() {
        return this.snake.slice(1);
    }

    grow() {
        // Fügen Sie ein neues Segment am Ende der Schlange hinzu
        const lastSegment = this.snake[this.snake.length - 1];
        this.snake.push({ x: lastSegment.x, y: lastSegment.y });
    }

    checkSelfCollision() {
        const head = this.getHead();
        return this.snake.some((segment, index) => {
            return index !== 0 && head.x === segment.x && head.y === segment.y;
        });
    }
}

