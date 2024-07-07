import Element from '../core/element.mjs';

class OpenEnded extends Element {
    constructor(id, text, maxLength, isDynamic = false) {
        super(id, 'openEnded', text);
        this.maxLength = maxLength;
        this.isDynamic = isDynamic;
    }

    render(data) {
        const renderedText = this.isDynamic ? this.replacePlaceholders(this.text, data) : this.text;
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

    addListener(data) {
        const textarea = document.getElementById(this.id);
        textarea.addEventListener('input', () => {
            data[this.id] = this.getData();
        });
    }

    clone() {
        return new OpenEnded(this.id, this.text, this.maxLength, this.isDynamic);
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
    }
}

export default OpenEnded;
