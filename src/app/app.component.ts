import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UnitOptions } from './interfaces/unitOptions';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})


export class AppComponent {
  title = 'APP-CALCULATE';

  defaultResult = 0;

  unitOptions: string[] = Object.values(UnitOptions);
  selectedUnit: string = '';
  inputValue: string = '';
  

  addToInput(value :string){
    this.inputValue += value;
  }
}
