import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  @Output() gameStatus = new EventEmitter<any>();
  private _getBoardSource = new BehaviorSubject<any>(null);
  getBoard$ = this._getBoardSource.asObservable();

  board: Array<
    Array<{
      x: number;
      y: number;
      visited: boolean;
      val: number;
      flagged: boolean;
    }>
  > = [];
  length = 20;
  width = 20;
  bombs = 60;
  cellsToFlip: Array<Array<number>> = [[null, null]];
  gameOver = false;

  constructor() {
    this.setupBoard();
  }

  resetGame() {
    this.setupBoard();
  }

  setupBoard() {
    this.board = [];
    this.gameOver = false;
    let bombsLeft = this.bombs;

    for (let i = 0; i < this.length; i++) {
      const rowArr = [];
      for (let j = 0; j < this.width; j++) {
        rowArr.push({ x: i, y: j, visited: false, val: 0, flagged: false });
      }
      this.board.push(rowArr);
    }

    while (bombsLeft > 0) {
      const ranX = this.getRandomInt(0, this.length);
      const ranY = this.getRandomInt(0, this.width);
      this.board[ranX][ranY].val = -1;
      bombsLeft--;
    }

    for (let x = 0; x < this.length; x++) {
      for (let y = 0; y < this.width; y++) {
        const currentPiece = this.board[x][y];
        if (currentPiece.val === -1) {
          // cell on top of the bomb
          if (x - 1 >= 0 && this.board[x - 1][y].val !== -1) {
            this.board[x - 1][y].val += 1;
          }
          // cell below the bomb
          if (x + 1 < this.length && this.board[x + 1][y].val !== -1) {
            this.board[x + 1][y].val += 1;
          }
          // cell to the right of the bomb
          if (y + 1 < this.width && this.board[x][y + 1].val !== -1) {
            this.board[x][y + 1].val += 1;
          }
          // cell to the left of the bomb
          if (y - 1 >= 0 && this.board[x][y - 1].val !== -1) {
            this.board[x][y - 1].val += 1;
          }
          // cell up and to the right
          if (
            x - 1 >= 0 &&
            y + 1 < this.width &&
            this.board[x - 1][y + 1].val !== -1
          ) {
            this.board[x - 1][y + 1].val += 1;
          }
          // cell down and to the right
          if (
            x + 1 < this.length &&
            y + 1 < this.width &&
            this.board[x + 1][y + 1].val !== -1
          ) {
            this.board[x + 1][y + 1].val += 1;
          }
          // cell up and to the left
          if (x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1].val !== -1) {
            this.board[x - 1][y - 1].val += 1;
          }
          // cell down and to the left
          if (
            x + 1 < this.length &&
            y - 1 >= 0 &&
            this.board[x + 1][y - 1].val !== -1
          ) {
            this.board[x + 1][y - 1].val += 1;
          }
        }
      }
    }

    this._getBoardSource.next(this.board);
  }

  changeBoardSize(obj) {
    this.length = obj.length;
    this.width = obj.width;
    this.bombs = obj.mines;
    this.setupBoard();
  }

  getLength() {
    return this.length;
  }

  getWidth() {
    return this.width;
  }

  getCell(x: number, y: number) {
    return this.board[x][y];
  }

  clickedCell(cell) {
    if (!this.gameOver) {
      if (cell.val === 0) {
        const stack = [];
        stack.push([cell.x, cell.y]);

        while (stack.length > 0) {
          const cx = stack[0][0];
          const cy = stack[0][1];
          this.flipCell(cx, cy);

          if (this.getCell(cx, cy).val === 0) {
            if (
              cy - 1 >= 0 &&
              this.getCell(cx, cy - 1).val === 0 &&
              !this.isFlipped(cx, cy - 1)
            ) {
              // left
              stack.unshift([cx, cy - 1]);
            } else if (
              cx + 1 < this.length &&
              this.getCell(cx + 1, cy).val === 0 &&
              !this.isFlipped(cx + 1, cy)
            ) {
              // down
              stack.unshift([cx + 1, cy]);
            } else if (
              cy + 1 < this.width &&
              this.getCell(cx, cy + 1).val === 0 &&
              !this.isFlipped(cx, cy + 1)
            ) {
              // right
              stack.unshift([cx, cy + 1]);
            } else if (
              cx - 1 >= 0 &&
              this.getCell(cx - 1, cy).val === 0 &&
              !this.isFlipped(cx - 1, cy)
            ) {
              // up
              stack.unshift([cx - 1, cy]);
            } else {
              if (this.getCell(cx, cy).val !== -1) {
                this.flipCell(cx, cy);
              }
              stack.shift();
            }
            // check right for num
            if (cy + 1 < this.width && this.getCell(cx, cy + 1).val >= 1) {
              this.flipCell(cx, cy + 1);
            }
            // check left for num
            if (cy - 1 >= 0 && this.getCell(cx, cy - 1).val >= 1) {
              this.flipCell(cx, cy - 1);
            }
            // check under for num
            if (cx + 1 < this.length && this.getCell(cx + 1, cy).val >= 1) {
              this.flipCell(cx + 1, cy);
            }
            // check on top for num
            if (cx - 1 >= 0 && this.getCell(cx - 1, cy).val >= 1) {
              this.flipCell(cx - 1, cy);
            }
            // check top right for num
            if (
              cx - 1 >= 0 &&
              cy + 1 < this.width &&
              this.getCell(cx - 1, cy + 1).val >= 1
            ) {
              this.flipCell(cx - 1, cy + 1);
            }
            // check top left for num
            if (
              cx - 1 >= 0 &&
              cy - 1 >= 0 &&
              this.getCell(cx - 1, cy - 1).val >= 1
            ) {
              this.flipCell(cx - 1, cy - 1);
            }
            // check bottom left for num
            if (
              cx + 1 < this.length &&
              cy - 1 >= 0 &&
              this.getCell(cx + 1, cy - 1).val >= 1
            ) {
              this.flipCell(cx + 1, cy - 1);
            }
            // check bottom right for num
            if (
              cx + 1 < this.length &&
              cy + 1 < this.width &&
              this.getCell(cx + 1, cy + 1).val >= 1
            ) {
              this.flipCell(cx + 1, cy + 1);
            }
          }
        }
      } else if (this.getCell(cell.x, cell.y).val === -1) {
        this.setGameOver(false);
      } else {
        this.flipCell(cell.x, cell.y);
      }

      if (this.checkUnflipped() === this.bombs) {
        this.setGameOver(true);
      }
    }
  }

  setGameOver(won) {
    this.gameOver = true;
    this.showAll();
    this.gameStatus.emit(won);
  }

  showAll() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.width; j++) {
        this.board[i][j].visited = true;
        this.board[i][j].flagged = false;
      }
    }
  }

  checkUnflipped() {
    let unflipped = 0;
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.width; j++) {
        if (!this.board[i][j].visited) {
          unflipped++;
        }
      }
    }
    return unflipped;
  }

  flipCell(x, y) {
    this.board[x][y].visited = true;
  }

  isFlipped(x, y) {
    return this.board[x][y].visited;
  }

  getBoard() {
    return this.board;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
  }

}
