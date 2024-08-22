import Element from '../core/element.js';

class OpenEnd extends Element {
    static styleKeys = [...Element.styleKeys, 'textarea'];

    static selectorMap = {
        ...Element.selectorMap,
        textarea: 'textarea'
    };

    static defaultStyles = {
        textarea: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1em',
            marginBottom: '0px',
            display: 'block',
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
        maxLength = 10000,
        rows = 2,
        placeholder = '',
        required = true,
        includeAlias = true,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'open-end', store_data: true, required, customValidation, styles });

        if (minLength < 0 || maxLength < minLength) {
            throw new Error('Invalid length constraints');
        }

        this.text = text;
        this.subText = subText;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.rows = rows;
        this.placeholder = placeholder;
        this.includeAlias = Boolean(includeAlias);
        this.aliasMaxLength = 10000;
        this.aliasTypingHistory = [];
        this.aliasStartTime = null;
        this.aliasTextOverLength = false;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('minLength', minLength);
        this.addData('maxLength', maxLength);
        this.addData('includeAlias', this.includeAlias);
        this.addData('aliasMaxLength', this.aliasMaxLength);
        this.addData('aliasTypingHistory', this.aliasTypingHistory);
        this.initialResponse = '';

        this.elementStyleKeys = [...OpenEnd.styleKeys];
        this.selectorMap = { ...OpenEnd.selectorMap };
    }

    generateHTML() {
        return `
            <div class="open-end-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text" for="${this.id}">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <textarea 
                        id="${this.id}" 
                        name="${this.id}" 
                        minlength="${this.minLength}" 
                        maxlength="${this.maxLength}" 
                        placeholder="${this.placeholder}"
                        rows="${this.rows}"
                        ${this.required ? 'required' : ''}
                    ></textarea>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const textarea = document.getElementById(this.id);
        this.addEventListenerWithTracking(textarea, 'input', this.handleInput.bind(this));
        this.addEventListenerWithTracking(textarea, 'copy', this.handleCopy.bind(this));
    }

    handleInput(e) {
        const value = e.target.value;
        this.setResponse(value);
        if (this.includeAlias && !this.aliasTextOverLength) {
            const t = this.initializeAliasStartTime();
            const newHistory = { s: value, t };
            this.updateAliasTypingHistory(newHistory);
        }
    }

    handleCopy(e) {
        if (this.includeAlias && !this.aliasTextOverLength) {
            const t = this.initializeAliasStartTime();
            const newHistory = {
                s: e.target.value,
                t,
                o: 'c',
                ct: window.getSelection().toString(),
            };
            this.updateAliasTypingHistory(newHistory);
        }
    }

    updateAliasTypingHistory(newHistory) {
        const lengthOfHistory = JSON.stringify([...this.aliasTypingHistory, newHistory]).length;
        if (lengthOfHistory > this.aliasMaxLength) {
            this.aliasTextOverLength = true;
            return;
        }
        this.aliasTypingHistory.push(newHistory);
    }

    initializeAliasStartTime() {
        if (this.aliasStartTime) return Date.now() - this.aliasStartTime;
        this.aliasStartTime = Date.now();
        return 0;
    }

    setResponse(value) {
        super.setResponse(value);
        this.addData('responseLength', value.length);
        this.showValidationError(null);
    }

    validate() {
        // OpenEnd-specific validation
        const value = this.data.response || '';

        if (value.length < this.minLength) {
            return { isValid: false, errorMessage: `Please enter at least ${this.minLength} characters.` };
        }
        if (value.length > this.maxLength) {
            return { isValid: false, errorMessage: `Please enter no more than ${this.maxLength} characters.` };
        }

        // If OpenEnd-specific validation passes, call parent's validate method
        return super.validate();
    }

    destroy() {
        // Perform any OpenEnd-specific cleanup here
        this.aliasTypingHistory = [];
        this.aliasStartTime = null;
        this.aliasTextOverLength = false;

        // Then call the parent destroy method
        super.destroy();
    }
}

export default OpenEnd;