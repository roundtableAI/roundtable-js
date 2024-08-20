import Element from '../core/element.js';

class OrderedScale extends Element {
    static styleKeys = [...Element.styleKeys, 'scaleContainer', 'scaleItem', 'scaleLabel', 'scaleInput', 'scaleNumber'];

    static selectorMap = {
        ...Element.selectorMap,
        scaleContainer: '.scale-container',
        scaleItem: '.scale-item',
        scaleLabel: '.scale-label',
        scaleInput: 'input[type="radio"]',
        scaleNumber: '.scale-number'
    };

    static defaultStyles = {
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
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'ordered-scale', store_data: true, required, customValidation, styles });

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

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('min', min);
        this.addData('max', max);
        this.addData('labels', labels);

        this.initialResponse = null;

        this.elementStyleKeys = [...OrderedScale.styleKeys];
        this.selectorMap = { ...OrderedScale.selectorMap };
    }

    getSelectorForKey(key) {
        return this.selectorMap[key] || '';
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
                <div class="inner-container">
                    <label class="question-label" for="${this.id}-${this.min}">${this.text}</label>
                    ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
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
        super.setResponse(value);
        this.showValidationError(null);
    }

    validate() {
        // OrderedScale-specific validation
        const response = this.data.response;

        if (response === null || isNaN(response)) {
            return { isValid: false, errorMessage: 'Please select a rating.' };
        }

        if (response < this.min || response > this.max) {
            return { isValid: false, errorMessage: `Please select a rating between ${this.min} and ${this.max}.` };
        }

        // If OrderedScale-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default OrderedScale;