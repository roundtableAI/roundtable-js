class Plugin {
    static styleKeys = ['root']; // To be overridden by specific plugins

    static defaultStyles = {
        root: {}
    };

    constructor({ styles = {} } = {}) {
        if (new.target === Plugin) {
            throw new Error('Plugin is an abstract class and cannot be instantiated directly.');
        }
        this.styles = this.mergeStyles(this.constructor.defaultStyles, styles);
        this.survey = null;
    }

    mergeStyles(defaultStyles, customStyles) {
        return this.constructor.styleKeys.reduce((merged, key) => {
            merged[key] = { ...defaultStyles[key], ...customStyles[key] };
            return merged;
        }, {});
    }

    generateStylesheet() {
        return this.constructor.styleKeys.map(key => 
            this.generateStyleForSelector(this.getSelectorForKey(key), this.styles[key])
        ).join('\n');
    }

    getSelectorForKey(key) {
        // To be overridden by specific plugins
        return '';
    }

    generateStyleForSelector(selector, rules) {
        if (!rules || typeof rules !== 'object') {
            console.warn(`Invalid rules for selector ${selector}`);
            return '';
        }

        const baseStyles = this.rulesToString(rules);
        let styleString = `${selector} { ${baseStyles} }`;

        Object.entries(rules)
            .filter(([key, value]) => typeof value === 'object')
            .forEach(([key, value]) => {
                if (key.startsWith('@media')) {
                    styleString += `\n${key} { ${selector} { ${this.rulesToString(value)} } }`;
                } else if (key.startsWith('&')) {
                    styleString += `\n${selector}${key.slice(1)} { ${this.rulesToString(value)} }`;
                }
            });

        return styleString;
    }

    rulesToString(rules) {
        return Object.entries(rules)
            .filter(([key, value]) => typeof value !== 'object')
            .map(([key, value]) => `${this.camelToKebab(key)}: ${value};`)
            .join(' ');
    }

    camelToKebab(string) {
        return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    initialize(survey) {
        if (!survey) {
            throw new Error('A survey instance must be provided to initialize the plugin.');
        }
        this.survey = survey;
    }

    beforePageRender(page) {
        // To be implemented by specific plugins
    }

    afterPageRender(page) {
        // To be implemented by specific plugins
    }

    beforeSurveyFinish() {
        // To be implemented by specific plugins
    }

    destroy() {
        // To be implemented by specific plugins for cleanup
        this.survey = null;
    }
}

export default Plugin;