import { Component, OnInit, Injector } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  gameOver = null;
  gameService: GameService;

  constructor(private _injector: Injector) {
    this.gameService = _injector.get(GameService);
   }

  ngOnInit(): void {
    this.gameService.gameStatus.subscribe(value => {
      this.gameOver = value;
    });
  }

  ngOnDestory() {
    this.gameService.gameStatus.unsubscribe();
  }

}
