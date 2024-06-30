import Element from '../core/element.js';

class MultipleChoice extends Element {
    constructor(id, text, options, isDynamic = false, htmlContent = '') {
        super(id, 'multipleChoice', text);
        if (isDynamic) {
            if (typeof options !== 'function') {
                console.error("Dynamic options must be provided as a function");
                this.optionGenerator = () => [];
            } else {
                this.optionGenerator = options;
            }
        } else {
            this.optionGenerator = () => options;
        }
        this.htmlContent = htmlContent; // New property to store additional HTML content
    }

    render(data) {
        const options = this.optionGenerator(data);
        const renderedText = this.replacePlaceholders(this.text, data);
        const renderedOptions = options.map(option => this.replacePlaceholders(option, data));
        
        return `
            <div class="question multiple-choice">
                ${this.htmlContent} <!-- Render additional HTML content -->
                <p>${renderedText}</p>
                ${renderedOptions.map(option => `
                    <label>
                        <input type="checkbox" name="${this.id}" value="${option}">
                        ${option}
                    </label>
                `).join('<br>')}
            </div>
        `;
    }

    getData() {
        return Array.from(document.querySelectorAll(`input[name="${this.id}"]:checked`)).map(input => input.value);
    }

    clone() {
        return new MultipleChoice(this.id, this.text, this.optionGenerator, typeof this.optionGenerator === 'function', this.htmlContent);
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
    }
}

export default MultipleChoice;
