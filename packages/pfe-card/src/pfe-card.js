import { PFElement, html } from "@patternfly/pfelement";

// import styles from "./pfe-card.scss";

class PfeCard extends PFElement {
  static get tag() {
    return "pfe-card";
  }

  // static get styles() {
  //   return [styles];
  // }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

PFElement.create(PfeCard);
