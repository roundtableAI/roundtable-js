import Element from '../core/element.js';

class BoundingBox extends Element {
    static styleKeys = [...Element.styleKeys, 'canvas', 'controls', 'controlPoint', 'button'];

    static selectorMap = {
        ...Element.selectorMap,
        canvas: 'canvas',
        controls: '.controls',
        controlPoint: '.control-point',
        button: 'button'
    };

    static defaultStyles = {
        canvas: {
            cursor: 'crosshair',
            display: 'block',
            marginBottom: '10px',
            width: '100%',
            height: 'auto',
        },
        controls: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
        controlPoint: {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: 'white',
            border: '1px solid #333',
        },
        button: {
            backgroundColor: '#333',
            color: '#ffffff',
            padding: '8px 24px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            '&:hover': {
                backgroundColor: '#444',
            },
            '&:disabled': {
                backgroundColor: '#888',
                cursor: 'not-allowed',
            }
        },
    };

    constructor({
        id,
        text,
        subText = '',
        imageUrl,
        boxColor = '#FF0000',
        boxOpacity = 0.3,
        maxBoxes = Infinity,
        required = true,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'bounding-box', store_data: true, required, customValidation, styles });

        if (!imageUrl) {
            throw new Error('Image URL is required');
        }

        this.text = text;
        this.subText = subText;
        this.imageUrl = imageUrl;
        this.boxColor = boxColor;
        this.boxOpacity = boxOpacity;
        this.maxBoxes = maxBoxes;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('imageUrl', imageUrl);
        this.addData('boxColor', boxColor);
        this.addData('boxOpacity', boxOpacity);
        this.addData('maxBoxes', maxBoxes);

        this.initializeState();
        this.bindEventHandlers();
        this.initialResponse = [];

        this.elementStyleKeys = [...BoundingBox.styleKeys];
        this.selectorMap = { ...BoundingBox.selectorMap };
    }

    generateHTML() {
        return `
            <div class="bounding-box-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <canvas id="${this.id}-canvas"></canvas>
                    <div>
                        <button id="${this.id}-clear" class="bounding-box-button">Clear</button>
                        <button id="${this.id}-undo" class="bounding-box-button" disabled>Undo</button>
                        <button id="${this.id}-remove" class="bounding-box-button" disabled>Remove</button>
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    initializeState() {
        this.boxes = [];
        this.history = [[]];
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.activeBox = null;
        this.isDrawing = false;
        this.isMoving = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.scaleFactor = 1;
        this.potentialBox = null;
    }

    bindEventHandlers() {
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleCursorUpdate = this.handleCursorUpdate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    attachEventListeners() {
        this.canvas = document.getElementById(`${this.id}-canvas`);
        this.ctx = this.canvas.getContext('2d');

        this.image = new Image();
        this.image.onload = () => {
            this.resizeCanvas();
            this.draw();
        };
        this.image.src = this.imageUrl;

        this.addEventListenerWithTracking(this.canvas, 'mousedown', this.handleMouseDown);
        this.addEventListenerWithTracking(document.getElementById(`${this.id}-clear`), 'click', this.clearBoxes.bind(this));
        this.addEventListenerWithTracking(document.getElementById(`${this.id}-undo`), 'click', this.undoAction.bind(this));
        this.addEventListenerWithTracking(document.getElementById(`${this.id}-remove`), 'click', this.removeActiveBox.bind(this));
        this.addEventListenerWithTracking(window, 'resize', this.handleResize);
        this.addEventListenerWithTracking(this.canvas, 'touchstart', this.handleTouchStart, { passive: false });
        this.addEventListenerWithTracking(this.canvas, 'touchmove', this.handleTouchMove, { passive: false });
        this.addEventListenerWithTracking(this.canvas, 'touchend', this.handleTouchEnd);
        this.addEventListenerWithTracking(this.canvas, 'mousemove', this.handleCursorUpdate);
        this.addEventListenerWithTracking(document, 'keydown', this.handleKeyDown);
    }

    handleResize() {
        this.resizeCanvas();
        this.draw();
    }

    resizeCanvas() {
        const containerWidth = this.canvas.parentElement.clientWidth;
        this.scaleFactor = containerWidth / this.image.width;
        this.canvas.width = containerWidth;
        this.canvas.height = this.image.height * this.scaleFactor;
    }

    handleMouseDown(e) {
        const { x, y } = this.getScaledPosition(e);
        this.startInteraction(x, y);
        this.addEventListenerWithTracking(document, 'mousemove', this.handleMouseMove);
        this.addEventListenerWithTracking(document, 'mouseup', this.handleMouseUp);
    }

    handleMouseMove(e) {
        const { x, y } = this.getScaledPosition(e);
        this.updateInteraction(x, y);
    }

    handleMouseUp() {
        this.endInteraction();
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const { x, y } = this.getScaledPosition(touch);
        this.startInteraction(x, y);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const { x, y } = this.getScaledPosition(touch);
        this.updateInteraction(x, y);
    }

    handleTouchEnd() {
        this.endInteraction();
    }

    handleCursorUpdate(e) {
        const { x, y } = this.getScaledPosition(e);
        this.updateCursor(x, y);
    }

    handleKeyDown(e) {
        if ((e.key === 'Delete' || e.key === 'Backspace') && this.activeBox) {
            e.preventDefault();
            this.removeActiveBox();
            this.updateHistory();
        }
    }

    startInteraction(x, y) {
        const clickedBox = this.getClickedBox(x, y);

        if (clickedBox) {
            this.activeBox = clickedBox;
            this.dragStartX = x - clickedBox.x;
            this.dragStartY = y - clickedBox.y;
            this.resizeHandle = this.getResizeHandle(clickedBox, x, y);
            this.isResizing = !!this.resizeHandle;
            this.isMoving = !this.isResizing;
        } else {
            this.activeBox = null;
            if (this.boxes.length < this.maxBoxes) {
                this.potentialBox = { startX: x, startY: y };
            }
        }
        this.updateRemoveButtonState();
        this.draw();
    }

    updateInteraction(x, y) {
        if (this.isDrawing) {
            this.updateDrawing(x, y);
        } else if (this.isMoving) {
            this.updateMoving(x, y);
        } else if (this.isResizing) {
            this.updateResizing(x, y);
        } else if (this.potentialBox) {
            this.checkStartDrawing(x, y);
        } else {
            this.updateCursor(x, y);
        }

        this.draw();
    }

    endInteraction() {
        if (this.isDrawing && this.activeBox.width === 0 && this.activeBox.height === 0) {
            this.boxes.pop();
            this.activeBox = null;
        }
        this.isDrawing = false;
        this.isMoving = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.potentialBox = null;
        this.setResponse(this.getScaledBoxes());
        this.updateRemoveButtonState();
        this.draw();
        this.updateHistory();
    }

    updateDrawing(x, y) {
        const width = x - this.activeBox.startX;
        const height = y - this.activeBox.startY;

        this.activeBox.x = width < 0 ? x : this.activeBox.startX;
        this.activeBox.y = height < 0 ? y : this.activeBox.startY;
        this.activeBox.width = Math.abs(width);
        this.activeBox.height = Math.abs(height);

        this.constrainBoxToImage(this.activeBox);
    }

    updateMoving(x, y) {
        const newX = x - this.dragStartX;
        const newY = y - this.dragStartY;
        this.moveBox(this.activeBox, newX, newY);
    }

    updateResizing(x, y) {
        this.resizeBox(x, y);
    }

    checkStartDrawing(x, y) {
        const dx = x - this.potentialBox.startX;
        const dy = y - this.potentialBox.startY;
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
            this.isDrawing = true;
            this.activeBox = {
                startX: this.potentialBox.startX,
                startY: this.potentialBox.startY,
                x: this.potentialBox.startX,
                y: this.potentialBox.startY,
                width: 0,
                height: 0
            };
            this.boxes.push(this.activeBox);
            this.potentialBox = null;
            this.updateRemoveButtonState();
        }
    }

    getScaledPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) / this.scaleFactor,
            y: (clientY - rect.top) / this.scaleFactor
        };
    }

    clearBoxes() {
        this.boxes = [];
        this.activeBox = null;
        this.draw();
        this.setResponse([]);
        this.updateRemoveButtonState();
        this.updateHistory();
    }

    removeActiveBox() {
        if (this.activeBox) {
            this.boxes = this.boxes.filter(box => box !== this.activeBox);
            this.activeBox = null;
            this.draw();
            this.setResponse(this.getScaledBoxes());
            this.updateRemoveButtonState();
            this.updateHistory();
        }
    }

    updateRemoveButtonState() {
        const removeButton = document.getElementById(`${this.id}-remove`);
        removeButton.disabled = !this.activeBox;
    }

    getClickedBox(x, y) {
        return this.boxes.find(box =>
            x >= box.x && x <= box.x + box.width &&
            y >= box.y && y <= box.y + box.height
        );
    }

    getResizeHandle(box, x, y) {
        const handles = [
            { x: box.x, y: box.y, cursor: 'nw-resize' },
            { x: box.x + box.width / 2, y: box.y, cursor: 'n-resize' },
            { x: box.x + box.width, y: box.y, cursor: 'ne-resize' },
            { x: box.x + box.width, y: box.y + box.height / 2, cursor: 'e-resize' },
            { x: box.x + box.width, y: box.y + box.height, cursor: 'se-resize' },
            { x: box.x + box.width / 2, y: box.y + box.height, cursor: 's-resize' },
            { x: box.x, y: box.y + box.height, cursor: 'sw-resize' },
            { x: box.x, y: box.y + box.height / 2, cursor: 'w-resize' },
        ];

        return handles.find(h => Math.abs(x - h.x) < 15 && Math.abs(y - h.y) < 15);
    }

    updateCursor(x, y) {
        const clickedBox = this.getClickedBox(x, y);
        if (clickedBox) {
            const resizeHandle = this.getResizeHandle(clickedBox, x, y);
            this.canvas.style.cursor = resizeHandle ? resizeHandle.cursor : 'move';
        } else {
            this.canvas.style.cursor = this.boxes.length < this.maxBoxes ? 'crosshair' : 'default';
        }
    }

    resizeBox(x, y) {
        const box = this.activeBox;
        let newX = box.x;
        let newY = box.y;
        let newWidth = box.width;
        let newHeight = box.height;

        switch (this.resizeHandle.cursor) {
            case 'nw-resize':
                newWidth = box.width + (box.x - x);
                newHeight = box.height + (box.y - y);
                newX = x;
                newY = y;
                break;
            case 'n-resize':
                newHeight = box.height + (box.y - y);
                newY = y;
                break;
            case 'ne-resize':
                newWidth = x - box.x;
                newHeight = box.height + (box.y - y);
                newY = y;
                break;
            case 'e-resize':
                newWidth = x - box.x;
                break;
            case 'se-resize':
                newWidth = x - box.x;
                newHeight = y - box.y;
                break;
            case 's-resize':
                newHeight = y - box.y;
                break;
            case 'sw-resize':
                newWidth = box.width + (box.x - x);
                newHeight = y - box.y;
                newX = x;
                break;
            case 'w-resize':
                newWidth = box.width + (box.x - x);
                newX = x;
                break;
        }

        // Flip the box if necessary
        if (newWidth < 0) {
            newX += newWidth;
            newWidth = Math.abs(newWidth);
            this.flipResizeHandle('horizontal');
        }
        if (newHeight < 0) {
            newY += newHeight;
            newHeight = Math.abs(newHeight);
            this.flipResizeHandle('vertical');
        }

        // Update the box properties
        box.x = newX;
        box.y = newY;
        box.width = newWidth;
        box.height = newHeight;

        this.constrainBoxToImage(box);
    }

    flipResizeHandle(direction) {
        const flipMap = {
            'horizontal': {
                'nw-resize': 'ne-resize',
                'ne-resize': 'nw-resize',
                'sw-resize': 'se-resize',
                'se-resize': 'sw-resize',
                'w-resize': 'e-resize',
                'e-resize': 'w-resize'
            },
            'vertical': {
                'nw-resize': 'sw-resize',
                'ne-resize': 'se-resize',
                'sw-resize': 'nw-resize',
                'se-resize': 'ne-resize',
                'n-resize': 's-resize',
                's-resize': 'n-resize'
            }
        };

        if (this.resizeHandle && flipMap[direction][this.resizeHandle.cursor]) {
            this.resizeHandle.cursor = flipMap[direction][this.resizeHandle.cursor];
        }
    }

    moveBox(box, newX, newY) {
        box.x = Math.max(0, Math.min(newX, this.image.width - box.width));
        box.y = Math.max(0, Math.min(newY, this.image.height - box.height));
    }

    constrainBoxToImage(box) {
        box.x = Math.max(0, Math.min(box.x, this.image.width - 1));
        box.y = Math.max(0, Math.min(box.y, this.image.height - 1));
        box.width = Math.max(1, Math.min(box.width, this.image.width - box.x));
        box.height = Math.max(1, Math.min(box.height, this.image.height - box.y));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.boxes.forEach(box => {
            this.ctx.fillStyle = this.getRGBAColor(this.boxColor, this.boxOpacity);
            this.ctx.fillRect(
                box.x * this.scaleFactor,
                box.y * this.scaleFactor,
                box.width * this.scaleFactor,
                box.height * this.scaleFactor
            );

            if (box === this.activeBox) {
                this.drawResizeHandles(box);
            }
        });
    }

    drawResizeHandles(box) {
        const handles = [
            { x: box.x, y: box.y },
            { x: box.x + box.width / 2, y: box.y },
            { x: box.x + box.width, y: box.y },
            { x: box.x + box.width, y: box.y + box.height / 2 },
            { x: box.x + box.width, y: box.y + box.height },
            { x: box.x + box.width / 2, y: box.y + box.height },
            { x: box.x, y: box.y + box.height },
            { x: box.x, y: box.y + box.height / 2 },
        ];

        handles.forEach(handle => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(
                handle.x * this.scaleFactor - 5,
                handle.y * this.scaleFactor - 5,
                10, 10
            );
        });
    }

    getRGBAColor(color, opacity) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } else {
            return color;
        }
    }

    getScaledBoxes() {
        return this.boxes.map(box => ({
            x: box.x / this.image.width,
            y: box.y / this.image.height,
            width: box.width / this.image.width,
            height: box.height / this.image.height
        }));
    }

    updateHistory() {
        if (this.boxes.length > 0) {
            if (this.history.length === 1 || JSON.stringify(this.history[this.history.length - 1]) !== JSON.stringify(this.boxes)) {
                this.history.push(JSON.parse(JSON.stringify(this.boxes)));
                document.getElementById(`${this.id}-undo`).disabled = false;
            }
        } else if (this.history.length > 1) {
            this.history = [[]];
            document.getElementById(`${this.id}-undo`).disabled = true;
        }
    }

    undoAction() {
        if (this.history.length > 1) {
            this.history.pop();
            this.boxes = JSON.parse(JSON.stringify(this.history[this.history.length - 1]));
            this.activeBox = null;
            this.draw();
            this.setResponse(this.getScaledBoxes());
            this.updateRemoveButtonState();
            if (this.history.length === 1) {
                document.getElementById(`${this.id}-undo`).disabled = true;
            }
        }
    }

    setResponse(value) {
        super.setResponse(value, value.length > 0);
        this.showValidationError(null);
    }

    validate() {
        // BoundingBox-specific validation
        if (this.required && this.boxes.length === 0) {
            return {
                isValid: false,
                errorMessage: 'Please draw at least one bounding box.'
            };
        }

        // If BoundingBox-specific validation passed, call parent's validate method
        return super.validate();
    }

    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach(({ element, eventType, handler }) => {
            element.removeEventListener(eventType, handler);
        });
        this.eventListeners = [];

        // Clear the canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Reset all state
        this.initializeState();

        // Call the parent destroy method
        super.destroy();
    }
}

export default BoundingBox;