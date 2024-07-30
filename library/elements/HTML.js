import Element from '../core/element.js';

class HTML extends Element {
    static styleKeys = ['root']

    static defaultStyles = {
        root: {
            background: 'white',
        }
    };

    constructor({ id, content, styles = {} }) {
        super({ id, type: 'html', store_data: false, required: false });

        if (typeof content !== 'string' || content.trim() === '') {
            throw new Error('Content must be a non-empty string');
        }

        this.content = content;
        this.mergeStyles(HTML.defaultStyles, styles);
        this.rendered = false;
    }

    getSelectorForKey(key) {
        return key === 'root' ? '' : key;
    }

    generateHTML() {
        return `
            <div class="html-content" id="${this.id}-container">
                ${this.content}
            </div>
        `;
    }

    render() {
        if (this.rendered) {
            // If already rendered, update the content instead of recreating
            const container = document.getElementById(`${this.id}-container`);
            if (container) {
                container.innerHTML = this.content;
                return;
            }
        }

        // If not rendered or container not found, render as usual
        super.render();
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
        // HTML elements are always valid
        return true;
    }
}

export default HTML;