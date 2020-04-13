import { LitElement, html } from "lit-element";
import { autoReveal } from "./reveal.js";

const prefix = "pfe-";

class PFElement extends LitElement {
  static create(pfe) {
    window.customElements.define(pfe.tag, pfe);
  }

  static debugLog(preference = null) {
    if (preference !== null) {
      PFElement._debugLog = !!preference;
    }
    return PFElement._debugLog;
  }

  static log(...msgs) {
    if (PFElement.debugLog()) {
      console.log(...msgs);
    }
  }

  static get PfeTypes() {
    return {
      Container: "container",
      Content: "content",
      Combo: "combo"
    };
  }

  static get version() {
    return "0.0.1";
  }

  get randomId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  get version() {
    return this._pfeClass.version;
  }

  get pfeType() {
    return this.getAttribute(`${prefix}type`);
  }

  set pfeType(value) {
    this.setAttribute(`${prefix}type`, value);
  }

  connectedCallback() {
    super.connectedCallback();

    this.connected = true;
    this.log(`Connecting...`);
    this.setAttribute("pfelement", "");
    this.log(`Connected.`);
  }

  disconnectedCallback() {
    this.log(`Disconnecting...`);
    this.connected = false;
    this.log(`Disconnected.`);
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    super.connectedCallback(attr, oldVal, newVal);

    if (!this._pfeClass.cascadingAttributes) {
      return;
    }

    const cascadeTo = this._pfeClass.cascadingAttributes[attr];
    if (cascadeTo) {
      this._copyAttribute(attr, cascadeTo);
    }

    if (attr === "pfe-theme") {
      this.context_update();
    }
  }

  _copyAttribute(name, to) {
    const recipients = [
      ...this.querySelectorAll(to),
      ...this.shadowRoot.querySelectorAll(to)
    ];
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
  }

  // Map the imported properties json to real props on the element
  // @notice static getter of properties is built via tooling
  // to edit modify src/element.json
  _mapSchemaToProperties(tag, properties) {
    this.log("Mapping properties...");
    // Loop over the properties provided by the schema
    Object.keys(properties).forEach(attr => {
      let data = properties[attr];

      // Only attach the information if the data provided is a schema object
      if (typeof data === "object") {
        // Prefix default is true
        let hasPrefix = true;
        let attrName = attr;
        // Set the attribute's property equal to the schema input
        this[attr] = data;
        // Initialize the value to null
        this[attr].value = null;

        if (typeof this[attr].prefixed !== "undefined") {
          hasPrefix = this[attr].prefixed;
        }

        if (hasPrefix) {
          attrName = `${prefix}${attr}`;
        }

        // If the attribute exists on the host
        if (this.hasAttribute(attrName)) {
          // Set property value based on the existing attribute
          this[attr].value = this.getAttribute(attrName);
        }
        // Otherwise, look for a default and use that instead
        else if (data.default) {
          const dependency_exists = this._hasDependency(tag, data.options);
          const no_dependencies =
            !data.options ||
            (data.options && !data.options.dependencies.length);
          // If the dependency exists or there are no dependencies, set the default
          if (dependency_exists || no_dependencies) {
            this.setAttribute(attrName, data.default);
            this[attr].value = data.default;
          }
        }
      }
    });

    this.log("Properties mapped.");
  }

  // Test whether expected dependencies exist
  _hasDependency(tag, opts) {
    // Get any possible dependencies for this attribute to exist
    let dependencies = opts ? opts.dependencies : [];
    // Initialize the dependency return value
    let hasDependency = false;
    // Check that dependent item exists
    // Loop through the dependencies defined
    for (let i = 0; i < dependencies.length; i += 1) {
      const slot_exists =
        dependencies[i].type === "slot" &&
        this.has_slots(`${tag}--${dependencies[i].id}`).length > 0;
      const attribute_exists =
        dependencies[i].type === "attribute" &&
        this.getAttribute(`${prefix}${dependencies[i].id}`);
      // If the type is slot, check that it exists OR
      // if the type is an attribute, check if the attribute is defined
      if (slot_exists || attribute_exists) {
        // If the slot does exist, add the attribute with the default value
        hasDependency = true;
        // Exit the loop
        break;
      }
    }
    // Return a boolean if the dependency exists
    return hasDependency;
  }

