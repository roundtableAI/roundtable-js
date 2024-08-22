class Survey {
    static styleKeys = ['body', 'container', 'navigation', 'button', 'errorMessage', 'nextButtonError', 'finishMessage'];

    static defaultStyles = {
        body: {
            fontFamily: 'Helvetica, Arial, sans-serif',
            lineHeight: '1.4',
            color: 'black',
            backgroundColor: '#f7f7f7',
            padding: '25px',
            '@media (max-width: 650px)': {
                background: 'white',
                padding: '0px',
            },
        },
        container: {
            width: '100%',
            maxWidth: '680px',
            boxSizing: 'border-box',
            margin: '0 auto',
            padding: '25px',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            '@media (max-width: 650px)': {
                boxShadow: 'none',
                padding: '20px',
            },
        },
        navigation: {
            marginTop: '45px',
        },
        button: {
            backgroundColor: '#333',
            maxWidth: '100%',
            color: '#ffffff',
            padding: '12px 34px',
            border: 'none',
            fontSize: '1em',
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#444',
            }
        },
        errorMessage: {
            color: '#fa5252',
            marginTop: '5px',
            fontSize: '0.9em',
        },
        nextButtonError: {
            color: '#fa5252',
            marginLeft: '10px',
            display: 'inline-block',
            fontSize: '0.9em',
        },
        finishMessage: {
            display: 'none',
            fontSize: '1.1em',
            textAlign: 'center',
        },
    };

    static defaultElementStyles = {
        root: { 
            marginBottom: '40px',
        },
        innerContainer: {
            marginTop: '5px',
        },
        textContainer: {
            marginBottom: '10px',
        },
        text: { 
            display: 'block',
        },
        subText: {
            display: 'block',
            color: '#888',
            fontSize: '1em',
        },
        errorMessage: {
            color: '#fa5252',
            fontSize: '0.9em',
            marginTop: '5px'
        }
    };

    constructor(customSurveyDetails = {}) {
        this.responses = [];
        this.currentPage = null;
        this.nextButtonListener = null;
        this.plugins = [];
        this.currentPageElements = [];

        this.surveyDetails = {
            startTime: new Date().toISOString(),
            ...customSurveyDetails
        };

        this.globalStyles = this.mergeStyles(Survey.defaultStyles, this.surveyDetails.styles || {});
        this.elementStyles = this.mergeStyles(Survey.defaultElementStyles, this.surveyDetails.styles?.Element || {});

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        try {
            this.validateStyles();
            this.applyGlobalStyles();
            this.revealContent();
        } catch (error) {
            console.error('Error during survey initialization:', error);
        }
    }

    mergeStyles(defaultStyles, customStyles) {
        const keys = Object.keys(defaultStyles);
        return Object.fromEntries(
            keys.map(key => [key, this.deepMerge(defaultStyles[key], customStyles[key])])
        );
    }

    deepMerge(target, source) {
        if (!source || typeof source !== 'object') return target;
        if (!target || typeof target !== 'object') return source;
    
        const merged = { ...target };
    
        Object.entries(source).forEach(([key, value]) => {
            if (key.startsWith('&') || key.startsWith('@media')) {
                if(target[key]){
                    Object.entries(target[key]).forEach(([k,v]) => {
                        if(k in source) target[key][k] = source[k];
                    })
                }
                merged[key] = this.deepMerge(target[key] || {}, value);
            } else {
                merged[key] = value;
                Object.entries(merged).forEach(([k, v]) => {
                    if (k.startsWith('&') || k.startsWith('@media')) {
                        merged[k] = {
                            ...v,
                            [key]: value,
                        };
                    }
                });
            }
        });
        return merged;
    }

    applyGlobalStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = this.generateStylesheet();
        document.head.appendChild(styleElement);
    }

    generateStylesheet() {
        return Survey.styleKeys.map(key =>
            this.generateStyleForSelector(this.getSelectorForKey(key), this.globalStyles[key])
        ).join('\n');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            body: 'body',
            container: '#survey-container',
            button: '#next-button',
            errorMessage: '.error-message',
            nextButtonError: '#next-button-error',
            navigation: '#navigation',
            finishMessage: '#finish',
        };
        return selectorMap[key] || '';
    }

    generateStyleForSelector(selector, rules) {
        if (!rules || typeof rules !== 'object') return '';

        const baseStyles = this.rulesToString(rules);
        let styleString = `${selector} { ${baseStyles} }`;

        Object.entries(rules)
            .filter(([key, value]) => typeof value === 'object')
            .forEach(([key, value]) => {
                if (key.startsWith('@media')) {
                    styleString += `\n${key} { ${selector} { ${this.rulesToString(value)} } }`;
                } else if (key.startsWith('&')) {
                    styleString += `\n${selector}${key.slice(1)} { ${this.rulesToString(value)} }`;
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

    validateStyles() {
        Object.keys(this.globalStyles).forEach(key => {
            if (!Survey.styleKeys.includes(key)) {
                console.warn(`Invalid style key '${key}' for Survey. Valid keys are: ${Survey.styleKeys.join(', ')}`);
            }
        });
    }

    revealContent() {
        const surveyContainer = document.getElementById('survey-container');
        if (surveyContainer) {
            surveyContainer.classList.remove('hidden');
        } else {
            console.warn('Survey container not found');
        }
    }

    addPlugin(plugin) {
        if (typeof plugin.initialize === 'function') {
            this.plugins.push(plugin);
            plugin.initialize(this);
        } else {
            console.warn('Invalid plugin: missing initialize method');
        }
    }

    removePlugin(plugin) {
        const index = this.plugins.indexOf(plugin);
        if (index > -1) {
            plugin.destroy();
            this.plugins.splice(index, 1);
            return true;
        }
        return false;
    }

    setSurveyDetail(key, value) {
        this.surveyDetails[key] = value;
    }

    getSurveyDetail(key) {
        return this.surveyDetails[key];
    }

    async showPage(page) {
        try {
            this.cleanupCurrentPage();

            this.currentPage = page;

            for (const plugin of this.plugins) {
                await plugin.beforePageRender(page);
            }

            const pageContainer = document.getElementById('page-container');
            if (!pageContainer) throw new Error('Page container not found');

            pageContainer.innerHTML = '';
            const questionContainer = document.createElement('div');
            questionContainer.id = 'question-container';
            pageContainer.appendChild(questionContainer);

            this.currentPageElements = [];
            for (const element of page.elements) {
                element.render(this.elementStyles);
                this.currentPageElements.push(element);
            }

            await this.setupNextButton();

            for (const plugin of this.plugins) {
                await plugin.afterPageRender(page);
            }
        } catch (error) {
            console.error('Error showing page:', error);
        }
    }

    cleanupCurrentPage() {
        if (this.currentPageElements && this.currentPageElements.length > 0) {
            for (const element of this.currentPageElements) {
                if (typeof element.destroy === 'function') {
                    element.destroy();
                } else {
                    console.warn(`Element ${element.id} does not have a destroy method`);
                }
            }
            this.currentPageElements = [];
        }

        const nextButton = document.getElementById('next-button');
        if (nextButton && this.nextButtonListener) {
            nextButton.removeEventListener('click', this.nextButtonListener);
            this.nextButtonListener = null;
        }
    }

    async setupNextButton() {
        const nextButton = document.getElementById('next-button');
        if (!nextButton) throw new Error('Next button not found');

        const nextButtonError = document.createElement('span');
        nextButtonError.id = 'next-button-error';
        nextButtonError.className = 'next-button-error';
        nextButtonError.style.display = 'none';
        nextButton.parentNode.insertBefore(nextButtonError, nextButton.nextSibling);

        if (this.nextButtonListener) {
            nextButton.removeEventListener('click', this.nextButtonListener);
        }

        return new Promise(resolve => {
            this.nextButtonListener = async () => {
                try {
                    if (await this.validateCurrentPage()) {
                        this.collectPageData(this.currentPage);
                        nextButtonError.style.display = 'none';
                        nextButtonError.textContent = '';
                        resolve();
                    } else {
                        nextButtonError.style.display = 'inline-block';
                        nextButtonError.textContent = 'Please check your answers.';
                    }
                } catch (error) {
                    console.error('Error in next button handler:', error);
                }
            };

            nextButton.addEventListener('click', this.nextButtonListener);
        });
    }

    async validateCurrentPage() {
        let isValid = true;
        for (const element of this.currentPage.elements) {
            if (typeof element.validate === 'function') {
                const { isValid: elementValid, errorMessage } = await element.validate();
                if (!elementValid) {
                    isValid = false;
                    element.showValidationError(errorMessage);
                } else {
                    element.showValidationError(null); // Clear any previous error
                }
            }
        }
        return isValid;
    }

    collectPageData(page) {
        page.elements.forEach(element => {
            const elementData = element.collectData();
            if (elementData !== null) {
                this.updateData(elementData);
            }
        });
    }

    updateData(elementData) {
        this.responses.push({
            ...elementData,
            responseTimestamp: new Date().toISOString()
        });
    }

    getResponse(questionId) {
        const responses = this.responses.filter(r => r.id === questionId);
        return responses.length > 0 ? responses[responses.length - 1].response : null;
    }

    responded(questionId) {
        const responses = this.responses.filter(r => r.id === questionId);
        return responses.length > 0 ? responses[responses.length - 1].responded : false;
    }

    getAllResponses() {
        return this.responses;
    }

    getAllSurveyData() {
        return {
            surveyDetails: this.surveyDetails,
            responses: this.responses
        };
    }

    finishSurvey(message) {
        try {
            this.cleanupCurrentPage();

            const navigation = document.getElementById('navigation');
            if (navigation) navigation.remove();

            for (const plugin of this.plugins) {
                plugin.beforeSurveyFinish();
            }

            const pageContainer = document.getElementById('page-container');
            if (pageContainer) {
                pageContainer.innerHTML = '';
            }

            const finishElement = document.getElementById('finish') || document.createElement('div');
            finishElement.id = 'finish';
            finishElement.innerHTML = message;
            finishElement.style.display = 'block';

            if (!document.getElementById('finish')) {
                const surveyContainer = document.getElementById('survey-container');
                if (surveyContainer) {
                    surveyContainer.appendChild(finishElement);
                } else {
                    console.error('Survey container not found');
                }
            }

            this.surveyDetails.endTime = new Date().toISOString();

        } catch (error) {
            console.error('Error finishing survey:', error);
        }
    }
}

export default Survey;