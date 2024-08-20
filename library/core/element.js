class Element {
    static dataStructure = {
        id: null,
        type: null,
        response: null,
        responseTimestamp: null
    };

    static styleKeys = ['root', 'innerContainer', 'label', 'subText', 'errorMessage'];

    static selectorMap = {
        root: '',
        innerContainer: '.inner-container',
        label: '.question-label',
        subText: '.question-subtext',
        errorMessage: '.error-message'
    };

    constructor({ id, type, store_data = false, required = false, customValidation = null, styles = {} }) {
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
        this.styles = styles;
        this.eventListeners = [];
        this.elementStyleKeys = [...this.constructor.styleKeys];
        this.selectorMap = { ...this.constructor.selectorMap };
        this.customValidation = customValidation;
    }

    mergeStyles(surveyElementStyles, elementStyles) {
        const mergedStyles = {};
        this.elementStyleKeys.forEach(key => {
            mergedStyles[key] = {
                ...(surveyElementStyles[key] || {}),
                ...(this.constructor.defaultStyles?.[key] || {}),
                ...(this.styles[key] || {}),
                ...(elementStyles[key] || {})
            };
        });
        return mergedStyles;
    }

    generateStylesheet(surveyElementStyles) {
        const mergedStyles = this.mergeStyles(surveyElementStyles, this.styles);
        return this.elementStyleKeys.map(key =>  {
            return this.generateStyleForSelector(this.getSelectorForKey(key), mergedStyles[key])
        }
        ).join('\n');
    }

    getSelectorForKey(key) {
        return '';
    }

    generateStyleForSelector(selector, rules) {
        if (!rules || typeof rules !== 'object') {
            console.warn(`Invalid rules for selector ${selector}`);
            return '';
        }

        const baseSelector = `#${this.id}-container`;
        const fullSelector = selector ? `${baseSelector} ${selector}` : baseSelector;
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

    render(surveyElementStyles) {
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            const elementHtml = this.generateHTML();
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = elementHtml;
            
            const elementContainer = tempContainer.firstElementChild;
            
            // Apply styles
            const styleElement = document.createElement('style');
            styleElement.textContent = this.generateStylesheet(surveyElementStyles);
            elementContainer.prepend(styleElement);
    
            questionContainer.appendChild(elementContainer);
            this.attachEventListeners();
            
            // Set the initial response after rendering
            this.data.response = this.initialResponse;
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

    addData(key, value) {
        if (this.store_data) {
            this.data[key] = value;
        }
    }

    validate() {
        let isValid = true;
        let errorMessage = '';

        // Check if the question is required and answered
        if (this.required && !this.data.responded) {
            isValid = false;
            errorMessage = 'Please provide a response.';
        }

        // If basic validation passed and custom validation is provided, run it
        if (isValid && typeof this.customValidation === 'function') {
            const customValidationResult = this.customValidation(this.data.response);
            if (customValidationResult !== true) {
                isValid = false;
                errorMessage = customValidationResult || 'Invalid input.';
            }
        }

        return { isValid, errorMessage };
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

    destroy() {
        // Remove all event listeners if they exist
        if (this.eventListeners) {
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