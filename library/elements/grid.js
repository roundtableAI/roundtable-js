import Element from '../core/element.js';

class Grid extends Element {
    static styleKeys = [...Element.styleKeys, 'table', 'headerRow', 'headerCell', 'rowWrapper', 'row', 'rowLabel', 'cell', 'radio'];

    static selectorMap = {
        ...Element.selectorMap,
        table: 'table',
        headerRow: 'thead tr',
        headerCell: 'thead th',
        rowWrapper: '.row-wrapper',
        row: 'tbody tr',
        rowLabel: 'tbody td.row-label',
        cell: 'tbody td',
        radio: 'input[type="radio"]'
    };

    static defaultStyles = {
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
            lineHeight: '1',
            '@media (max-width: 650px)': {
                fontSize: '0.9em'
            }
        },
        headerRow: {},
        headerCell: {
            padding: '0px 16px',
            textAlign: 'center',
            fontWeight: 'normal',
            '@media (max-width: 650px)': {
                padding: '0px 12px'
            }
        },
        row: {
            backgroundColor: '#f0f0f0',
            borderRadius: '12px',
        },
        rowLabel: {
            padding: '12px 16px',
            textAlign: 'left',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            '@media (max-width: 650px)': {
                padding: '12px'
            }
        },
        cell: {
            textAlign: 'center',
            verticalAlign: 'middle',
        },
        radio: {
            appearance: 'none',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1px solid black',
            border: '1px solid #767676',
            outline: 'none',
            margin: '0 auto',
            background: 'white',
            cursor: 'pointer',
            verticalAlign: 'middle',
            '&:checked': {
                backgroundColor: 'black',
                boxShadow: 'inset 0 0 0 3px #ffffff'
            },
            '@media (max-width: 650px)': {
                width: '16px',
                height: '16px'
            }
        }
    };


    constructor({
        id,
        text,
        subText = '',
        rows,
        columns,
        required = true,
        randomizeRows = false,
        randomizeColumns = false,
        customValidation = null,
        styles = {}
    }) {
        super({ id, type: 'grid', store_data: true, required, customValidation, styles });

        if (!Array.isArray(rows) || rows.length === 0 || !Array.isArray(columns) || columns.length === 0) {
            throw new Error('Rows and columns must be non-empty arrays');
        }

        this.text = text;
        this.subText = subText;
        this.rows = rows;
        this.columns = columns;
        this.randomizeRows = Boolean(randomizeRows);
        this.randomizeColumns = Boolean(randomizeColumns);

        this.addData('text', text);
        this.addData('subText', subText);
        this.addData('rows', rows);
        this.addData('columns', columns);
        this.addData('randomizeRows', this.randomizeRows);
        this.addData('randomizeColumns', this.randomizeColumns);

        this.initialResponse = {};

        this.elementStyleKeys = [...Grid.styleKeys];
        this.selectorMap = { ...Grid.selectorMap };
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

        return `
            <div class="grid-question" id="${this.id}-container">
                <div class="inner-container">
                    <div class="text-container">
                        <label class="question-text">${this.text}</label>
                        ${this.subText ? `<span class="question-subtext">${this.subText}</span>` : ''}
                    </div>
                    <table>
                        <thead>${headerRow}</thead>
                        <tbody>${bodyRows}</tbody>
                    </table>
                </div>
                <div id="${this.id}-error" class="error-message" style="display: none;"></div>
            </div>
        `;
    }

    generateStylesheet(surveyElementStyles) {
        const stylesheet = super.generateStylesheet(surveyElementStyles);
        
        // Add styles for the last cell in each row
        const lastCellStyles = this.generateStyleForSelector(`${this.getSelectorForKey('cell')}:last-child`, {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
        });

        return stylesheet + '\n' + lastCellStyles;
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    attachEventListeners() {
        const container = document.getElementById(`${this.id}-container`);
        this.addEventListenerWithTracking(container, 'change', this.handleChange.bind(this));
    }

    handleChange(e) {
        if (e.target.type === 'radio') {
            this.updateResponse();
        }
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
        super.setResponse(value);
        this.showValidationError(null);
    }

    validate() {
        // Grid-specific validation
        const unansweredRows = this.rows.filter(row => !this.data.response[row]);

        if (unansweredRows.length > 0) {
            return {
                isValid: false,
                errorMessage: `Please provide a response for all rows. Missing: ${unansweredRows.join(', ')}`
            };
        }

        // If Grid-specific validation passed, call parent's validate method
        return super.validate();
    }
}

export default Grid;