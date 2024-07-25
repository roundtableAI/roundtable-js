import Element from '../core/element.js';

class TextInput extends Element {
    static styleKeys = ['root', 'innerContainer', 'label', 'subText', 'input', 'errorMessage'];

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
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1em',
            marginBottom: '0px',
            display: 'block',
        },
        errorMessage: {
            marginTop: '5px',
            color: '#fa5252',
            fontSize: '0.9em',
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
        styles = {} 
    }) {
        super({ id, type: 'text-input', store_data: true, required });

        if (minLength < 0 || maxLength < minLength) {
            throw new Error('Invalid length constraints');
        }

        this.text = text;
        this.subText = subText;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.placeholder = placeholder;

        this.mergeStyles(TextInput.defaultStyles, styles);

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('minLength', minLength);
        this.addData('maxLength', maxLength);
        this.setInitialResponse('');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            innerContainer: `#${this.id}-inner-container`,
            label: 'label',
            subText: '.question-subtext',
            input: 'input',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        return `
            <div class="text-input-question" id="${this.id}-container">
                <div id="${this.id}-inner-container">
                    <label for="${this.id}">${this.text}</label>
                    ${this.subText && `<span class="question-subtext">${this.subText}</span>`}
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
        super.setResponse(value, value.trim() !== '');
        this.addData('responseLength', value.length);
    }

    validate(showError = false) {
        const value = this.data.response || '';
        let isValid = true;
        let errorMessage = '';

        if (this.required && value.trim().length === 0) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (value.length < this.minLength) {
            isValid = false;
            errorMessage = `Please enter at least ${this.minLength} characters.`;
        } else if (value.length > this.maxLength) {
            isValid = false;
            errorMessage = `Please enter no more than ${this.maxLength} characters.`;
        }

        if (showError) {
            this.showValidationError(errorMessage);
        } else {
            this.showValidationError('');
        }

        return isValid;
    }
}

export default TextInput;