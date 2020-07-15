import { Component, OnInit, EventEmitter, Input, Injector } from "@angular/core";
import { GameService } from "../game.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit {
  size: Array<number> = [0, 0];
  gameService: GameService;
  @Input() board: any;

  constructor(private _injector: Injector) {
    this.gameService = _injector.get(GameService);
  }
  
  ngOnInit(): void {
    this.setupGame();
  }

  resetGame() {
    this.board = null;
    this.gameService.resetGame();
  }

  setupGame() {
    this.size[0] = this.gameService.getLength();
    this.size[1] = this.gameService.getWidth();
  }

}
