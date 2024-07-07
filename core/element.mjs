class Element {
    constructor(id, type, text) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.data = {};  // Initialize data property
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

    getData() {
        return {
            metadata: {
                id: this.id,
                type: this.type,
                text: this.text
            },
            value: this.data[this.id] || null
        };
    }

    addData(data) {
        this.data = { ...this.data, ...data };
    }

    addListener(data) {
        // This should be overridden by subclasses if needed
    }

    clone() {
        return new Element(this.id, this.type, this.text);
    }
}

export default Element;
