import Element from '../core/element.js';

class MultiSelect extends Element {
    static styleKeys = [...Element.styleKeys, 'optionsContainer', 'option', 'checkbox'];

    static selectorMap = {
        ...Element.selectorMap,
        optionsContainer: '.options-container',
        option: '.option',
        checkbox: 'input[type="checkbox"]'
    };

    static defaultStyles = {
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        option: {
            marginBottom: '5px'
        },
        checkbox: {
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
        minSelected = 0,
        maxSelected = null,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'multi-select', store_data: true, required, customValidation, styles });

        if (!Array.isArray(options) || options.length === 0) {
            throw new Error('Options must be a non-empty array');
        }
        if (minSelected < 0 || (maxSelected !== null && minSelected > maxSelected)) {
            throw new Error('Invalid minSelected or maxSelected values');
        }

        this.text = text;
        this.subText = subText;
        this.options = options;
        this.randomize = Boolean(randomize);
        this.minSelected = minSelected;
        this.maxSelected = maxSelected;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);
        this.addData('randomize', this.randomize);
        this.addData('minSelected', minSelected);
        this.addData('maxSelected', maxSelected);
        this.initialResponse = [];

        this.elementStyleKeys = [...MultiSelect.styleKeys];
        this.selectorMap = { ...MultiSelect.selectorMap };
    }

    getSelectorForKey(key) {
        return this.selectorMap[key] || '';
    }

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => `
            <div class="option">
                <input type="checkbox" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `).join('');

        return `
            <div class="multi-select-question" id="${this.id}-container">
                <div class="inner-container">
                    <label class="question-label">${this.text}</label>
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
        if (e.target.type === 'checkbox') {
            this.updateResponse();
        }
    }

    updateResponse() {
        const container = document.getElementById(`${this.id}-container`);
        const checkedBoxes = container.querySelectorAll(`input[name="${this.id}"]:checked`);
        const selectedOptions = Array.from(checkedBoxes).map(cb => cb.value);
        this.setResponse(selectedOptions);
    }

    setResponse(value) {
        super.setResponse(value);
        this.showValidationError(null);
    }

    validate() {
        const selectedCount = this.data.response ? this.data.response.length : 0;

        // MultiSelect-specific validation
        if (this.minSelected > 0 && selectedCount < this.minSelected) {
            return { isValid: false, errorMessage: `Please select at least ${this.minSelected} option(s).` };
        }

        if (this.maxSelected !== null && selectedCount > this.maxSelected) {
            return { isValid: false, errorMessage: `Please select no more than ${this.maxSelected} option(s).` };
        }

        // If MultiSelect-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default MultiSelect;