import Element from '../core/element.mjs';

class Grid extends Element {
    constructor(id, text, rows, columns) {
        super(id, 'grid', text);
        this.rows = rows;
        this.columns = columns;
    }

    render(data) {
        const rows = typeof this.rows === 'function' ? this.rows(data) : this.rows;
        const columns = this.columns;
        const renderedText = this.replacePlaceholders(this.text, data);

        if (!Array.isArray(rows)) {
            console.error('Rows is not an array:', rows);
            return `<div class="error">Error rendering grid: Rows is not an array</div>`;
        }

        return `
            <div class="question grid" id="${this.id}">
                <p>${renderedText}</p>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            ${columns.map(column => `<th>${this.replacePlaceholders(column, data)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${this.replacePlaceholders(row, data)}</td>
                                ${columns.map((column, colIndex) => `
                                    <td>
                                        <input type="radio" name="${row}" value="${column}">
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getData() {
        const data = [];
        const rows = typeof this.rows === 'function' ? this.rows({}) : this.rows;
        rows.forEach(row => {
            const selectedInput = document.querySelector(`input[name="${row}"]:checked`);
            if (selectedInput) {
                data.push({ row, column: selectedInput.value });
            }
        });
        return data;
    }

    addListener(data) {
        const rows = typeof this.rows === 'function' ? this.rows(data) : this.rows;
        rows.forEach(row => {
            const inputs = document.querySelectorAll(`input[name="${row}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    data[this.id] = this.getData();
                });
            });
        });
    }

    clone() {
        return new Grid(this.id, this.text, this.rows, this.columns);
    }
}

export default Grid;
