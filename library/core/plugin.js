class Plugin {
    constructor({ targetId = 'survey-container', position = 'top', styles = {} }) {
        this.targetId = targetId;
        this.position = position;
        this.styles = styles;
        this.pluginId = `plugin-${Math.random().toString(36).substr(2, 9)}`;
    }

    initialize(survey) {
        this.survey = survey;
        this.injectPlugin();
    }

    injectPlugin() {
        const targetContainer = document.getElementById(this.targetId);
        if (!targetContainer) {
            console.warn(`Target container with id "${this.targetId}" not found`);
            return;
        }

        let pluginContainer = this.getOrCreatePluginContainer(targetContainer);
        
        const pluginElement = this.createPluginElement();
        pluginContainer.appendChild(pluginElement);
    }

    getOrCreatePluginContainer(targetContainer) {
        const containerId = `${this.targetId}-${this.position}-plugins`;
        let pluginContainer = document.getElementById(containerId);

        if (!pluginContainer) {
            pluginContainer = document.createElement('div');
            pluginContainer.id = containerId;
            
            if (this.position === 'top') {
                targetContainer.insertBefore(pluginContainer, targetContainer.firstChild);
            } else {
                targetContainer.appendChild(pluginContainer);
            }
        }

        return pluginContainer;
    }

    createPluginElement() {
        const element = document.createElement('div');
        element.id = this.pluginId;
        element.innerHTML = this.generateContent();
        this.applyStyles(element);
        return element;
    }

    generateContent() {
        // To be implemented by subclasses
        throw new Error('generateContent method must be implemented by subclasses');
    }

    applyStyles(element) {
        Object.assign(element.style, this.styles.root || {});
    }

    beforePageRender() {
        // This method is intentionally left empty
    }

    afterPageRender() {
        // This method is intentionally left empty
    }

    beforeSurveyFinish() {
        // This method is intentionally left empty
    }

    destroy() {
        const element = document.getElementById(this.pluginId);
        if (element) {
            element.remove();
        }
    }
}

export default Plugin;