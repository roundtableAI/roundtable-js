import Element from '../core/element.js';

class CheckBox extends Element {
    static styleKeys = [...Element.styleKeys, 'checkboxFlexContainer', 'checkbox', 'checkboxLabel']

    static selectorMap = {
        ...Element.selectorMap,
        checkboxFlexContainer: '.checkbox-flex-container',
        checkbox: 'input[type="checkbox"]',
        checkboxLabel: '.checkbox-label',
    };

    static defaultStyles = {
        checkboxFlexContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px',
            background: 'white',
        },
        checkbox: {
            height: '16px',
            width: '16px',
        },
        checkboxLabel: {
            fontSize: '1.1em',
            fontWeight: '600',
        }
    };

    constructor({
        id,
        text,
        required = true,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'checkbox', store_data: true, required, customValidation, styles });
        this.text = text;
        this.addData('text', text);
        this.initialResponse = false;

        this.elementStyleKeys = [...CheckBox.styleKeys];
        this.selectorMap = { ...CheckBox.selectorMap };
    }

    getSelectorForKey(key) {
        return this.selectorMap[key] || '';
    }

    generateHTML() {
        return `
            <div id="${this.id}-container" class="checkbox-question">
                <div class="inner-container">
                    <div class="checkbox-flex-container">
                        <input type="checkbox" id="${this.id}" name="${this.id}">
                        <label for="${this.id}" class="checkbox-label">${this.text}</label>
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
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
        this.showValidationError(null);
    }

    validate() {
        // CheckBox-specific validation
        if (this.required && this.data.response !== true) {
            return {
                isValid: false,
                errorMessage: 'This checkbox is required.'
            };
        }

        // If CheckBox-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default CheckBox;