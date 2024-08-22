import Element from '../core/element.js';

class DropdownSelect extends Element {
    static styleKeys = [...Element.styleKeys, 'select', 'option'];

    static selectorMap = {
        ...Element.selectorMap,
        select: 'select',
        option: 'option'
    };

    static defaultStyles = {
        select: {
            width: '100%',
            cursor: 'pointer',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1em',
            marginBottom: '0px',
            display: 'block',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23333\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '12px',
            '&:focus': {
                borderColor: 'black',
                outline: 'none',
            },
        },
        option: {
            padding: '8px',
        }
    };

    constructor({
        id,
        text,
        subText = '',
        options,
        required = true,
        placeholder = 'Select an option',
        customValidation = null,
        styles = {},
    }) {
        super({ id, type: 'dropdown-select', store_data: true, required, customValidation, styles });

        if (!Array.isArray(options) || options.length === 0) {
            throw new Error('Options must be a non-empty array');
        }

        this.text = text;
        this.subText = subText;
        this.options = options;
        this.placeholder = placeholder;

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('options', options);

        this.initialResponse = '';
        this.elementStyleKeys = [...DropdownSelect.styleKeys];
        this.selectorMap = { ...DropdownSelect.selectorMap };
    }

    generateHTML() {
        const optionsHTML = this.options.map(option => 
            `<option value="${option}">${option}</option>`
        ).join('');

        return `
            <div class="dropdown-select-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text" for="${this.id}">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <select id="${this.id}" name="${this.id}" ${this.required ? 'required' : ''}>
                        <option value="" disabled selected>${this.placeholder}</option>
                        ${optionsHTML}
                    </select>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    attachEventListeners() {
        const select = document.getElementById(this.id);
        this.addEventListenerWithTracking(select, 'change', this.handleChange.bind(this));
    }

    handleChange(e) {
        const value = e.target.value;
        this.setResponse(value);
    }

    validate() {
        const value = this.data.response;

        if (!value && this.required) {
            return { isValid: false, errorMessage: 'Please select an option.' };
        }

        if (value && !this.options.includes(value)) {
            return { isValid: false, errorMessage: 'Selected option is not valid.' };
        }

        return super.validate();
    }
}

export default DropdownSelect;