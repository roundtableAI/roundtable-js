import Element from '../core/element.js';

class NumberScale extends Element {
    static styleKeys = [...Element.styleKeys, 'scaleContainer', 'scaleItem', 'scaleInput', 'scaleCircle', 'scaleNumber', 'scaleLabels'];

    static selectorMap = {
        ...Element.selectorMap,
        scaleContainer: '.scale-container',
        scaleItem: '.scale-item',
        scaleInput: 'input[type="radio"]',
        scaleCircle: '.scale-circle',
        scaleNumber: '.scale-number',
        scaleLabels: '.scale-labels'
    };

    static defaultStyles = {
        scaleOuterContainer: {},
        scaleContainer: {
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(36px, 1fr))`,
            gridGap: '5px',
            rowGap: '5px',
        },
        scaleItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            height: '42px',
        },
        scaleInput: {
            position: 'absolute',
            opacity: '0',
            cursor: 'pointer',
            height: '0',
            width: '0',
        },
        scaleCircle: {
            width: '100%',
            height: '42px',
            flexGrow: '1',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            '&:hover': {
                backgroundColor: '#e0e0e0',
            },
        },
        scaleNumber: {
            fontSize: '16px',
            textAlign: 'center',
            color: '#333',
        },
        scaleLabels: {
            marginTop: '5px',
            fontSize: '12px',
            color: '#888',
            display: 'flex',
            justifyContent: 'space-between',
        }
    };

    constructor({
        id,
        text,
        subText = '',
        required = true,
        min = 1,
        max = 5,
        minLabel = '',
        maxLabel = '',
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'number-scale', store_data: true, required, customValidation, styles });

        if (min >= max) {
            throw new Error('Min value must be less than max value');
        }

        this.text = text;
        this.subText = subText;
        this.min = min;
        this.max = max;
        this.minLabel = minLabel;
        this.maxLabel = maxLabel;
        this.selectedBackgroundColor = '#333';
        this.selectedTextColor = '#fff';

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('min', min);
        this.addData('max', max);
        this.addData('minLabel', minLabel);
        this.addData('maxLabel', maxLabel);

        this.initialResponse = null;

        this.elementStyleKeys = [...NumberScale.styleKeys];
        this.selectorMap = { ...NumberScale.selectorMap };
    }

    generateHTML() {
        const scaleItems = [];
        for (let i = this.min; i <= this.max; i++) {
            scaleItems.push(`
                <div class="scale-item">
                    <input type="radio" id="${this.id}-${i}" name="${this.id}" value="${i}">
                    <label for="${this.id}-${i}" class="scale-circle">
                        <span class="scale-number">${i}</span>
                    </label>
                </div>
            `);
        }

        const showLabels = this.minLabel || this.maxLabel;

        return `
            <div class="ordered-scale-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text" for="${this.id}-${this.min}">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <div class="scale-container">
                        ${scaleItems.join('')}
                    </div>
                    ${showLabels ? `
                    <div class="scale-labels">
                        <div>${this.min} - ${this.minLabel}</div>
                        <div>${this.max} - ${this.maxLabel}</div>
                    </div>
                    ` : ''}
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'change', this.handleChange.bind(this));
        this.updateSelectedStyles();
    }

    handleChange(e) {
        if (e.target.type === 'radio') {
            this.setResponse(parseInt(e.target.value, 10));
            this.updateSelectedStyles();
        }
    }

    updateSelectedStyles() {
        const container = document.getElementById(`${this.id}-container`);
        const circles = container.querySelectorAll('.scale-circle');
        const selectedInput = container.querySelector('input:checked');

        circles.forEach(circle => {
            // Remove inline styles for all circles
            circle.style.removeProperty('background-color');
            circle.querySelector('.scale-number').style.removeProperty('color');
        });

        if (selectedInput) {
            const selectedCircle = selectedInput.nextElementSibling;
            selectedCircle.style.backgroundColor = this.selectedBackgroundColor;
            selectedCircle.querySelector('.scale-number').style.color = this.selectedTextColor;
        }
    }

    setResponse(value) {
        super.setResponse(value);
        this.showValidationError(null);
        this.updateSelectedStyles();
    }

    validate() {
        const response = this.data.response;

        if (response === null || isNaN(response)) {
            return { isValid: false, errorMessage: 'Please select a rating.' };
        }

        if (response < this.min || response > this.max) {
            return { isValid: false, errorMessage: `Please select a rating between ${this.min} and ${this.max}.` };
        }

        return super.validate();
    }
}

export default NumberScale;