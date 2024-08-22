import Element from '../core/element.js';

class NumberEntry extends Element {
    static styleKeys = [...Element.styleKeys, 'input', 'unit'];

    static selectorMap = {
        ...Element.selectorMap,
        input: 'input[type="number"]',
        unit: '.unit-label'
    };

    static defaultStyles = {
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
        }
    };

    constructor({
        id,
        text,
        subText = '',
        min = null,
        max = null,
        step = 1,
        unit = '',
        required = true,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'number-entry', store_data: true, required, customValidation, styles });
        this.text = text;
        this.subText = subText;
        this.min = min;
        this.max = max;
        this.step = step;
        this.unit = unit;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('min', min);
        this.addData('max', max);
        this.addData('step', step);
        this.addData('unit', unit);
        this.initialResponse = '';

        this.elementStyleKeys = [...NumberEntry.styleKeys];
        this.selectorMap = { ...NumberEntry.selectorMap };
    }

    generateHTML() {
        const minAttr = this.min !== null ? `min="${this.min}"` : '';
        const maxAttr = this.max !== null ? `max="${this.max}"` : '';

        return `
            <div class="number-entry-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text" for="${this.id}">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
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
        this.addEventListenerWithTracking(input, 'input', (e) => {
            this.setResponse(e.target.value);
        });
    }

    setResponse(value) {
        super.setResponse(value);
        this.addData('numericValue', value !== '' ? parseFloat(value) : null);
        this.showValidationError(null);
    }

    validate() {
        const value = this.data.response;

        // NumberEntry-specific validation
        if (value !== '') {
            const numValue = parseFloat(value);

            if (isNaN(numValue)) {
                return { isValid: false, errorMessage: 'Please enter a valid number.' };
            }

            if (this.min !== null && numValue < this.min) {
                return { isValid: false, errorMessage: `Please enter a number greater than or equal to ${this.min}.` };
            }

            if (this.max !== null && numValue > this.max) {
                return { isValid: false, errorMessage: `Please enter a number less than or equal to ${this.max}.` };
            }
        }

        // If NumberEntry-specific validation passes, call parent's validate method
        return super.validate();
    }
}

export default NumberEntry;