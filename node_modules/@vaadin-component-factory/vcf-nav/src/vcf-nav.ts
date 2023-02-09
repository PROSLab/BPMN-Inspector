import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';

// Used for generating unique IDs for label elements
let id = 0;

@customElement('vcf-nav')
export class Nav extends LitElement {
  @property({ type: Boolean, reflect: true })
  collapsible = false;

  @property({ type: Boolean, reflect: true })
  collapsed = false;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      font-weight: 500;
      line-height: var(--lumo-line-height-xs);
      color: var(--lumo-body-text-color);
      -webkit-tap-highlight-color: transparent;
    }

    [hidden] {
      display: none !important;
    }

    summary {
      cursor: var(--lumo-clickable-cursor, default);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: var(--lumo-border-radius-m);
    }

    summary ::slotted([slot='label']) {
      display: block;
      font-size: var(--lumo-font-size-s);
      color: var(--lumo-secondary-text-color);
      margin: var(--lumo-space-s);
      border-radius: inherit;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::marker {
      content: '';
    }

    summary::after {
      font-family: lumo-icons;
      color: var(--lumo-tertiary-text-color);
      font-size: var(--lumo-icon-size-m);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--lumo-size-s);
      height: var(--lumo-size-s);
      transition: transform 140ms;
      margin: 0 var(--lumo-space-xs);
    }

    :host([collapsible]) summary::after {
      content: var(--lumo-icons-dropdown);
    }

    @media (any-hover: hover) {
      summary:hover::after {
        color: var(--lumo-body-text-color);
      }
    }

    :host([collapsed]) summary::after {
      transform: rotate(-90deg);
    }

    @supports selector(:focus-visible) {
      summary {
        outline: none;
      }

      summary:focus-visible {
        box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
      }
    }

    slot {
      /* Needed to make role="list" work */
      display: block;
    }
  `;

  render() {
    const label = this.querySelector('[slot="label"]');
    if (label && this.collapsible) {
      return html`
        <details ?open="${!this.collapsed}" @toggle="${this.toggleCollapsed}">${this.renderBody(label)}</details>
      `;
    }
    return this.renderBody(label);
  }

  renderBody(label: Element | null) {
    if (label) {
      if (!label.id) label.id = 'app-nav-label-' + id++;
      this.setAttribute('aria-labelledby', label.id);
    } else {
      this.removeAttribute('aria-labelledby');
    }
    return html`
      <summary part="label" ?hidden="${label == null}">
        <slot name="label" @slotchange="${() => this.requestUpdate()}"></slot>
      </summary>
      <slot role="list"></slot>
    `;
  }

  toggleCollapsed(e: Event) {
    this.collapsed = !(e.target as HTMLDetailsElement).open;
  }
}
