import Element from '../core/element.js';

class MultiSelect extends Element {
    static styleKeys = [...Element.styleKeys, 'optionsContainer', 'option', 'checkbox', 'label'];

    static selectorMap = {
        ...Element.selectorMap,
        optionsContainer: '.options-container',
        option: '.option',
        checkbox: 'input[type="checkbox"]',
        label: 'label'
    };

    static defaultStyles = {
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            lineHeight: '1',
        },
        option: {
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#e0e0e0',
                '@media (max-width: 650px)': {
                    backgroundColor: '#f0f0f0'
                }
            },
            '@media (max-width: 650px)': {
                padding: '12px'
            }
        },

        checkbox: {
            width: '20px',
            height: '20px',
            accentColor: 'black',
            borderColor: 'black',
            backgroundColor: 'transparent',
            margin: '0',
            marginRight: '10px',
            '@media (max-width: 650px)': {
                width: '16px',
                height: '16px'
            }
        },
        label: {
            cursor: 'pointer',
            flexGrow: 1
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

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => `
            <div class="option" data-value="${option}">
                <input type="checkbox" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `).join('');

        return `
            <div class="multi-select-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <div class="options-container">
                        ${optionsString}
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }
    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'click', this.handleClick.bind(this));
    }

    handleClick(e) {
        const optionDiv = e.target.closest('.option');
        if (optionDiv) {
            const checkbox = optionDiv.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
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

        if (this.minSelected > 0 && selectedCount < this.minSelected) {
            return { isValid: false, errorMessage: `Please select at least ${this.minSelected} option(s).` };
        }

        if (this.maxSelected !== null && selectedCount > this.maxSelected) {
            return { isValid: false, errorMessage: `Please select no more than ${this.maxSelected} option(s).` };
        }

        return super.validate();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default MultiSelect;