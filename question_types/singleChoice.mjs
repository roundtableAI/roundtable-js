import Element from '../core/element.mjs';

class SingleChoice extends Element {
    constructor(id, text, options, htmlContent = '') {
        super(id, 'singleChoice', text);
        this.optionGenerator = typeof options === 'function' ? options : () => options;
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

    addListener(data) {
        const inputs = document.querySelectorAll(`input[name="${this.id}"]`);
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                data[this.id] = this.getData();
            });
        });
    }

    clone() {
        return new SingleChoice(this.id, this.text, this.optionGenerator, this.htmlContent);
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
    }
}

export default SingleChoice;
