import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitOptions } from './interfaces/UnitOptions';
import { Item } from './interfaces/Item';


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
  selectedUnit: UnitOptions | undefined = UnitOptions.Unit;
  inputValue: string = '';
  result = '';
  items : Item[] = [];
  rows = Object.keys(this.items)
  csvContent = "data:text/csv;charset=utf-8,"

  constructor( ) { 
      let items = localStorage.getItem("items");
      if(items){
        let parsedItems = JSON.parse(items)
        this.items = parsedItems
      }
  }

  exportCSV() {
    let encodeUri = encodeURI(this.csvContent + ['title, ', 'quantity, ', 'unit'] + '\n' + this.items.map(e => e.name + ', ' + e.quantity + ', ' + e.unit).join('\n'));
    let link = document.createElement('a');
    link.setAttribute('href', encodeUri);
    link.setAttribute('download', 'inventaire.csv');
    document.body.appendChild(link);
    link.click();
  }

  updateItem(item: Item) {
    let index = this.items.findIndex(i => i.id === item.id);
    const existingItem = this.items[index];
    existingItem.name = item.name;
    existingItem.quantity = item.quantity;
    existingItem.unit = item.unit;
    localStorage.setItem("items", JSON.stringify(this.items))
  }

  addToInput(value :string){
    if (value === 'x') {
      this.inputValue += '*';
    } else {
      this.inputValue += value;
    }  
  }
  clearInput() {
    this.inputName='';
    this.inputValue = '';
    this.result = '';
  }
  fillInputFields(item: Item) {
    this.inputName = item.name;
    this.inputValue = item.quantity.toString();
    this.selectedUnit = item.unit;
    this.result="";
  }
  scrollToCalculateSection() {
    const calculateSection = document.getElementById('calculate');
    if (calculateSection) {
      calculateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  calculateResult() {
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
