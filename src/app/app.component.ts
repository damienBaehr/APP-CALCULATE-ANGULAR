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
  currentID : number | undefined = undefined;
  csvContent = "data:text/csv;charset=utf-8,"

  constructor( ) { 
      let items = localStorage.getItem("items");
      if(items){
        let parsedItems = JSON.parse(items)
        this.items = parsedItems ?? [];
      }
  }

  exportCSV() {
    let encodeUri = encodeURI(this.csvContent + ['id','title, ', 'quantity, ', 'unit'] + '\n' + this.items.map(e => e.id + ', ' + e.name + ', ' + e.quantity + ', ' + e.unit).join('\n'));
    let link = document.createElement('a');
    link.setAttribute('href', encodeUri);
    link.setAttribute('download', 'inventaire.csv');
    document.body.appendChild(link);
    link.click();
  }

  print(){
    let htmlReport = "<table>";
    htmlReport += "<tr>";
    htmlReport += "<th>Produit</th>";
    htmlReport += "<th>Quantité</th>";
    htmlReport += "<th>Unité</th>";
    htmlReport += "</tr>";
    for (let i = 0; i < this.items.length; i++) {
      htmlReport += "<tr>";
      htmlReport += "<td>" + this.items[i].name + "</td>";
      htmlReport += "<td>" + this.items[i].quantity + "</td>";
      htmlReport += "<td>" + this.items[i].unit + "</td>";
      htmlReport += "</tr>";
    }
    htmlReport += "</table>";

    window.document.write(htmlReport);
    window.document.close();
    window.print();
  }

  addToInput(value :string){
    if (value === 'x') {
      this.inputValue += '*';
    } else {
      this.inputValue += value;
    }  
  }
  importCSV(event: any) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          const csvData: string = reader.result as string;
          const lines: string[] = csvData.split('\n');
    
          lines.shift();
    
          lines.forEach((line, index) => {
            const columns: any[] = line.split(',');
            if (columns.length === 4) {
              const id : number = columns[0] ?? null;
              const name: string = columns[1];
              const quantity: number = columns[2];
              const unit: UnitOptions | undefined = columns[3];
              this.items.push({ id, name, quantity, unit });
            } else {

            }
          });
          localStorage.setItem("items", JSON.stringify(this.items));
        };
    
        reader.onerror = (evt) => {
            console.error("Error reading file");
        };
    }
}
  clearInput() {
    this.inputName='';
    this.inputValue = '';
    this.result = '';
  }
  
  fillInputFields(item: Item) {
    this.currentID = item.id;
    this.inputName = item.name;
    this.inputValue = item.calcul ?? '';
    this.selectedUnit = item.unit;
    this.result= item.quantity.toString() ?? '';
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
      if (this.currentID) {
        const index = this.items.findIndex(i => i.id === this.currentID);
        if (index !== -1) {
          this.items.splice(index, 1, {
            id: this.currentID,
            name: this.inputName,
            quantity: parseInt(this.result),
            unit: this.selectedUnit,
            calcul: this.inputValue
          });
        } 
      } else {
        this.items.push({
          id: this.items.length + 1,
          name: this.inputName,
          quantity: parseInt(this.result),
          unit: this.selectedUnit,
          calcul: this.inputValue
        });
      }
      localStorage.setItem("items", JSON.stringify(this.items));
      this.currentID = undefined;
    } catch (e) {
      console.log(e);
      this.result = 'Error';
    }
  }
  
}
