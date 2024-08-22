import Plugin from '../core/plugin.js';

class PageHTML extends Plugin {
    constructor({ content, targetId = 'survey-container', position = 'top', styles = {} }) {
        super({ targetId, position, styles });
        
        if (typeof content !== 'string' || content.trim() === '') {
            throw new Error('Content must be a non-empty string');
        }
        
        this.content = content;
    }

    generateContent() {
        return this.content;
    }

    initialize(survey) {
        super.initialize(survey);
    }

    beforePageRender() {
        // This method is intentionally left empty
    }

    beforeSurveyFinish() {
        // This method is intentionally left empty
    }

    afterPageRender() {
        // This method is intentionally left empty
    }

    updateContent(newContent) {
        if (typeof newContent !== 'string' || newContent.trim() === '') {
            throw new Error('New content must be a non-empty string');
        }
        this.content = newContent;
        const pluginElement = document.getElementById(this.pluginId);
        if (pluginElement) {
            pluginElement.innerHTML = newContent;
        }
    }
}

export default PageHTML;