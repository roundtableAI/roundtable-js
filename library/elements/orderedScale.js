import Element from '../core/element.js';

class OrderedScale extends Element {
    static styleKeys = ['root', 'innerContainer', 'label', 'subText', 'scaleContainer', 'scaleItem', 'scaleLabel', 'scaleInput', 'scaleNumber', 'errorMessage'];

    static defaultStyles = {
        root: {
            marginBottom: '20px',
            borderRadius: '5px'
        },
        innerContainer: {},
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            fontSize: '1.1em',
        },
        subText: {
            display: 'block',
            marginBottom: '10px',
            color: '#6c757d',
            fontSize: '0.9em',
        },
        scaleContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '10px',
        },
        scaleItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: '1 1 0',
            minWidth: '40px',
            marginTop: '10px',
        },
        scaleLabel: {
            marginBottom: '5px',
            fontSize: '0.9em',
            textAlign: 'center',
            height: '2.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        scaleInput: {
            margin: '0',
        },
        scaleNumber: {
            marginBottom: '5px',
            fontSize: '0.9em',
        },
        errorMessage: {
            color: '#fa5252',
            fontSize: '0.9em',
            marginTop: '5px',
        }
    };

    constructor({
        id,
        text,
        subText = '',
        required = true,
        min = 1,
        max = 7,
        labels = [],
        styles = {}
    }) {
        super({ id, type: 'ordered-scale', store_data: true, required });

        if (min >= max) {
            throw new Error('Min value must be less than max value');
        }
        if (labels.length > 0 && labels.length !== (max - min + 1)) {
            throw new Error('Number of labels must match the scale range');
        }

        this.text = text;
        this.subText = subText;
        this.min = min;
        this.max = max;
        this.labels = labels;
        if (labels.length === 0) {
            this.constructor.defaultStyles.scaleLabel.height = 'auto';
        }
        this.mergeStyles(OrderedScale.defaultStyles, styles);
        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('min', min);
        this.addData('max', max);
        this.addData('labels', labels);
        this.setInitialResponse(null);
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            innerContainer: `#${this.id}-inner-container`,
            label: '.question-label',
            subText: '.question-subtext',
            scaleContainer: '.scale-container',
            scaleItem: '.scale-item',
            scaleLabel: '.scale-label',
            scaleInput: 'input[type="radio"]',
            scaleNumber: '.scale-number',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        const scaleItems = [];
        for (let i = this.min; i <= this.max; i++) {
            const label = this.labels[i - this.min] || '';
            scaleItems.push(`
                <div class="scale-item">
                    <span class="scale-label">${label}</span>
                    <label for="${this.id}-${i}" class="scale-number">${i}</label>
                    <input type="radio" id="${this.id}-${i}" name="${this.id}" value="${i}">
                </div>
            `);
        }

        return `
            <div class="ordered-scale-question" id="${this.id}-container">
                <div id="${this.id}-inner-container">
                    <label class="question-label" for="${this.id}-${this.min}">${this.text}</label>
                    ${this.subText && `<span class="question-subtext">${this.subText}</span>`}
                    <div class="scale-container">
                        ${scaleItems.join('')}
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'change', this.handleChange.bind(this));
    }

    handleChange(e) {
        if (e.target.type === 'radio') {
            this.setResponse(parseInt(e.target.value, 10));
        }
    }

    setResponse(value) {
        super.setResponse(value, value !== null);
        this.showValidationError('');
    }

    validate(showError = false) {
        const isValid = !this.required || (this.data.response !== null && !isNaN(this.data.response));
        if (showError && !isValid) {
            this.showValidationError('Please select a rating.');
        } else {
            this.showValidationError('');
        }
        return isValid;
    }
}

export default OrderedScale;