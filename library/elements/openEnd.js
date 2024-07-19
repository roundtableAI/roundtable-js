import Element from '../core/element.js';

class OpenEnd extends Element {
    static styleKeys = ['root', 'innerContainer','label', 'subText', 'textarea', 'errorMessage'];

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
        maxLength = 10000, 
        rows = 2, 
        placeholder = '', 
        required = true, 
        includeAlias = true, 
        styles = {} 
    }) {
        super({ id, type: 'open-end', store_data: true, required });

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

        this.mergeStyles(OpenEnd.defaultStyles, styles);

        this.aliasMaxLength = 10000;
        this.aliasTypingHistory = [];
        this.aliasStartTime = null;
        this.aliasTextOverLength = false;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('minLength', minLength);
        this.addData('maxLength', maxLength);
        this.addData('includeAlias', this.includeAlias);
        this.setInitialResponse('');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            innerContainer: `#${this.id}-inner-container`,
            label: 'label',
            subText: '.question-subtext',
            textarea: 'textarea',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        return `
            <div class="open-end-question" id="${this.id}-container">
                <div id="${this.id}-inner-container">
                    <label for="${this.id}">${this.text}</label>
                    ${this.subText && `<span class="question-subtext">${this.subText}</span>`}
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