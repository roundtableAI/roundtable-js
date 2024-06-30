class Element {
    constructor(id, type, text) {
        this.id = id;
        this.type = type;
        this.text = text;
    }

    replacePlaceholders(text, data) {
        return text.replace(/{{(.*?)}}/g, (match, p1) => {
            return data[p1] || match;
        });
    }

    render(data, isHtml = false) {
        const renderedText = this.replacePlaceholders(this.text, data);
        if (isHtml) {
            return this.text;
        }
        return `<div class="question ${this.type}">
                    <p>${renderedText}</p>
                </div>`;
    }

    clone() {
        return new Element(this.id, this.type, this.text);
    }
}

export default Element;
