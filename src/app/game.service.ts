import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GameService {
  board: Array<
    Array<{
      x: number;
      y: number;
      visited: boolean;
      val: number;
      flagged: boolean;
    }>
  > = [];
  length: number = 20;
  width: number = 20;
  bombs: number = 20;
  cellsToFlip: Array<Array<number>> = [[null, null]];
  gameOver: boolean = false;
  resetting: boolean = false;

  constructor() {
    this.setupBoard();
  }

  resetGame() {
    this.resetting = true;
    this.setupBoard();
    return [this.length, this.width];
  }

  getReset() {
    return this.resetting;
  }

  setupBoard() {
    this.gameOver = false;
    this.resetting = false;
    let bombsLeft = this.bombs;

    for (let i = 0; i < this.length; i++) {
      let rowArr = [];
      for (let j = 0; j < this.width; j++) {
        rowArr.push({ x: i, y: j, visited: false, val: 0, flagged: false });
      }
      this.board.push(rowArr);
    }

    while (bombsLeft > 0) {
      let ranX = this.getRandomInt(0, this.length);
      let ranY = this.getRandomInt(0, this.width);
      this.board[ranX][ranY].val = -1;
      bombsLeft--;
    }

    for (let x = 0; x < this.length; x++) {
      for (let y = 0; y < this.width; y++) {
        let currentPiece = this.board[x][y];
        if (currentPiece.val == -1) {
          //cell on top of the bomb
          if (x - 1 >= 0 && this.board[x - 1][y].val !== -1) {
            this.board[x - 1][y].val += 1;
          }
          //cell below the bomb
          if (x + 1 < this.length && this.board[x + 1][y].val !== -1) {
            this.board[x + 1][y].val += 1;
          }
          //cell to the right of the bomb
          if (y + 1 < this.width && this.board[x][y + 1].val !== -1) {
            this.board[x][y + 1].val += 1;
          }
          //cell to the left of the bomb
          if (y - 1 >= 0 && this.board[x][y - 1].val !== -1) {
            this.board[x][y - 1].val += 1;
          }
          //cell up and to the right
          if (
            x - 1 >= 0 &&
            y + 1 < this.width &&
            this.board[x - 1][y + 1].val !== -1
          ) {
            this.board[x - 1][y + 1].val += 1;
          }
          //cell down and to the right
          if (
            x + 1 < this.length &&
            y + 1 < this.width &&
            this.board[x + 1][y + 1].val !== -1
          ) {
            this.board[x + 1][y + 1].val += 1;
          }
          //cell up and to the left
          if (x - 1 >= 0 && y - 1 >= 0 && this.board[x - 1][y - 1].val !== -1) {
            this.board[x - 1][y - 1].val += 1;
          }
          //cell down and to the left
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

  clickedCell(x: number, y: number) {
    if (!this.gameOver) {
      if (this.getCell(x, y).val == 0) {
        let stack = [];
        stack.push([x, y]);

        while (stack.length > 0) {
          let cx = stack[0][0];
          let cy = stack[0][1];
          this.flipCell(cx, cy);

          if (this.getCell(cx, cy).val == 0) {
            if (
              cy - 1 >= 0 &&
              this.getCell(cx, cy - 1).val == 0 &&
              !this.isFlipped(cx, cy - 1)
            ) {
              //left
              stack.unshift([cx, cy - 1]);
            } else if (
              cx + 1 < this.length &&
              this.getCell(cx + 1, cy).val == 0 &&
              !this.isFlipped(cx + 1, cy)
            ) {
              // down
              stack.unshift([cx + 1, cy]);
            } else if (
              cy + 1 < this.width &&
              this.getCell(cx, cy + 1).val == 0 &&
              !this.isFlipped(cx, cy + 1)
            ) {
              //right
              stack.unshift([cx, cy + 1]);
            } else if (
              cx - 1 >= 0 &&
              this.getCell(cx - 1, cy).val == 0 &&
              !this.isFlipped(cx - 1, cy)
            ) {
              //up
              stack.unshift([cx - 1, cy]);
            } else {
              if (this.getCell(cx, cy).val !== -1) {
                this.flipCell(cx, cy);
              }
              stack.shift();
            }
            //check right for num
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
      } else if (this.getCell(x, y).val == -1) {
        window.alert("You LOST!");
        this.gameOver = true;
        this.showAll();
      } else {
        this.flipCell(x, y);
      }

      if (this.checkUnflipped() == this.bombs) {
        window.alert("You WIN!");
        this.gameOver = true;
        this.showAll();
      }
    }
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
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}
