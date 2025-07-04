export default class MeatMatchGameBoard extends HTMLElement {
  private $root: ShadowRoot;

  private numRows: number = 8;
  private numCols: number = 8;

  private blockTypes: string[] = [
    'steak',
    'chicken',
    'bacon',
    'rib',
    'patty',
    'sausage',
  ];

  private board: string[][] = [];

  constructor() {
    super();
    this.$root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.generateInitialBoard();
    this.render();
  }

  private generateInitialBoard() {
    this.board = [];

    for (let row = 0; row < this.numRows; row++) {
      const rowData: string[] = [];

      for (let col = 0; col < this.numCols; col++) {
        const type = this.getValidBlockType(row, col, rowData);
        rowData.push(type);
      }

      this.board.push(rowData);
    }
  }

  private getValidBlockType(
    row: number,
    col: number,
    rowData: string[]
  ): string {
    const candidates = [...this.blockTypes];

    // 가로 체크
    if (col >= 2 && rowData[col - 1] === rowData[col - 2]) {
      const invalid = rowData[col - 1];
      const i = candidates.indexOf(invalid);
      if (i > -1) candidates.splice(i, 1);
    }

    // 세로 체크
    if (row >= 2 && this.board[row - 1][col] === this.board[row - 2][col]) {
      const invalid = this.board[row - 1][col];
      const i = candidates.indexOf(invalid);
      if (i > -1) candidates.splice(i, 1);
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
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

    const html = `
      ${style}
      <div class="board">
        ${this.board
          .flat()
          .map(
            (type) => `
            <div class="block">
              <img src="/meat/${type}.png" alt="${type}" draggable="false" />
            </div>
          `
          )
          .join('')}
      </div>
    `;

    this.$root.innerHTML = html;
  }
}
