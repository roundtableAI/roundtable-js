class Survey {
    static styleKeys = ['body', 'container', 'question', 'button', 'errorMessage', 'nextButtonError'];

    static defaultStyles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4',
            color: '#333',
            backgroundColor: '#f7f7f7',
            padding: '25px',
            '@media (max-width: 650px)': {
                background: 'white',
                padding: '20px',
            },
        },
        container: {
            width: '100%',
            maxWidth: '700px',
            boxSizing: 'border-box',
            margin: '0 auto',
            padding: '25px',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            '@media (max-width: 650px)': {
                boxShadow: 'none',
                padding: '20px',
            },
        },
        question: {
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#333',
            maxWidth: '100%',
            color: '#ffffff',
            padding: '12px 34px',
            border: 'none',
            fontSize: '1em',
            borderRadius: '5px',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#444',
            }
        },
        errorMessage: {
            color: '#fa5252',
            fontWeight: '500',
            marginTop: '5px',
            fontSize: '0.9em',
        },
        nextButtonError: {
            color: '#fa5252',
            fontWeight: '500',
            marginLeft: '10px',
            display: 'inline-block',
            fontSize: '0.9em',
        }
    };

    constructor(customSurveyDetails = {}) {
        this.responses = [];
        this.currentPage = null;
        this.nextButtonListener = null;

        this.surveyDetails = {
            startTime: new Date().toISOString(),
            ...customSurveyDetails
        };

        this.globalStyles = this.mergeStyles(Survey.defaultStyles, this.surveyDetails.styles || {});

        // Check if the DOM is already loaded
        if (document.readyState === 'loading') {
            // If not, wait for it to load
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            // If it's already loaded, initialize immediately
            this.initialize();
        }
    }

    initialize() {
        this.validateStyles();
        this.applyGlobalStyles();
        this.revealContent();

        // Any other initialization code can go here
        // For example, loading the first page of the survey
        if (this.surveyDetails.pages && this.surveyDetails.pages.length > 0) {
            this.showPage(this.surveyDetails.pages[0]);
        }
    }

    applyGlobalStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = this.generateStylesheet();
        document.head.appendChild(styleElement);
    }

    revealContent() {
        const surveyContainer = document.getElementById('survey-container');
        if (surveyContainer) {
            surveyContainer.classList.remove('hidden');
        }
    }

    mergeStyles(defaultStyles, customStyles) {
        return Object.fromEntries(
            Survey.styleKeys.map(key => [key, this.deepMerge(defaultStyles[key], customStyles[key])])
        );
    }

    deepMerge(target, source) {
        if (!source || typeof source !== 'object') return target;
        if (!target || typeof target !== 'object') return source;

        return Object.entries(source).reduce((merged, [key, value]) => {
            merged[key] = (key.startsWith('&') || key.startsWith('@media'))
                ? this.deepMerge(target[key] || {}, value)
                : this.deepMerge(target[key], value);
            return merged;
        }, { ...target });
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
            question: '#question-container > div',
            button: '#next-button',
            errorMessage: '.error-message',
            nextButtonError: '#next-button-error'
        };
        return selectorMap[key] || '';
    }

    generateStyleForSelector(selector, rules) {
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

    setSurveyDetail(key, value) {
        this.surveyDetails[key] = value;
    }

    getSurveyDetail(key) {
        return this.surveyDetails[key];
    }

    async showPage(page) {
        this.currentPage = page;

        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = '';
            const questionContainer = document.createElement('div');
            questionContainer.id = 'question-container';
            pageContainer.appendChild(questionContainer);

            for (const element of page.elements) {
                await element.render(questionContainer);
            }
        }

        return new Promise(resolve => {
            const nextButton = document.getElementById('next-button');
            const nextButtonError = document.createElement('span');
            nextButtonError.id = 'next-button-error';
            nextButtonError.className = 'next-button-error';
            nextButtonError.style.display = 'none'; // Initially hide the error message
            nextButton.parentNode.insertBefore(nextButtonError, nextButton.nextSibling);

            if (this.nextButtonListener) {
                nextButton.removeEventListener('click', this.nextButtonListener);
            }

            this.nextButtonListener = async () => {
                if (await this.validateCurrentPage()) {
                    this.collectPageData(page);
                    nextButtonError.style.display = 'none';
                    nextButtonError.textContent = '';
                    resolve();
                } else {
                    nextButtonError.style.display = 'inline-block';
                    nextButtonError.textContent = 'Please check your answers.';
                    console.log("Validation failed. Please check your answers.");
                }
            };

            nextButton.addEventListener('click', this.nextButtonListener);
        });
    }

    async validateCurrentPage() {
        let isValid = true;
        for (const element of this.currentPage.elements) {
            if (typeof element.validate === 'function') {
                const elementValid = await element.validate(true);
                if (!elementValid) {
                    isValid = false;
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

    finishSurvey({ message }) {
        document.getElementById('navigation')?.remove();

        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = message;
        }

        this.surveyDetails.endTime = new Date().toISOString();

        console.log("Survey completed. Final data:", this.getAllSurveyData());
    }
}

export default Survey;