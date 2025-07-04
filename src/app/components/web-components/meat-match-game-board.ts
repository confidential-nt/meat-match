export default class MeatMatchGameBoard extends HTMLElement {
  private $root: ShadowRoot;
  private numRows: number = 8;
  private numCols: number = 8;
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const style = ` <style>
        :host {
          --num-rows: ${this.numRows};
          --num-cols: ${this.numCols};
        }

         * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;

          touch-action: none;
          user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }

        .board {
          --padding: 5px;
          --border: 8px;
          --board-width: 600px;
          --board-inner-width: calc(
            var(--board-width) - var(--border) * 2 - var(--padding) * 2
          );
           --meat-size: calc(var(--board-inner-width) / var(--num-cols));

          padding: var(--padding); 

          background-color:var(--color-board-bg);
          border: var(--border) solid var(--color-board-border);
          border-radius: 12px;

          display: grid;
          grid-template-rows: repeat(var(--num-rows), var(--meat-size));
          grid-template-columns: repeat(var(--num-cols), var(--meat-size));

          .block {
            cursor: pointer;

            img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            }
          }

        }
      </style>`;

    const template = `
    ${style}
    <div class="board">
        ${Array.from({ length: this.numRows * this.numCols })
          .map(() => {
            const type = this.getRandomType();
            return `
            <div class="block">
              <img src="/meat/${type}.png" alt="${type}" draggable="false" />
            </div>
          `;
          })
          .join('')}
    </div>    
    `;

    this.$root.innerHTML = template;
  }

  private getRandomType(): string {
    const types = ['steak', 'chicken', 'bacon', 'rib', 'patty', 'sausage'];
    return types[Math.floor(Math.random() * types.length)];
  }
}
