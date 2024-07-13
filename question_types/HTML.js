import Element from '../core/element.js';

class HTML extends Element {
    static styleKeys = ['root'];

    static defaultStyles = {
        root: {
            background: 'white',
        }
    };

    constructor({ id, content, styles = {} }) {
        super({ id, type: 'html', store_data: false });
        this.content = content;
        this.styles = this.mergeStyles(HTML.defaultStyles, styles);
    }

    getSelectorForKey(key) {
        return key === 'root' ? '' : key;
    }

    generateHTML() {
        const styleString = this.generateStylesheet();

        return `
            <style>${styleString}</style>
            <div class="html-content" id="${this.id}-container">
                ${this.content}
            </div>
        `;
    }

    validate() {
        return true;
    }
}

export default HTML;