export default class MeatMatchGameBoard extends HTMLElement {
  private $root: ShadowRoot;
  private numRows = 8;
  private numCols = 8;
  private blockTypes = ['steak', 'chicken', 'bacon', 'rib', 'patty', 'sausage'];
  private board: string[][] = [];
  private selectedBlock: { row: number; col: number } | null = null;
  private isSwapping = false;

  private score: number = 0;

  constructor() {
    super();
    this.$root = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
    this.generateInitialBoard();
    this.render();
    this.addEventListeners();
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
    if (col >= 2 && rowData[col - 1] === rowData[col - 2]) {
      candidates.splice(candidates.indexOf(rowData[col - 1]), 1);
    }
    if (row >= 2 && this.board[row - 1][col] === this.board[row - 2][col]) {
      candidates.splice(candidates.indexOf(this.board[row - 1][col]), 1);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  private render() {
    const style = `
      <style>
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
        }

        .container {
          display: grid;
          grid-template-areas: 'score score score' 'board board board';
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          justify-items: center;
        }

        .board {
          --padding: 16px;
          --border: 4px;  
          --board-width: 600px;
          --board-inner-width: calc(var(--board-width) - var(--border) * 2 - var(--padding) * 2);
          --meat-size: calc(var(--board-inner-width) / var(--num-cols));

           @media (max-width: 640px) {
            --board-width: calc(100vw - 10px); 
          }

          padding: var(--padding);
          background-color: var(--color-board-bg);
          border: var(--border) solid var(--color-board-border);
          border-radius: 12px;
          
          display: grid;
          grid-template-rows: repeat(var(--num-rows), var(--meat-size));
          grid-template-columns: repeat(var(--num-cols), var(--meat-size));
          gap: 4px;

          grid-area: board;
        }
        .block {
          cursor: pointer;
          background-color:#fde68a;
          border-radius: 1px;
        }
        .block img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .score {
          grid-area: score;

          display: flex;
          align-items: center;

          background-color:rgba(0,0,0,0.5);
          padding: 5px;

          border: 4px solid var(--color-score-border);
          border-radius: 8px;

          color: #fff;
          margin-bottom: 5px;
          font-weight: 700;

          cursor: pointer;

          span {
            margin-left: 10px;
          }

          svg {
            stroke: var(--color-score-border);
          }
        }
      </style>`;

    const html = `
      ${style}
      <div class="container">
        <div class="score"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span>Score: ${this.score}</span>
        </div>
        <div class="board">
          ${this.board
            .map((row, rowIndex) =>
              row
                .map(
                  (type, colIndex) => `
                <div class="block" data-row="${rowIndex}" data-col="${colIndex}">
                  ${
                    type
                      ? `<img src="/meat/${type}.png" alt="${type}" draggable="false" />`
                      : ''
                  }
                </div>
              `
                )
                .join('')
            )
            .join('')}
        </div>
      </div>
    `;

    this.$root.innerHTML = html;
    this.removeEventListeners();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.$root.querySelectorAll('.block').forEach((blockEl) => {
      blockEl.addEventListener('pointerdown', this.handlePointerDown);
      blockEl.addEventListener('pointermove', this.handlePointerMove);
      blockEl.addEventListener('pointerup', this.handlePointerUp);
    });
  }

  private removeEventListeners() {
    this.$root.querySelectorAll('.block').forEach((blockEl) => {
      blockEl.removeEventListener('pointerdown', this.handlePointerDown);
      blockEl.removeEventListener('pointermove', this.handlePointerMove);
      blockEl.removeEventListener('pointerup', this.handlePointerUp);
    });
  }

  private handlePointerDown = (e: Event) => {
    const event = e as PointerEvent;

    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    this.selectedBlock = {
      row: Number(target.dataset.row),
      col: Number(target.dataset.col),
    };

    this.isSwapping = false;
  };

  private handlePointerMove = (e: Event) => {
    const event = e as PointerEvent;

    if (!this.selectedBlock || this.isSwapping) return;

    const target = event.currentTarget as HTMLElement;
    const toRow = Number(target.dataset.row);
    const toCol = Number(target.dataset.col);
    const from = this.selectedBlock;

    const isAdjacent =
      (Math.abs(from.row - toRow) === 1 && from.col === toCol) ||
      (Math.abs(from.col - toCol) === 1 && from.row === toRow);

    if (!isAdjacent) return;

    this.isSwapping = true;

    this.swapBlocks(from.row, from.col, toRow, toCol);
    this.render();

    setTimeout(async () => {
      const hasMatch =
        this.hasMatch(from.row, from.col) || this.hasMatch(toRow, toCol);

      if (!hasMatch) {
        this.swapBlocks(from.row, from.col, toRow, toCol);
        this.render();
      } else {
        await this.clearMatches();
        this.render();
      }

      this.selectedBlock = null;
      this.isSwapping = false;
    }, 200);
  };

  private handlePointerUp = () => {
    this.selectedBlock = null;
  };

  private swapBlocks(row1: number, col1: number, row2: number, col2: number) {
    const temp = this.board[row1][col1];
    this.board[row1][col1] = this.board[row2][col2];
    this.board[row2][col2] = temp;
  }

  private hasMatch(row: number, col: number): boolean {
    const type = this.board[row][col];
    let count = 1;
    for (let i = col - 1; i >= 0 && this.board[row][i] === type; i--) count++;
    for (let i = col + 1; i < this.numCols && this.board[row][i] === type; i++)
      count++;
    if (count >= 3) return true;

    count = 1;
    for (let i = row - 1; i >= 0 && this.board[i][col] === type; i--) count++;
    for (let i = row + 1; i < this.numRows && this.board[i][col] === type; i++)
      count++;
    return count >= 3;
  }

  private async clearMatches() {
    let hasNewMatch = false;

    do {
      const matched: boolean[][] = Array.from({ length: this.numRows }, () =>
        Array(this.numCols).fill(false)
      );
      hasNewMatch = false;

      // 1. 가로 매치 탐색
      for (let row = 0; row < this.numRows; row++) {
        for (let col = 0; col < this.numCols - 2; col++) {
          const type = this.board[row][col];
          if (
            type &&
            type === this.board[row][col + 1] &&
            type === this.board[row][col + 2]
          ) {
            matched[row][col] =
              matched[row][col + 1] =
              matched[row][col + 2] =
                true;
            hasNewMatch = true;
          }
        }
      }

      // 2. 세로 매치 탐색
      for (let col = 0; col < this.numCols; col++) {
        for (let row = 0; row < this.numRows - 2; row++) {
          const type = this.board[row][col];
          if (
            type &&
            type === this.board[row + 1][col] &&
            type === this.board[row + 2][col]
          ) {
            matched[row][col] =
              matched[row + 1][col] =
              matched[row + 2][col] =
                true;
            hasNewMatch = true;
          }
        }
      }

      if (!hasNewMatch) break;

      // 3. 매치된 블록 제거
      for (let row = 0; row < this.numRows; row++) {
        for (let col = 0; col < this.numCols; col++) {
          if (matched[row][col]) {
            this.board[row][col] = '';
            this.score += 1;
          }
        }
      }

      this.render();
      await this.delay(200); // 제거 애니메이션 시간

      // 4. 블록 아래로 떨어뜨리기
      for (let col = 0; col < this.numCols; col++) {
        let pointer = this.numRows - 1;

        for (let row = this.numRows - 1; row >= 0; row--) {
          if (this.board[row][col] !== '') {
            this.board[pointer][col] = this.board[row][col];
            if (pointer !== row) this.board[row][col] = '';
            pointer--;
          }
        }

        // 위에 생긴 빈칸은 새 블록으로 채움
        for (let row = pointer; row >= 0; row--) {
          this.board[row][col] = this.getRandomType();
        }
      }

      this.render();
      await this.delay(200); // 블록 떨어지는 애니메이션 시간
    } while (hasNewMatch);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRandomType(): string {
    return this.blockTypes[Math.floor(Math.random() * this.blockTypes.length)];
  }
}
