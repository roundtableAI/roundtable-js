import Element from '../core/element.mjs';

class MultipleSelect extends Element {
    constructor(id, text, options, htmlContent = '') {
        super(id, 'multipleSelect', text);
        this.optionGenerator = typeof options === 'function' ? options : () => options;
        this.htmlContent = htmlContent; // Property to store additional HTML content
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

    addListener(data) {
        const checkboxes = document.querySelectorAll(`input[name="${this.id}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                data[this.id] = this.getData();
            });
        });
    }

    clone() {
        return new MultipleSelect(this.id, this.text, this.optionGenerator, this.htmlContent);
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(.*?)\}\}/g, (match, key) => data[key] || '');
    }
}

export default MultipleSelect;
