import Element from '../core/element.mjs';

class Grid extends Element {
    constructor(id, text, rows, columns, isDynamic = false) {
        super(id, 'grid', text);
        this.rows = rows;
        this.columns = columns;
        this.isDynamic = isDynamic;
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
                                        <input type="radio" name="${this.id}_${row}" value="${column}">
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
        const data = {};
        document.querySelectorAll(`input[name^="${this.id}_"]:checked`).forEach(input => {
            const [prefix, ...rowParts] = input.name.split('_');
            const row = rowParts.join('_');  // Rejoin row parts to handle any underscores in the row name
            if (!data[prefix]) {
                data[prefix] = [];
            }
            data[prefix].push({ row, column: input.value });
        });
        return data[this.id];
    }
    

    clone() {
        return new Grid(this.id, this.text, this.rows, this.columns, this.isDynamic);
    }
}

export default Grid;
