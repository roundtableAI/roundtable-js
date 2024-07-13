import Element from '../core/element.js';

class Grid extends Element {
    static styleKeys = ['root', 'label', 'subText', 'table', 'headerRow', 'headerCell', 'row', 'rowLabel', 'cell', 'radio', 'errorMessage'];

    static defaultStyles = {
        root: { 
            marginBottom: '20px',
            borderRadius: '5px'
        },
        label: { 
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            fontSize: '1.1em',
        },
        subText: {
            display: 'block',
            marginBottom: '10px',
            color: '#6c757d',
            fontSize: '1.1em',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        headerRow: {
            backgroundColor: '#e9ecef'
        },
        headerCell: {
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
        },
        row: {
            borderBottom: '1px solid #dee2e6'
        },
        rowLabel: {
            padding: '10px',
            fontWeight: 'bold',
            textAlign: 'left'
        },
        cell: {
            padding: '10px',
            textAlign: 'center'
        },
        radio: {
            margin: '0 auto'
        },
        errorMessage: {}
    };

    constructor({ id, text, subText = '', rows, columns, required = true, randomizeRows = false, randomizeColumns = false, styles = {} }) {
        super({ id, type: 'grid', store_data: true, required });
        this.text = text;
        this.subText = subText;
        this.rows = rows;
        this.columns = columns;
        this.randomizeRows = randomizeRows;
        this.randomizeColumns = randomizeColumns;
        this.styles = this.mergeStyles(Grid.defaultStyles, styles);
        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('rows', rows);
        this.addData('columns', columns);
        this.addData('randomizeRows', randomizeRows);
        this.addData('randomizeColumns', randomizeColumns);
        this.setResponse({});
    }

    getSelectorForKey(key) {
        const selectorMap = {
            root: '',
            label: '.question-label',
            subText: '.question-subtext',
            table: 'table',
            headerRow: 'thead tr',
            headerCell: 'thead th',
            row: 'tbody tr',
            rowLabel: 'tbody td.row-label',
            cell: 'tbody td',
            radio: 'input[type="radio"]',
            errorMessage: '.error-message'
        };
        return selectorMap[key] || '';
    }

    generateHTML() {
        const rowsHTML = this.randomizeRows ? this.shuffleArray([...this.rows]) : this.rows;
        const columnsHTML = this.randomizeColumns ? this.shuffleArray([...this.columns]) : this.columns;

        const headerRow = `
            <tr>
                <th></th>
                ${columnsHTML.map(column => `<th>${column}</th>`).join('')}
            </tr>
        `;

        const bodyRows = rowsHTML.map((row, rowIndex) => `
            <tr>
                <td class="row-label">${row}</td>
                ${columnsHTML.map((column, colIndex) => `
                    <td>
                        <input type="radio" id="${this.id}-${rowIndex}-${colIndex}" 
                               name="${this.id}-${rowIndex}" value="${column}">
                    </td>
                `).join('')}
            </tr>
        `).join('');

        const styleString = this.generateStylesheet();

        return `
            <style>${styleString}</style>
            <div class="grid-question" id="${this.id}-container">
                <label class="question-label">${this.text}</label>
                ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                <table>
                    <thead>${headerRow}</thead>
                    <tbody>${bodyRows}</tbody>
                </table>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        container.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.updateResponse();
            }
        });
    }

    updateResponse() {
        const container = document.getElementById(`${this.id}-container`);
        const responses = Object.fromEntries(
            this.rows.map((row, index) => {
                const selectedRadio = container.querySelector(`input[name="${this.id}-${index}"]:checked`);
                return [row, selectedRadio ? selectedRadio.value : null];
            })
        );
        this.setResponse(responses);
    }

    setResponse(value) {
        const valueHasEntries = Object.values(value).some(val => val !== null);
        super.setResponse(value, valueHasEntries);
        this.showValidationError('');
    }

    validate(showError = false) {
        const unansweredRows = this.rows.filter(row => !this.data.response[row]);
        const isValid = !this.required || unansweredRows.length === 0;
        
        if (showError && !isValid) {
            this.showValidationError(`Please provide a response for all rows. Missing: ${unansweredRows.join(', ')}`);
        }

        return isValid;
    }
}

export default Grid;