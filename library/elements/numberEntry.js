import Element from '../core/element.js';

class NumberEntry extends Element {
    static styleKeys = ['root', 'innerContainer','label', 'subText', 'input', 'unit', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
        },
        innerContainer: { },
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
            fontSize: '1.1em',
        },
        input: {
            width: '80px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1em',
        },
        unit: {
            marginLeft: '5px',
            fontSize: '0.9em',
        },
        errorMessage: {
            marginTop: '5px',
            color: '#fa5252',
            fontSize: '0.9em',
        }
    };

    constructor({ id, text, subText = '', min = null, max = null, step = 1, unit = '', required = true, styles = {} }) {
        super({ id, type: 'number-entry', store_data: true, required });
        this.text = text;
        this.subText = subText;
        this.min = min;
        this.max = max;
        this.step = step;
        this.unit = unit;
        this.mergeStyles(NumberEntry.defaultStyles, styles);
        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('min', min);
        this.addData('max', max);
        this.addData('step', step);
        this.addData('unit', unit);
        this.setInitialResponse('');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            innerContainer: `#${this.id}-inner-container`,
            label: 'label',
            subText: '.question-subtext',
            input: 'input[type="number"]',
            unit: '.unit-label',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        const minAttr = this.min !== null ? `min="${this.min}"` : '';
        const maxAttr = this.max !== null ? `max="${this.max}"` : '';

        return `
            <div class="number-entry-question" id="${this.id}-container">
                <div id="${this.id}-inner-container">
                    <label for="${this.id}">${this.text}</label>
                    ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    <div>
                        <input 
                            type="number" 
                            id="${this.id}" 
                            name="${this.id}" 
                            ${minAttr}
                            ${maxAttr}
                            step="${this.step}"
                            ${this.required ? 'required' : ''}
                        >
                        ${this.unit ? `<span class="unit-label">${this.unit}</span>` : ''}
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const input = document.getElementById(this.id);
        input.addEventListener('input', (e) => {
            this.setResponse(e.target.value);
        });
    }

    setResponse(value) {
        super.setResponse(value, value !== '');
        this.addData('numericValue', value !== '' ? parseFloat(value) : null);
    }

    validate(showError = false) {
        const value = this.data.response;
        let isValid = true;
        let errorMessage = '';

        if (this.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (value !== '') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid number.';
            } else if (this.min !== null && numValue < this.min) {
                isValid = false;
                errorMessage = `Please enter a number greater than or equal to ${this.min}.`;
            } else if (this.max !== null && numValue > this.max) {
                isValid = false;
                errorMessage = `Please enter a number less than or equal to ${this.max}.`;
            }
        }

        if (showError) {
            this.showValidationError(errorMessage);
        }

        return isValid;
    }
}

export default NumberEntry;