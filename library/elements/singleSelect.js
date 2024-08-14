import Element from "../core/element.js";

class SingleSelect extends Element {
  static styleKeys = [
    "questionRoot",
    "questionInnerContainer",
    "questionLabel",
    "questionSubText",
    "optionsContainer",
    "option",
    "radio",
    "errorMessage",
  ];

  static defaultStyles = {
    questionRoot: {
      marginBottom: "20px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      padding: "10px",
    },
    questionInnerContainer: {},
    questionLabel: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      fontSize: "1.1em",
    },
    questionSubText: {
      display: "block",
      marginBottom: "10px",
      color: "#6c757d",
      fontSize: "1.1em",
    },
    optionsContainer: {
      display: "flex",
      flexDirection: "column",
    },
    option: {
      marginBottom: "5px",
    },
    radio: {
      marginRight: "5px",
    },
    errorMessage: {
      color: "#fa5252",
      fontSize: "0.9em",
      marginTop: "5px",
    },
  };

  constructor({
    id,
    text,
    subText = "",
    options,
    required = true,
    randomize = false,
    styles = {},
    globalStyles = {},
  }) {
    super({ id, type: "single-select", store_data: true, required });

    if (!Array.isArray(options) || options.length === 0) {
      throw new Error("Options must be a non-empty array");
    }

    this.text = text;
    this.subText = subText;
    this.options = options;
    this.randomize = Boolean(randomize);

    // Merge global styles with component styles, allowing component styles to override
    const mergedStyles = this.mergeStyles(
      SingleSelect.defaultStyles,
      globalStyles,
      styles
    );

    this.styles = mergedStyles;

    this.addData("text", text);
    this.addData("subText", subText);
    this.addData("options", options);
    this.addData("randomize", this.randomize);

    this.setInitialResponse("");
  }

  // Method to merge styles, giving priority to the last argument (i.e., specific styles)
  mergeStyles(...styles) {
    return styles.reduce((merged, style) => this.deepMerge(merged, style), {});
  }

  deepMerge(target, source) {
    if (!source || typeof source !== "object") return target;
    if (!target || typeof target !== "object") return source;

    return Object.entries(source).reduce((merged, [key, value]) => {
      merged[key] =
        key.startsWith("&") || key.startsWith("@media")
          ? this.deepMerge(target[key] || {}, value)
          : value;
      return merged;
    }, { ...target });
  }

  getSelectorForKey(key) {
    const selectorMap = {
      questionRoot: `.single-select-question`,
      questionInnerContainer: `#${this.id}-inner-container`,
      questionLabel: ".question-label",
      questionSubText: ".question-subtext",
      optionsContainer: ".options-container",
      option: ".option",
      radio: 'input[type="radio"]',
      errorMessage: ".error-message",
    };
    return selectorMap[key] || "";
  }

  generateHTML() {
    let optionsHTML = this.randomize
      ? this.shuffleArray([...this.options])
      : this.options;

    const optionsString = optionsHTML
      .map(
        (option, index) => `
          <div class="option">
              <input class="question-radio" type="radio" id="${this.id}-${index}" name="${this.id}" value="${option}">
              <label for="${this.id}-${index}">${option}</label>
          </div>
      `
      )
      .join("");

    return `
          <div class="single-select-question" id="${this.id}-container">
              <div id="${
                this.id
              }-inner-container" class="question-inner-container">
                  <label class="question-label" for="${this.id}-0">${
      this.text
    }</label>
                  ${
                    this.subText
                      ? `<span class="question-subtext">${this.subText}</span>`
                      : ""
                  }
                  <div class="options-container">
                      ${optionsString}
                  </div>
              </div>
              <div id="${
                this.id
              }-error" class="error-message" style="display: none;"></div>
          </div>
      `;
  }

  attachEventListeners() {
    const container = document.getElementById(`${this.id}-container`);
    this.addEventListenerWithTracking(
      container,
      "change",
      this.handleChange.bind(this)
    );
  }

  handleChange(e) {
    if (e.target.type === "radio") {
      this.setResponse(e.target.value);
    }
  }

  setResponse(value) {
    super.setResponse(value, value !== "");
    this.showValidationError("");
  }

  validate(showError = false) {
    const isValid =
      !this.required || (this.data.response && this.data.response !== "");
    if (showError && !isValid) {
      this.showValidationError("Please select an option.");
    } else {
      this.showValidationError("");
    }
    return isValid;
  }
}

export default SingleSelect;
