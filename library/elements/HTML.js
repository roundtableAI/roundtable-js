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