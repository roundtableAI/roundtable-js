class Element {
    static dataStructure = {
        id: null,
        type: null,
        response: null,
        responseTimestamp: null
    };

    static defaultStyles = {};

    constructor({ id, type, store_data = false, required = false }) {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid id: must be a non-empty string');
        }
        if (!type || typeof type !== 'string') {
            throw new Error('Invalid type: must be a non-empty string');
        }
        this.id = id;
        this.type = type;
        this.store_data = Boolean(store_data);
        this.required = Boolean(required);
        this.data = { id, type, response: null, responded: false };
        this.initialResponse = null;
        this.styles = {};
        this.eventListeners = [];
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
        } else {
            console.warn(`Error element not found for ${this.id}`);
        }
    }

    mergeStyles(defaultStyles, customStyles) {
        this.styles = this.constructor.styleKeys.reduce((merged, key) => {
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
        if (!rules || typeof rules !== 'object') {
            console.warn(`Invalid rules for selector ${selector}`);
            return '';
        }

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

    setInitialResponse(value) {
        this.initialResponse = value;
    }

    render() {
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            const elementContainer = document.createElement('div');
            elementContainer.id = `${this.id}-container`;
            elementContainer.innerHTML = this.generateHTML();
            
            // Apply styles
            const styleElement = document.createElement('style');
            styleElement.textContent = this.generateStylesheet();
            elementContainer.prepend(styleElement);

            questionContainer.appendChild(elementContainer);
            this.attachEventListeners();
            
            // Set the initial response after rendering
            if (this.initialResponse !== null) {
                this.setResponse(this.initialResponse);
                this.initialResponse = null;
            }
        } else {
            console.error('Question container not found');
        }
    }

    generateHTML() {
        throw new Error('generateHTML method must be implemented by subclasses');
    }

    attachEventListeners() {
        // This method should be overridden by subclasses if they need to attach event listeners
    }

    addEventListenerWithTracking(element, eventType, handler) {
        const wrappedHandler = (event) => {
            handler(event);
        };
        element.addEventListener(eventType, wrappedHandler);
        this.eventListeners.push({ element, eventType, handler: wrappedHandler });
    }

    collectData() {
        return this.store_data ? { ...this.data } : null;
    }

    setResponse(value) {
        if (this.store_data) {
            this.data.response = value;
            this.data.responseTimestamp = new Date().toISOString();
            this.data.responded = true;
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

    destroy() {
        // Remove all event listeners if they exist
        if (this.eventListeners){
            this.eventListeners.forEach(({ element, eventType, handler }) => {
                element.removeEventListener(eventType, handler);
            });
            this.eventListeners = [];
        }

        // Remove the element from the DOM
        const container = document.getElementById(`${this.id}-container`);
        if (container) {
            container.remove();
        }

        // Clear any data
        this.data = null;

        // Remove any custom properties
        Object.keys(this).forEach(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        });
    }
}

export default Element;