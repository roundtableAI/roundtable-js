import Element from '../core/element.js';

class HTML extends Element {
    static styleKeys = [...Element.styleKeys];

    static selectorMap = {
        ...Element.selectorMap
    };

    static defaultStyles = { };

    constructor({ id, content, styles = {} }) {
        super({ id, type: 'html', store_data: false, required: false, styles });

        if (typeof content !== 'string' || content.trim() === '') {
            throw new Error('Content must be a non-empty string');
        }

        this.content = content;
        this.rendered = false;
        this.required = false;
        this.elementStyleKeys = [...HTML.styleKeys];
        this.selectorMap = { ...HTML.selectorMap };
    }

    getSelectorForKey(key) {
        return this.selectorMap[key] || '';
    }

    generateHTML() {
        return `
            <div class="html-content" id="${this.id}-container">
                ${this.content}
            </div>
        `;
    }

    render(surveyElementStyles) {
        if (this.rendered) {
            // If already rendered, update the content instead of recreating
            const container = document.getElementById(`${this.id}-container`);
            if (container) {
                container.innerHTML = this.content;
                return;
            }
        }

        // If not rendered or container not found, render as usual
        super.render(surveyElementStyles);
        this.rendered = true;
    }

    destroy() {
        // Only remove from DOM, don't clear all data
        const container = document.getElementById(`${this.id}-container`);
        if (container) {
            container.remove();
        }
        this.rendered = false;
    }

    attachEventListeners() {
        // No event listeners needed for HTML content
    }

    setResponse() {
        // HTML elements don't have a response to set
    }

    validate() {
        return {isValid: true, errorMessage: ''};
    }

    showValidationError() {
        // Do nothing, HTML elements don't show validation errors
    }
}

export default HTML;