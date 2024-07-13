class Element {
    static dataStructure = {
        id: null,
        type: null,
        response: null,
        responseTimestamp: null
    };

    static styleKeys = []; // To be overridden by subclasses

    constructor({ id, type, store_data = false, required = false }) {
        this.id = id;
        this.type = type;
        this.store_data = store_data;
        this.required = required;
        this.data = { id, type, response: null, responded: false };
    }

    validate() {
        if (this.required && !this.data.response) {
            this.showValidationError('This question is required. Please provide an answer.');
            return false;
        }
        this.showValidationError(null);
        return true;
    }

    showValidationError(message) {
        const errorElement = document.getElementById(`${this.id}-error`);
        if (errorElement) {
            errorElement.textContent = message || '';
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    mergeStyles(defaultStyles, customStyles) {
        return this.constructor.styleKeys.reduce((merged, key) => {
            merged[key] = { ...defaultStyles[key], ...customStyles[key] };
            return merged;
        }, {});
    }

    generateStylesheet() {
        return this.constructor.styleKeys.map(key => 
            this.generateStyleForSelector(this.getSelectorForKey(key), this.styles[key])
        ).join('\n');
    }

    getSelectorForKey(key) {
        // This method should be overridden by subclasses
        return '';
    }

    generateStyleForSelector(selector, rules) {
        const fullSelector = selector ? `#${this.id}-container ${selector}` : `#${this.id}-container`;
        const baseStyles = this.rulesToString(rules);
        let styleString = `${fullSelector} { ${baseStyles} }`;

        Object.entries(rules)
            .filter(([key, value]) => typeof value === 'object')
            .forEach(([key, value]) => {
                if (key.startsWith('@media')) {
                    styleString += `\n${key} { ${fullSelector} { ${this.rulesToString(value)} } }`;
                } else if (key.startsWith('&')) {
                    styleString += `\n${fullSelector}${key.slice(1)} { ${this.rulesToString(value)} }`;
                }
            });

        return styleString;
    }

    rulesToString(rules) {
        return Object.entries(rules)
            .filter(([key, value]) => typeof value !== 'object')
            .map(([key, value]) => `${this.camelToKebab(key)}: ${value};`)
            .join(' ');
    }

    camelToKebab(string) {
        return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    render() {
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            const elementContainer = document.createElement('div');
            elementContainer.innerHTML = this.generateHTML();
            questionContainer.appendChild(elementContainer);
            this.attachEventListeners();
        }
    }

    generateHTML() {
        throw new Error('generateHTML method must be implemented by subclasses');
    }

    attachEventListeners() {
        // This method is overridden by subclasses if they need to attach event listeners
    }

    collectData() {
        return this.store_data ? { ...this.data } : null;
    }

    setResponse(response, responded = false) {
        if (this.store_data) {
            this.data.response = response;
            this.data.responseTimestamp = new Date().toISOString();
            this.data.responded = Boolean(responded);
        }
        this.showValidationError(null);
    }

    setResponded() {
        if (this.store_data) {
            this.data.responded = true;
        }
    }

    addData(key, value) {
        if (this.store_data) {
            this.data[key] = value;
        }
    }

    isValid() {
        return this.validate();
    }

    static extendDataStructure(extension) {
        return { ...Element.dataStructure, ...extension };
    }
}

export default Element;