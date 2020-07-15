import { Component, OnInit, Input, Injector } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
})
export class CellComponent implements OnInit {
  @Input() x: any;
  @Input() y: any;
  gameService: GameService;
  type: string;
  visited: boolean;
  val: number;
  class: string;
  flagged: boolean;
  reset = true;

  constructor(private injector: Injector) {
    this.gameService = injector.get(GameService);
  }

  boardInit() {
    const cell = this.gameService.getCell(this.x, this.y);
    this.visited = cell.visited;
    this.val = cell.val;
    this.flagged = cell.flagged;
    switch (this.val) {
      case -1:
        this.class = 'pink';
        break;
      case 0:
        this.class = 'grey';
        break;
      case 1:
        this.class = 'blue';
        break;
      case 2:
        this.class = 'green';
        break;
      case 3:
        this.class = 'red';
        break;
      case 4:
        this.class = 'darkBlue';
        break;
      case 5:
        this.class = 'purple';
        break;
      case 6:
        this.class = 'teal';
        break;
      case 7:
        this.class = 'black';
        break;
    }
  }

  ngOnInit(): void {
    this.boardInit();
  }

  // ngOnChanges() {
  //   this.boardInit();
  // }

  clickedCell() {
    if (!this.flagged) {
      this.gameService.clickedCell(this);
    }
  }

  onRightClick() {
    if (!this.flagged) {
      this.flagged = true;
    } else {
      this.flagged = false;
    }
    return false;
  }

  ngAfterContentChecked() {
    const b = this.gameService.getBoard();
    b.forEach((col) => {
      col.forEach((cell) => {
        if (this.x === cell.x && this.y === cell.y) {
          this.visited = cell.visited;
        }
      });
    });

    if (this.visited && this.val === 0) {
      this.class = this.class + ' hide';
    } else if (this.visited && this.val > 0) {
      this.class = this.class + ' flipped';
    }
  }
}
