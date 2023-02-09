import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';

@customElement('vcf-nav-item')
export class NavItem extends LitElement {
  @property()
  path = '';

  @property({ type: Boolean, reflect: true })
  expanded = false;

  @property({ type: Boolean, reflect: true })
  active = false;

  @query('button')
  button: HTMLElement | undefined;

  @query('#children')
  childrenSlot: HTMLElement | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
    this._updateActive();
    // @ts-ignore
    this.__boundUpdateActive = this._updateActive.bind(this);
    // @ts-ignore
    window.addEventListener('popstate', this.__boundUpdateActive);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // @ts-ignore
    window.removeEventListener('popstate', this.__boundUpdateActive);
  }

  static styles = css`
    :host {
      display: block;
    }

    [hidden] {
      display: none !important;
    }

    a {
      flex: auto;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--lumo-space-xs);
      text-decoration: none;
      color: inherit;
      font: inherit;
      padding: var(--lumo-space-s);
      padding-inline-start: calc(var(--lumo-space-s) + var(--_child-indent, 0px));
      transition: color 140ms;
      border-radius: var(--lumo-border-radius-m);
      transition: background-color 140ms, color 140ms;
      cursor: var(--lumo-clickable-cursor, default);
      min-height: var(--lumo-icon-size-m);
    }

    button {
      -webkit-appearance: none;
      appearance: none;
      border: 0;
      margin: calc((var(--lumo-icon-size-m) - var(--lumo-size-s)) / 2) 0;
      margin-inline-end: calc(var(--lumo-space-xs) * -1);
      padding: 0;
      background: transparent;
      font: inherit;
      color: var(--lumo-tertiary-text-color);
      flex: none;
      width: var(--lumo-size-s);
      height: var(--lumo-size-s);
      cursor: var(--lumo-clickable-cursor, default);
      transition: color 140ms;
    }

    :host(:not([path])) a {
      position: relative;
    }

    :host(:not([path])) button::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    @media (any-hover: hover) {
      a:hover {
        color: var(--lumo-header-text-color);
      }

      button:hover {
        color: var(--lumo-body-text-color);
      }
    }

    a:active:focus {
      background-color: var(--lumo-contrast-5pct);
    }

    button::before {
      font-family: lumo-icons;
      content: var(--lumo-icons-dropdown);
      font-size: 1.5em;
      line-height: var(--lumo-size-s);
      display: inline-block;
      transform: rotate(-90deg);
      transition: transform 140ms;
    }

    :host([expanded]) button::before {
      transform: none;
    }

    @supports selector(:focus-visible) {
      a,
      button {
        outline: none;
      }

      a:focus-visible,
      button:focus-visible {
        border-radius: var(--lumo-border-radius-m);
        box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
      }
    }

    a:active {
      color: var(--lumo-header-text-color);
    }

    slot[name='prefix'],
    slot[name='suffix'] {
      flex: none;
    }

    slot:not([name]) {
      display: block;
      flex: auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 var(--lumo-space-xs);
    }

    slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
      color: var(--lumo-contrast-60pct);
      font-size: var(--lumo-icon-size-s);
      min-width: 1em;
      min-height: 1em;
    }

    :host([active]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
      color: inherit;
    }

    slot[name='children'] {
      --_child-indent: calc(var(--_child-indent-2, 0px) + var(--vcf-nav-child-indent, var(--lumo-space-l)));
    }

    slot[name='children']::slotted(*) {
      --_child-indent-2: var(--_child-indent);
    }

    slot[name='children'] {
      /* Needed to make role="list" work */
      display: block;
      width: 100%;
    }

    :host([active]) a {
      color: var(--lumo-primary-text-color);
      background-color: var(--lumo-primary-color-10pct);
    }
  `;

  render() {
    return html`
      <a href="${this.path}" part="item" aria-current="${this.active ? 'page' : false}">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
        <button
          part="toggle-button"
          @click="${this.toggleExpanded}"
          ?hidden="${!this.querySelector('[slot=children]')}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-label="Toggle child items"></button>
      </a>
      <slot name="children" role="list" part="children" id="children" ?hidden="${!this.expanded}"></slot>
    `;
  }

  toggleExpanded(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.expanded = !this.expanded;
  }

  _updateActive() {
    const hasBaseUri = (document.baseURI != document.location.href);
    const pathAbsolute = this.path.startsWith("/");
    if (hasBaseUri && !pathAbsolute) {
      const pathRelativeToRoot = document.location.pathname;
      const basePath = new URL(document.baseURI).pathname;
      const pathWithoutBase = pathRelativeToRoot.substring(basePath.length);
      const pathRelativeToBase = (basePath !== pathRelativeToRoot && pathRelativeToRoot.startsWith(basePath)) ? pathWithoutBase : pathRelativeToRoot;
      this.active = pathRelativeToBase === this.path;
    } else {
      // Absolute path or no base uri in use. No special comparison needed
      this.active = document.location.pathname == this.path;
    }
    this.toggleAttribute('child-active', document.location.pathname.startsWith(this.path));

    if (this.active) {
      this.expanded = true;
    }
  }
}
