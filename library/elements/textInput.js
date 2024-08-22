import Element from '../core/element.js';

class TextInput extends Element {
    static styleKeys = [...Element.styleKeys, 'input'];

    static selectorMap = {
        ...Element.selectorMap,
        input: 'input[type="text"]'
    };

    static defaultStyles = {
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1em',
            marginBottom: '0px',
            display: 'block',
            // Focus
            '&:focus': {
                borderColor: 'black',
                outline: 'none',
            },
        }
    };

    constructor({
        id,
        text,
        subText = '',
        minLength = 0,
        maxLength = 255,
        placeholder = '',
        required = true,
        customValidation = null,
        styles = {},
    }) {
        super({ id, type: 'text-input', store_data: true, required, customValidation, styles });

        if (minLength < 0 || maxLength < minLength) {
            throw new Error('Invalid length constraints');
        }

        this.text = text;
        this.subText = subText;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.placeholder = placeholder;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('minLength', minLength);
        this.addData('maxLength', maxLength);

        this.initialResponse = '';
        this.elementStyleKeys = [...TextInput.styleKeys];
        this.selectorMap = { ...TextInput.selectorMap };
    }

    generateHTML() {
        return `
            <div class="text-input-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text" for="${this.id}">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <input 
                        type="text"
                        id="${this.id}" 
                        name="${this.id}" 
                        minlength="${this.minLength}" 
                        maxlength="${this.maxLength}" 
                        placeholder="${this.placeholder}"
                        ${this.required ? 'required' : ''}
                    >
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const input = document.getElementById(this.id);
        this.addEventListenerWithTracking(input, 'input', this.handleInput.bind(this));
    }

    handleInput(e) {
        const value = e.target.value;
        this.setResponse(value);
    }

    setResponse(value) {
        super.setResponse(value);
        this.addData('responseLength', value.length);
        this.showValidationError(null);
    }

    validate() {
        const value = this.data.response || '';

        // TextInput-specific validation
        if (value.length < this.minLength) {
            return { isValid: false, errorMessage: `Please enter at least ${this.minLength} characters.` };
        }
        if (value.length > this.maxLength) {
            return { isValid: false, errorMessage: `Please enter no more than ${this.maxLength} characters.` };
        }

        // If TextInput-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default TextInput;