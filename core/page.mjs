class Page {
    constructor(id, conditionFunction = () => true) {
        this.id = id;
        this.elements = [];
        this.conditionFunction = conditionFunction;  // Function to determine if the page should be shown
    }

    addElement(element) {
        this.elements.push(element);
    }

    // Render the page if conditionFunction returns true based on provided data
    render(data) {
        if (this.conditionFunction(data)) {
            return this.elements.map(element => {
                if (typeof element === 'string' || element instanceof HTMLElement) {
                    return element.outerHTML || element; // Render HTML elements or strings directly
                } else {
                    return element.render(data); // Render questions or other renderable elements
                }
            }).join('\n');
        }
        return ''; // Return an empty string if the condition is not met
    }

    getData() {
        return this.elements.map(element => element.getData());
    }

    addData(data) {
        this.elements.forEach(element => element.addData(data));
    }

    validate(responses) {
        if (!this.conditionFunction(responses)) {
            return true; // Automatically validate the page if it's not displayed
        }
        return this.elements.every(element => {
            if (element instanceof Question) {
                return element.validate(responses[element.id]);
            }
            // Assume HTML snippets or JavaScript blocks do not need validation
            return true; // Default to true if not a question
        });
    }
}

export default Page;
