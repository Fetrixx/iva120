import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'iva120';
  jsonFile: any = '../assets/test.json';

  constructor( private http: HttpClient ){

  }
  
  log(){
    console.log(this.jsonFile);
  }

  ngOnInit(){
    this.loadJsonData()
  }

  public dataFromJson:any;

  loadJsonData(){
    
    this.http.get
    this.http.get(this.jsonFile).subscribe(response => {
      this.dataFromJson = response
      console.log(response)
    });
    console.log("test")
    console.log(this.dataFromJson)
    return this.dataFromJson

  }
}



/*
guardar datos en un array, de ahi ir llenando los inputs, desactivar manualmente los que no se usan
leer array anidado json

json para colocar los datos, 
botones:
- leer
- guardar
- imprimir
- exportar
- recalcular
- asiento

*/
