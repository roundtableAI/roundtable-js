import Element from '../core/element.js';

class SingleSelect extends Element {
    static styleKeys = [...Element.styleKeys, 'optionsContainer', 'option', 'radio', 'label', 'otherInput'];

    static selectorMap = {
        ...Element.selectorMap,
        optionsContainer: '.options-container',
        option: '.option',
        radio: 'input[type="radio"]',
        label: 'label',
        otherInput: '.other-input'
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
            },
            '@media (max-width: 650px)': {
                padding: '12px'
            }
        },
        radio: {
            appearance: 'none',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1px solid #767676',
            background: 'white',
            outline: 'none',
            margin: 'auto',
            marginRight: '10px',
            cursor: 'pointer',
            verticalAlign: 'middle',
            '&:checked': {
                backgroundColor: 'black',
                boxShadow: 'inset 0 0 0 3px #ffffff'
            },
            '@media (max-width: 650px)': {
                width: '16px',
                height: '16px'
            }
        },
        label: {
            cursor: 'pointer',
            flexGrow: 1
        },
        otherInput: {
            marginTop: '0px',
            fontSize: '16px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
        }
    };

    constructor({
        id,
        text,
        subText = '',
        options,
        required = true,
        randomize = false,
        allowOther = false,
        otherText = 'Other (please specify)',
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
        this.allowOther = Boolean(allowOther);
        this.otherText = otherText;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);
        this.addData('randomize', this.randomize);
        this.addData('allowOther', this.allowOther);

        this.initialResponse = '';
        this.elementStyleKeys = [...SingleSelect.styleKeys];
        this.selectorMap = { ...SingleSelect.selectorMap };
    }

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => this.generateOptionHTML(option, index)).join('');

        const otherOptionHTML = this.allowOther ? this.generateOtherOptionHTML() : '';

        return `
            <div class="single-select-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <div class="options-container">
                        ${optionsString}
                        ${otherOptionHTML}
                    </div>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    generateOptionHTML(option, index) {
        return `
            <div class="option" data-value="${option}">
                <input type="radio" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `;
    }

    generateOtherOptionHTML() {
        return `
            <div class="option" data-value="other">
                <input type="radio" id="${this.id}-other" name="${this.id}" value="other">
                <label for="${this.id}-other">${this.otherText}</label>
            </div>
            <input type="text" class="other-input" id="${this.id}-other-input" style="display: none;">
        `;
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'click', this.handleClick.bind(this));
        
        if (this.allowOther) {
            const otherInput = document.getElementById(`${this.id}-other-input`);
            this.addEventListenerWithTracking(otherInput, 'input', this.handleOtherInput.bind(this));
        }
    }

    handleClick(e) {
        const optionDiv = e.target.closest('.option');
        if (optionDiv) {
            const radio = optionDiv.querySelector('input[type="radio"]');
            radio.checked = true;
            const selectedValue = radio.value;

            if (this.allowOther) {
                const otherInput = document.getElementById(`${this.id}-other-input`);
                if (selectedValue === 'other') {
                    otherInput.style.display = 'block';
                    this.setResponse({ selected: 'other', otherValue: otherInput.value });
                } else {
                    otherInput.style.display = 'none';
                    otherInput.value = '';
                    this.setResponse(selectedValue);
                }
            } else {
                this.setResponse(selectedValue);
            }
        }
    }

    handleOtherInput(e) {
        const otherValue = e.target.value;
        this.setResponse({ selected: 'other', otherValue: otherValue });
    }

    setResponse(value) {
        super.setResponse(value);
        this.showValidationError(null);
    }

    validate() {
        const value = this.data.response;

        if (!value && this.required) {
            return { isValid: false, errorMessage: 'Please select an option.' };
        }

        if (this.required && this.allowOther) {
            if (typeof value === 'object' && value.selected === 'other') {
                if (!value.otherValue || !value.otherValue.trim()) {
                    return { isValid: false, errorMessage: 'Please specify the other option.' };
                }
            }
        }

        if (typeof value === 'string' && !this.options.includes(value) && value !== 'other') {
            return { isValid: false, errorMessage: 'Selected option is not valid.' };
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

export default SingleSelect;