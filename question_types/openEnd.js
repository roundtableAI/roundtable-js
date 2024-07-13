import Element from '../core/element.js';

class OpenEnd extends Element {
    static styleKeys = ['root', 'label', 'subText', 'textarea', 'errorMessage'];

    static defaultStyles = {
        root: {
            marginBottom: '20px',
        },
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
        textarea: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1em',   
        },
        errorMessage: {}
    };

    constructor({ id, text, subText = '', minLength = 0, maxLength = 1000, rows = 2, placeholder = '', required = true, styles = {} }) {
        super({ id, type: 'open-end', store_data: true, required });
        this.text = text;
        this.subText = subText;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.rows = rows;
        this.placeholder = placeholder;
        this.styles = this.mergeStyles(OpenEnd.defaultStyles, styles);
        this.setResponse('');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            label: 'label',
            subText: '.question-subtext',
            textarea: 'textarea',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        const styleString = this.generateStylesheet();
        return `
            <style>${styleString}</style>
            <div class="open-end-question" id="${this.id}-container">
                <label for="${this.id}">${this.text}</label>
                ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                <textarea 
                    id="${this.id}" 
                    name="${this.id}" 
                    minlength="${this.minLength}" 
                    maxlength="${this.maxLength}" 
                    placeholder="${this.placeholder}"
                    rows="${this.rows}"
                    ${this.required ? 'required' : ''}
                ></textarea>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const textarea = document.getElementById(this.id);

        textarea.addEventListener('input', (e) => {
            const value = e.target.value;
            this.setResponse(value);
        });
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
        }

        return isValid;
    }
}

export default OpenEnd;