import Element from '../core/element.js';

class SingleSelect extends Element {
    static styleKeys = [...Element.styleKeys, 'optionsContainer', 'option', 'radio'];

    static selectorMap = {
        ...Element.selectorMap,
        optionsContainer: '.options-container',
        option: '.option',
        radio: 'input[type="radio"]'
    };

    static defaultStyles = {
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        option: {
            marginBottom: '5px'
        },
        radio: {
            marginRight: '5px'
        }
    };

    constructor({
        id,
        text,
        subText = '',
        options,
        required = true,
        randomize = false,
        styles = {},
        customValidation = null
    }) {
        super({ id, type: 'single-select', store_data: true, required, styles, customValidation });


        if (!Array.isArray(options) || options.length === 0) {
            throw new Error('Options must be a non-empty array');
        }

        this.text = text;
        this.subText = subText;
        this.options = options;
        this.randomize = Boolean(randomize);

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);
        this.addData('randomize', this.randomize);

        this.initialResponse = '';
        this.elementStyleKeys = [...SingleSelect.styleKeys];
        this.selectorMap = { ...SingleSelect.selectorMap };
    }

    getSelectorForKey(key) {
        return this.selectorMap[key] || '';
    }

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => `
            <div class="option">
                <input type="radio" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `).join('');

        return `
            <div class="single-select-question" id="${this.id}-container">
                <div class="inner-container">
                    <label class="question-label" for="${this.id}-0">${this.text}</label>
                    ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    <div class="options-container">
                        ${optionsString}
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'change', this.handleChange.bind(this));
    }

    handleChange(e) {
        if (e.target.type === 'radio') {
            this.setResponse(e.target.value);
        }
    }

    setResponse(value) {
        super.setResponse(value);
        this.showValidationError(null);
    }

    validate() {
        const value = this.data.response;

        // SingleSelect-specific validation
        if (!value) {
            return { isValid: false, errorMessage: 'Please select an option.' };
        }

        if (!this.options.includes(value)) {
            return { isValid: false, errorMessage: 'Selected option is not valid.' };
        }

        // If SingleSelect-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default SingleSelect;