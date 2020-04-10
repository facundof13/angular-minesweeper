import { Component, OnInit } from "@angular/core";
import { GameService } from "../game.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit {
  size: Array<number> = [0, 0];
  gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = new GameService();
    this.size[0] = gameService.getLength();
    this.size[1] = gameService.getWidth();
  }

  resetGame() {
    this.gameService.resetGame();
  }

  ngOnInit(): void {}
}