  // Map the imported slots json
  // @notice static getter of properties is built via tooling
  // to edit modify src/element.json
  _mapSchemaToSlots(tag, slots) {
    this.log("Validate slots...");
    // Loop over the properties provided by the schema
    Object.keys(slots).forEach(slot => {
      let slotObj = slots[slot];

      // Only attach the information if the data provided is a schema object
      if (typeof slotObj === "object") {
        let slotExists = false;
        let result = [];
        // If it's a named slot, look for that slot definition
        if (slotObj.namedSlot) {
          // Check prefixed slots
          result = this.has_slots(`${tag}--${slot}`);
          if (result.length > 0) {
            slotObj.nodes = result;
            slotExists = true;
          }

          // Check for unprefixed slots
          result = this.has_slots(`${slot}`);
          if (result.length > 0) {
            slotObj.nodes = result;
            slotExists = true;
          }
          // If it's the default slot, look for direct children not assigned to a slot
        } else {
          result = [...this.children].filter(
            child => !child.hasAttribute("slot")
          );

          if (result.length > 0) {
            slotObj.nodes = result;
            slotExists = true;
          }
        }

        // If the slot exists, attach an attribute to the parent to indicate that
        if (slotExists) {
          this.setAttribute(`has_${slot}`, "");
        } else {
          this.removeAttribute(`has_${slot}`);
        }
      }
    });
    this.log("Slots validated.");
  }

  var(name) {
    return PFElement.var(name, this);
  }

  cssVariable(name, value, element = this) {
    name = name.substr(0, 2) !== "--" ? "--" + name : name;
    if (value) {
      element.style.setProperty(name, value);
    }
    return window
      .getComputedStyle(element)
      .getPropertyValue(name)
      .trim();
  }

  // Returns a single element assigned to that slot; if multiple, it returns the first
  has_slot(name) {
    return this.querySelector(`[slot='${name}']`);
  }

  // Returns an array with all elements assigned to that slot
  has_slots(name) {
    return [...this.querySelectorAll(`[slot='${name}']`)];
  }

  // Update the theme context for self and children
  context_update() {
    const children = this.querySelectorAll("[pfelement]");
    let theme = this.cssVariable("theme");

    // Manually adding `pfe-theme` overrides the css variable
    if (this.hasAttribute("pfe-theme")) {
      theme = this.getAttribute("pfe-theme");
      // Update the css variable to match the data attribute
      this.cssVariable("theme", theme);
    }

    // Update theme for self
    this.context_set(theme);

    // For each nested, already upgraded component
    // set the context based on the child's value of --theme
    // Note: this prevents contexts from parents overriding
    // the child's context should it exist
    [...children].map(child => {
      if (child.connected) {
        child.context_set(theme);
      }
    });
  }

  // Get the theme variable if it exists, set it as an attribute
  context_set(fallback) {
    let theme = this.cssVariable("theme");
    if (!theme) {
      theme = this.getAttribute("pfe-theme");
    }
    if (!theme && fallback) {
      theme = fallback;
    }
    if (theme) {
      this.setAttribute("on", theme);
    }
  }

  log(...msgs) {
    PFElement.log(`[${this.tag}]`, ...msgs);
  }

  emitEvent(
    name,
    { bubbles = true, cancelable = false, composed = false, detail = {} } = {}
  ) {
    this.log(`Custom event: ${name}`);
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles,
        cancelable,
        composed,
        detail
      })
    );
  }
}

autoReveal(PFElement.log);

export { PFElement, html };
