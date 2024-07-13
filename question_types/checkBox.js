import Element from '../core/element.js';

class CheckBox extends Element {
    static styleKeys = ['root', 'label', 'checkbox', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
            borderRadius: '5px',
            fontSize: '1em',
        },
        label: { 
            display: 'inline-block',
            fontSize: '1.1em',
            fontWeight: 'bold'
        },
        checkbox: {
            marginRight: '5px'
        },
        errorMessage: {}
    };

    constructor({ id, text, required = false, styles = {} }) {
        super({ id, type: 'checkbox', store_data: true, required });
        this.text = text;
        this.styles = this.mergeStyles(CheckBox.defaultStyles, styles);
        this.addData('text', text);
        this.setResponse(false);
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            label: 'label',
            checkbox: 'input[type="checkbox"]',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        const styleString = this.generateStylesheet();

        return `
            <style>${styleString}</style>
            <div class="checkbox-question" id="${this.id}-container">
                <input type="checkbox" id="${this.id}" name="${this.id}">
                <label for="${this.id}">${this.text}</label>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const checkbox = document.getElementById(this.id);
        checkbox.addEventListener('change', (e) => {
            this.setResponse(e.target.checked);
        });
    }

    setResponse(value) {
        super.setResponse(value, true);
        this.showValidationError('');
    }

    validate(showError = false) {
        const isValid = !this.required || this.data.response === true;
        if (showError && !isValid) {
            this.showValidationError('This checkbox is required.');
        }
        return isValid;
    }
}

export default CheckBox;