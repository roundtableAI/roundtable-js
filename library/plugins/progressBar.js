import Plugin from '../core/plugin.js';

class ProgressBar extends Plugin {
    static styleKeys = ['root', 'container', 'bar', 'text'];

    static defaultStyles = {
        root: {
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
        },
        container: {
            flex: '1',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            overflow: 'hidden',
            height: '18px',
        },
        bar: {
            width: '0',
            height: '100%',
            backgroundColor: '#333',
            transition: 'width 0.3s ease-in-out',
        },
        text: {
            textAlign: 'right',
            padding: '5px 0',
            fontSize: '14px',
        }
    };

    constructor({
        maxPages,
        currentPage = -1,
        includeProgressText = true,
        includeProgressBar = true,
        progressAsPercentage = true,
        targetId = 'survey-container',
        position = 'top',
        styles = {}
    }) {
        super({ targetId, position, styles: ProgressBar.mergeStyles(ProgressBar.defaultStyles, styles) });
        
        if (typeof maxPages !== 'number' || maxPages <= 0) {
            throw new Error('maxPages must be a positive number');
        }

        this.currentPage = currentPage;
        this.maxPages = maxPages;
        this.includeProgressText = Boolean(includeProgressText);
        this.includeProgressBar = Boolean(includeProgressBar);
        this.progressAsPercentage = Boolean(progressAsPercentage);
    }

    static mergeStyles(defaultStyles, customStyles) {
        const mergedStyles = { ...defaultStyles };
        for (const key in customStyles) {
            if (mergedStyles.hasOwnProperty(key)) {
                mergedStyles[key] = { ...mergedStyles[key], ...customStyles[key] };
            }
        }
        return mergedStyles;
    }

    generateContent() {
        return `
            <div id="${this.pluginId}-progress">
                ${this.includeProgressBar ? `<div id="${this.pluginId}-progress-container"><div id="${this.pluginId}-progress-bar"></div></div>` : ''}
                ${this.includeProgressText ? `<div id="${this.pluginId}-progress-text"></div>` : ''}
            </div>
        `;
    }

    initialize(survey) {
        super.initialize(survey);
        this.applyStyles();
        this.updateProgress();
    }

    applyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = this.generateStylesheet();
        document.head.appendChild(styleElement);
    }

    generateStylesheet() {
        return ProgressBar.styleKeys.map(key => 
            this.generateStyleForSelector(this.getSelectorForKey(key), this.styles[key])
        ).join('\n');
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: `#${this.pluginId}-progress`,
            container: `#${this.pluginId}-progress-container`,
            bar: `#${this.pluginId}-progress-bar`,
            text: `#${this.pluginId}-progress-text`
        };
        return selectorMap[key] || '';
    }

    generateStyleForSelector(selector, rules) {
        if (!rules || typeof rules !== 'object') return '';
        const styleString = Object.entries(rules)
            .map(([key, value]) => `${this.camelToKebab(key)}: ${value};`)
            .join(' ');
        return `${selector} { ${styleString} }`;
    }

    camelToKebab(string) {
        return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    beforePageRender() {
        this.currentPage++;
        this.updateProgress();
    }

    updateProgress() {
        this.updateProgressBar();
        this.updateProgressText();
    }

    afterPageRender() {
        // This method is intentionally left empty
    }

    updateProgressBar() {
        if (!this.includeProgressBar) return;

        const progressBar = document.getElementById(`${this.pluginId}-progress-bar`);
        if (progressBar) {
            const progressPercentage = (this.currentPage / this.maxPages) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        } else {
            console.warn('Progress bar element not found');
        }
    }

    generateProgressText() {
        if (this.progressAsPercentage) {
            const percentage = Math.min(Math.round((this.currentPage / this.maxPages) * 100), 100);
            return `${percentage}%`;
        } else {
            const currentPage = Math.min(this.currentPage, this.maxPages + 1);
            return `Page ${currentPage} of ${this.maxPages}`;
        }
    }

    updateProgressText() {
        if (!this.includeProgressText) return;

        const progressText = document.getElementById(`${this.pluginId}-progress-text`);
        if (progressText) {
            const text = this.generateProgressText();
            progressText.textContent = text;
        } else {
            console.warn('Progress text element not found');
        }
    }

    beforeSurveyFinish() {
        this.currentPage = this.maxPages;
        this.updateProgress();
    }

    destroy() {
        const progressBar = document.getElementById(`${this.pluginId}-progress`);
        if (progressBar) {
            progressBar.remove();
        }
        super.destroy();
    }
}

export default ProgressBar;