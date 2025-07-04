export default class MeatMatchGameBoard extends HTMLElement {
  private $root: ShadowRoot;
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    const html = (v: TemplateStringsArray) => v[0];

    this.$root.innerHTML = html` <div class="board">hi</div> `;
  }
}
