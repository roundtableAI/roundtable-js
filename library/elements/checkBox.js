import Element from '../core/element.js';

class CheckBox extends Element {
    static styleKeys = ['root', 'innerContainer', 'label', 'checkbox', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
            fontSize: '1em',
        },
        innerContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px',
        },
        label: { 
            display: 'block',
            fontSize: '1.1em',
            fontWeight: 'bold',
        },
        checkbox: {
            height: '16px',
            width: '16px',
        },
        errorMessage: {
            color: '#fa5252',
            fontSize: '0.9em',
            marginTop: '5px',
        }
    };

    constructor({ id, text, required = true, styles = {} }) {
        super({ id, type: 'checkbox', store_data: true, required });
        this.text = text;
        this.mergeStyles(CheckBox.defaultStyles, styles);
        this.addData('text', text);
        this.setInitialResponse(false);
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            innerContainer: `#${this.id}-inner-container`,
            label: 'label',
            checkbox: 'input[type="checkbox"]',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        return `
            <div id="${this.id}-container" class="checkbox-question">
                <div id="${this.id}-inner-container">
                    <input type="checkbox" id="${this.id}" name="${this.id}">
                    <label for="${this.id}">${this.text}</label>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;">
            </div>
        `;
    }

    attachEventListeners() {
        const checkbox = document.getElementById(this.id);
        this.addEventListenerWithTracking(checkbox, 'change', (e) => {
            this.setResponse(e.target.checked);
        });
    }

    setResponse(value) {
        super.setResponse(Boolean(value));
    }

    validate(showError = false) {
        const isValid = !this.required || this.data.response === true;
        if (showError && !isValid) {
            this.showValidationError('This checkbox is required.');
        } else {
            this.showValidationError('');
        }
        return isValid;
    }
}

export default CheckBox;