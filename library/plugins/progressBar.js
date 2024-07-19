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
            backgroundColor: '#4CAF50',
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
        styles = {}
    }) {
        super({ styles });
        
        if (typeof maxPages !== 'number' || maxPages <= 0) {
            throw new Error('maxPages must be a positive number');
        }

        this.currentPage = currentPage;
        this.maxPages = maxPages;
        this.includeProgressText = Boolean(includeProgressText);
        this.includeProgressBar = Boolean(includeProgressBar);
        this.progressAsPercentage = Boolean(progressAsPercentage);
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '#survey-progress',
            container: '#survey-progress-container',
            bar: '#survey-progress-bar',
            text: '#survey-progress-text'
        };
        return selectorMap[key] || '';
    }

    initialize(survey) {
        super.initialize(survey);

        const surveyContainer = document.getElementById('survey-container');
        if (!surveyContainer) {
            throw new Error('Survey container not found');
        }

        const stylesheet = this.generateStylesheet();
        surveyContainer.insertAdjacentHTML('afterbegin', `
            <style>${stylesheet}</style>
            <div id="survey-progress">
                ${this.includeProgressBar ? '<div id="survey-progress-container"><div id="survey-progress-bar"></div></div>' : ''}
                ${this.includeProgressText ? '<div id="survey-progress-text"></div>' : ''}
            </div>
        `);
        this.updateProgress();
    }

    beforePageRender() {
        this.currentPage++;
        this.updateProgress();
    }

    updateProgress() {
        this.updateProgressBar();
        this.updateProgressText();
    }

    updateProgressBar() {
        if (!this.includeProgressBar) return;

        const progressBar = document.getElementById('survey-progress-bar');
        if (progressBar) {
            const progressPercentage = (this.currentPage / this.maxPages) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        } else {
            console.warn('Progress bar element not found');
        }
    }

    generateProgressText() {
        if (this.progressAsPercentage){
            const percentage = Math.min(Math.round((this.currentPage / this.maxPages) * 100), 100);
            return `${percentage}%`;
        } else {
            const currentPage = Math.min(this.currentPage, this.maxPages + 1);
            return `Page ${currentPage} of ${this.maxPages}`
        }
    }

    updateProgressText() {
        if (!this.includeProgressText) return;

        const progressText = document.getElementById('survey-progress-text');
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

    removeProgressBar() {
        const progressBar = document.getElementById('survey-progress');
        if (progressBar) {
            progressBar.remove();
        } else {
            console.warn('Progress bar not found for removal');
        }
    }

    destroy() {
        this.removeProgressBar();
        super.destroy();
    }
}

export default ProgressBar;