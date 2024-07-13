import Element from '../core/element.js';

class MultiSelect extends Element {
    static styleKeys = ['root', 'label', 'subText', 'optionsContainer', 'option', 'checkbox', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
            borderRadius: '5px',
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
        optionsContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        option: {
            marginBottom: '5px'
        },
        checkbox: {
            marginRight: '5px'
        },
        errorMessage: {}
    };

    constructor({ id, text, subText = '', options, required = true, randomize = false, minSelected = 0, maxSelected = null, styles = {} }) {
        super({ id, type: 'multi-select', store_data: true, required });
        this.text = text;
        this.subText = subText;
        this.options = options;
        this.randomize = randomize;
        this.minSelected = minSelected;
        this.maxSelected = maxSelected;
        this.styles = this.mergeStyles(MultiSelect.defaultStyles, styles);
        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);
        this.addData('randomize', randomize);
        this.addData('minSelected', minSelected);
        this.addData('maxSelected', maxSelected);
        this.setResponse([]);
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            label: '.question-label',
            subText: '.question-subtext',
            optionsContainer: '.options-container',
            option: '.option',
            checkbox: 'input[type="checkbox"]',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => `
            <div class="option">
                <input type="checkbox" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `).join('');

        const styleString = this.generateStylesheet();

        return `
            <style>${styleString}</style>
            <div class="multi-select-question" id="${this.id}-container">
                <label class="question-label">${this.text}</label>
                ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                <div class="options-container">
                    ${optionsString}
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
        container.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updateResponse();
            }
        });
    }

    updateResponse() {
        const container = document.getElementById(`${this.id}-container`);
        const checkedBoxes = container.querySelectorAll(`input[name="${this.id}"]:checked`);
        const selectedOptions = Array.from(checkedBoxes).map(cb => cb.value);
        this.setResponse(selectedOptions);
    }

    setResponse(value) {
        super.setResponse(value, value.length > 0);
        this.showValidationError('');
    }

    validate(showError = false) {
        const selectedCount = this.data.response ? this.data.response.length : 0;
        let isValid = true;
        let errorMessage = '';

        if (this.required && selectedCount === 0) {
            isValid = false;
            errorMessage = 'Please select at least one option.';
        } else if (this.minSelected > 0 && selectedCount < this.minSelected) {
            isValid = false;
            errorMessage = `Please select at least ${this.minSelected} option(s).`;
        } else if (this.maxSelected !== null && selectedCount > this.maxSelected) {
            isValid = false;
            errorMessage = `Please select no more than ${this.maxSelected} option(s).`;
        }

        if (showError) {
            this.showValidationError(errorMessage);
        }

        return isValid;
    }
}

export default MultiSelect;