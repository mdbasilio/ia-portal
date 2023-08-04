import { Component } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  btnAction: boolean = false;

  mostrarVideo(){
    this.btnAction = true;
  }
}
