import Element from '../core/element.js';

class OpenEnded extends Element {
    constructor(id, text, maxLength) {
        super(id, 'openEnded', text);
        this.maxLength = maxLength;
    }

    render(data) {
        const renderedText = this.replacePlaceholders(this.text, data);
        return `
            <div class="question open-ended">
                <p>${renderedText}</p>
                <textarea id="${this.id}" rows="4" cols="50" maxlength="${this.maxLength}"></textarea>
            </div>
        `;
    }

    getData() {
        return document.getElementById(this.id).value;
    }

    clone() {
        return new OpenEnded(this.id, this.text, this.maxLength);
    }
}

export default OpenEnded;
