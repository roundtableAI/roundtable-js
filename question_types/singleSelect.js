import Element from '../core/element.js';

class SingleSelect extends Element {
    static styleKeys = ['root', 'label', 'subText', 'optionsContainer', 'option', 'radio', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
            borderRadius: '5px'
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
        radio: {
            marginRight: '5px'
        },
        errorMessage: {}
    };

    constructor({ id, text, subText = '', options, required = true, randomize = false, styles = {} }) {
        super({ id, type: 'single-select', store_data: true, required });
        this.text = text;
        this.subText = subText;
        this.options = options;
        this.randomize = randomize;
        this.styles = this.mergeStyles(SingleSelect.defaultStyles, styles);
        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);
        this.addData('randomize', randomize);
        this.setResponse('');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            label: '.question-label',
            subText: '.question-subtext',
            optionsContainer: '.options-container',
            option: '.option',
            radio: 'input[type="radio"]',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        let optionsHTML = this.randomize ? this.shuffleArray([...this.options]) : this.options;

        const optionsString = optionsHTML.map((option, index) => `
            <div class="option">
                <input type="radio" id="${this.id}-${index}" name="${this.id}" value="${option}">
                <label for="${this.id}-${index}">${option}</label>
            </div>
        `).join('');

        const styleString = this.generateStylesheet();

        return `
            <style>${styleString}</style>
            <div class="single-select-question" id="${this.id}-container">
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
            if (e.target.type === 'radio') {
                this.setResponse(e.target.value);
            }
        });
    }

    setResponse(value) {
        super.setResponse(value, true);
        this.showValidationError('');
    }

    validate(showError = false) {
        const isValid = !this.required || !!this.data.response;
        if (showError && !isValid) {
            this.showValidationError('Please select an option.');
        }
        return isValid;
    }
}

export default SingleSelect;