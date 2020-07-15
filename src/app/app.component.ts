import { Component, OnInit, Injector } from '@angular/core';
import { GameService } from './game.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-minesweeper';
  board;
  gameService: any;
  form: FormGroup;

  constructor(private _injector: Injector, 
    private _formBuilder: FormBuilder) {
    this.gameService = _injector.get(GameService);

    this.form = this._formBuilder.group({
      width: new FormControl(''),
      length: new FormControl(''),
      mines: new FormControl('')

    });
   }

  ngOnInit() {
    this.gameService.getBoard$.subscribe((b) => {
      this.board = b;
    });
  }

  ngOnDestroy() {
    this.gameService.gameSetup.unsubscribe();
  }

  changeSize() {
    if (this.validateForm()) {
      this.gameService.changeBoardSize(this.form.getRawValue());
    } 
  }

  defaultBoard() {
    this.form.reset();

    this.gameService.changeBoardSize({
      length: 20,
      width: 20,
      mines: 60
    });
  }

  validateForm() {
    const width = this.form.controls.width.value;
    const length = this.form.controls.length.value;
    const bombs = this.form.controls.mines.value;

    return (width && length && bombs && width <= 30 &&
      width > 0 &&
      length <= 30 &&
      length > 0 &&
      bombs <= (width * length));
  }


}
