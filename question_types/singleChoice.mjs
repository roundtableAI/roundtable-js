// singleChoice.js
import Element from '../core/element.mjs';

class SingleChoice extends Element {
    constructor(id, text, options, isDynamic = false, htmlContent = '') {
        super(id, 'singleChoice', text);
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
        this.htmlContent = htmlContent;
    }

    render(data) {
        const options = this.optionGenerator(data);
        const renderedText = this.replacePlaceholders(this.text, data);
        const renderedOptions = options.map(option => this.replacePlaceholders(option, data));
        return `
            <div class="question single-choice">
                ${this.htmlContent}
                <p>${renderedText}</p>
                ${renderedOptions.map(option => `
                    <label>
                        <input type="radio" name="${this.id}" value="${option}">
                        ${option}
                    </label>
                `).join('<br>')}
            </div>
        `;
    }

    getData() {
        const selectedOption = document.querySelector(`input[name="${this.id}"]:checked`);
        return selectedOption ? selectedOption.value : null;
    }

    clone() {
        return new SingleChoice(this.id, this.text, this.optionGenerator, typeof this.optionGenerator === 'function', this.htmlContent);
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
    }
}

export default SingleChoice;
