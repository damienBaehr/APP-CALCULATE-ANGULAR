import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UnitOptions } from './interfaces/UnitOptions';
import { Item } from './interfaces/Item';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})


export class AppComponent {
  title = 'APP-CALCULATE';

  defaultResult = 0;
  inputName: string = '';
  unitOptions: string[] = Object.values(UnitOptions);
  selectedUnit: UnitOptions = UnitOptions.Unit;
  inputValue: string = '';
  result = '';

  items : Item[] = [];

  constructor( ) { 
    fromEvent(window, 'storage').subscribe((event) => {
      let items = localStorage.getItem("items");
      if(items){
        let parsedItems = JSON.parse(items)
        this.items = parsedItems
      }
    });
  }

  addToInput(value :string){
    this.inputValue += value;
  }
  clearInput() {
    this.inputName='';
    this.inputValue = '';
    this.result = '';
  }
  calculateResult() {
    console.log('résultat ', this.result);
    console.log('résultat', this.inputValue);
    console.log('résultat', this.inputName);
    console.log('résultat', this.selectedUnit);
    try {
      this.result = eval(this.inputValue);
        this.items.push({
          id: this.items.length + 1,
          name: this.inputName,
          quantity: parseInt(this.result),
          unit: this.selectedUnit
        })
        localStorage.setItem("items", JSON.stringify(this.items))
      
    } catch (e) {
      console.log(e)
      this.result = 'Error';
    }
 
  }
}
