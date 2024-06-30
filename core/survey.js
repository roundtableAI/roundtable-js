import Page from "./page.js";
import Element from "./element.js";

class Survey {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.pages = [];
        this.currentPageIndex = 0;
        this.data = {};
        this.logicRules = [];
    }

    addPage(page) {
        this.pages.push(page);
    }

    start() {
        this.currentPageIndex = 0;
        return this.getCurrentPage();
    }

    getCurrentPage() {
        if (this.isComplete()) {
            return null;
        }
        const page = this.pages[this.currentPageIndex];
        return this.applyPiping(page);
    }

    nextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
        }
    }

    previousPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
        }
    }

    jumpToPage(pageId) {
        const index = this.pages.findIndex(p => p.id === pageId);
        if (index !== -1) {
            this.currentPageIndex = index;
        } else {
            console.warn(`Page with id ${pageId} not found`);
        }
    }

    submitData(data) {
        Object.assign(this.data, data);

        // Logic to determine if page should change
        this.applyLogicRules();

        if (this.isComplete()) {
            return null;
        }

        this.nextPage();  // Ensure moving to the next page after processing data

        return this.getCurrentPage();
    }

    applyLogicRules() {
        for (const rule of this.logicRules) {
            if (rule.condition(this.data, this.currentPageIndex, this.pages)) {
                rule.action(this.data, this);
            }
        }
    }

    isComplete() {
        return this.currentPageIndex >= this.pages.length;
    }

    getProgress() {
        return {
            current: this.currentPageIndex + 1,
            total: this.pages.length,
            percentage: ((this.currentPageIndex + 1) / this.pages.length) * 100
        };
    }

    applyPiping(page) {
        const pageCopy = new Page(page.id);
        pageCopy.elements = page.elements.map(element => {
            if (element instanceof Element) {
                const elementCopy = element.clone();
                elementCopy.text = this.replacePlaceholders(elementCopy.text);
                if (typeof elementCopy.rows === 'function') {
                    elementCopy.rows = elementCopy.rows(this.data);
                }
                return elementCopy;
            } else if (typeof element === 'string') {
                return this.replacePlaceholders(element);
            }
            return element;
        });
        return pageCopy;
    }

    replacePlaceholders(text) {
        return text.replace(/{{(.*?)}}/g, (match, p1) => {
            return this.data[p1] || match;
        });
    }

    addLogicRule(condition, action) {
        this.logicRules.push({ condition, action });
    }

    endSurvey() {
        this.currentPageIndex = this.pages.length;
    }
}

export default Survey;
