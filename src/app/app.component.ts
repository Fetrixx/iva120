import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'iva120';
  @Input() jsonFile: any = '../assets/test.json';

  constructor(private http: HttpClient, private decimalPipe: DecimalPipe) {

  }

  getJsonData(): Observable<any> {
    return this.http.get<any>(this.jsonFile);
  }

  log() {
    console.log(this.jsonFile);
  }



  public rubro1: any[] = [];
  public rubro2: any[] = [];
  public rubro3: any[] = [];
  public rubro4: any[] = [];
  public rubro5: any[] = [];
  public rubro6: any[] = [];
  public res: any[] = [];


  resValues: any[] = [];
  r1Values: any[] = [];
  r2Values: any[] = [];
  r3Values: any[] = [];
  r4Values: any[] = [];
  r5Values: any[] = [];
  r6Values: any[] = [];

  loadJsonData() {

    //this.http.get<{ config: any[], data: any[] }>(this.jsonLink) // get "data" y config de type any[] dentro del json
    this.http.get<{ res: any[], r1: any[], r2: any[], r3: any[], r4: any[], r5: any[], r6: any[] }>(this.jsonFile).subscribe(response => {

      this.rubro1 = response.r1;
      //console.log("R1 ES: ")
      //console.log(this.rubro1);
      this.rubro2 = response.r2;
      this.rubro3 = response.r3;
      this.rubro4 = response.r4;
      this.rubro5 = response.r5;
      this.rubro6 = response.r6;
      this.res = response.res;
      //let cols: any ;
      //console.log("r1 obj:")
      //console.log(this.rubro1)
      //console.log(this.rubro1.length)
      for (let i = 0; i < this.rubro1.length; i++) {  // llenando todos los datos existentes para las casillas
        this.r1Values.push(Object.values(this.rubro1[i]))
        //console.log(r1[i].col)
      }
      for (let i = 0; i < this.rubro2.length; i++) {
        this.r2Values.push(Object.values(this.rubro2[i]))
      }
      for (let i = 0; i < this.rubro3.length; i++) {
        this.r3Values.push(Object.values(this.rubro3[i]))
      }
      for (let i = 0; i < this.rubro4.length; i++) {
        this.r4Values.push(Object.values(this.rubro4[i]))
      }
      for (let i = 0; i < this.rubro5.length; i++) {
        this.r5Values.push(Object.values(this.rubro5[i]))
      }
      for (let i = 0; i < this.rubro6.length; i++) {
        this.r6Values.push(Object.values(this.rubro6[i]))
      }
      for (let i = 0; i < this.res.length; i++) {
        this.resValues.push(Object.values(this.res[i]))
      }
      /*console.log("this.r1Values") // aray de valores de r1
      console.log(this.r1Values)
      console.log("this.r1Values[0]") // sub array, valores de la fila1[0] de r1
      console.log(this.r1Values[0])
      console.log("this.r1Values[0][2]") // valor de la fila 1 [0], elemento3 [2]
      console.log(this.r1Values[0][2])
      //for (const col in cols){
        //console.log(this.r1Values)
      //}
      //console.log("\nres: ")
      //console.log(r1)


      this.dataFromJson = response;
      console.log("data from json: ")
      console.log(this.dataFromJson); // Verifica en la consola que los datos se hayan cargado correctamente
      console.log("this.dataFromJson.r1[0]: ")
      console.log(this.dataFromJson.r1[0])
      console.log("this.dataFromJson.r1[0].col1: ")
      console.log(this.dataFromJson.r1[0].col1)


      console.log("this.dataFromJson.r1: ")
      console.log(this.dataFromJson.r1)*/
      //this.rubro1 = this.dataFromJson.r1;
      /*
      console.log("this.rubro1: ")
      console.log(this.rubro1)

      console.log("\nthis.rubro1[10].col1: ")
      console.log(this.rubro1[10].col1)

      console.log("VALOREEES this.r1Values: ")
      console.log(this.r1Values)

      /*
      this.dataFromJson.r1[0].col1
      dataFromJson tiene los atributos "res, y r1 a r6"
      cada uno de estos tiene elementos, algunos mas, otros menos, el minimo es 
      
      json:
      array de objetos:
      objetos: res, r1, r2... r6
      cara objeto tiene:
      objeto?, array?
      con col1, col2, col3... en formato key:value
      
      */
    });
  }

  public dataFromJson: any;
  ngOnInit() {
    this.loadJsonData()
    //console.log(this.r1Values)



    /*
    // Guardar los datos de 'res' en 'resArray'
    this.dataFromJson.res.forEach((element:any) => {
      this.resArray.push(element);
    });

    // Guardar los datos de 'r1' en 'r1Array'
    this.dataFromJson.r1.forEach((element:any) => {
      this.r1Array.push(element);
    });

    // Guardar los datos de 'r2' en 'r2Array'
    this.dataFromJson.r2.forEach((element:any) => {
      this.r2Array.push(element);
    });

    // Guardar los datos de 'r3' en 'r3Array'
    this.dataFromJson.r3.forEach((element:any) => {
      this.r3Array.push(element);
    });

    // Guardar los datos de 'r4' en 'r4Array'
    this.dataFromJson.r4.forEach((element:any) => {
      this.r4Array.push(element);
    });

    // Guardar los datos de 'r5' en 'r5Array'
    this.dataFromJson.r5.forEach((element:any) => {
      this.r5Array.push(element);
    });

    // Guardar los datos de 'r6' en 'r6Array'
    this.dataFromJson.r6.forEach((element:any) => {
      this.r6Array.push(element);
    });

    // Verificar los datos almacenados en los arreglos
    console.log('resArray:', this.resArray);
    console.log('r1Array:', this.r1Array);
    console.log('r2Array:', this.r2Array);
    console.log('r3Array:', this.r3Array);
    console.log('r4Array:', this.r4Array);
    console.log('r5Array:', this.r5Array);
    console.log('r6Array:', this.r6Array);

    /*this.http.get(this.jsonFile).subscribe(response => {
      this.dataFromJson = response;
    })*/
    //this.loadJsonData()

  }
  /*loadJsonData(){
    
    this.http.get
    this.http.get(this.jsonFile).subscribe(response => {
      this.dataFromJson = response
      console.log(response)
    });
    console.log("test")
    console.log(this.dataFromJson)
    return this.dataFromJson

  }*/


  columns: string[] = []; // Array para almacenar los nombres de las columnas
  show: boolean = false;
  asd() {
    this.show = !this.show;
    //this.columns = Object.keys(this.jsonFile.res[0]); // Obtiene los nombres de las columnas
  }

  /**
   * Retorna el valor que se da.
   * @param any : el rXValue, puede ser r1, r2, r3... a r6, y tambien res.
   * @param fila indica la fila en la que se encuentra
   * @param col indica la columna en la que se encuentra
   */
  retVal(any: any, fila: number, col: number): number { // r1Values
    //console.log(any[fila][col])
    return any[fila][col]
  }


  cargarTodos() {
    this.cargarValores_r1();
    this.cargarValores_r2();
    this.cargarValores_r3();
    this.cargarValores_r4();
    this.cargarValores_r5();
    this.cargarValores_r6();
  }

  cargarValores_r1() {
    // Define un arreglo con los IDs de tus inputs
    const inputIds = [
      'r1_1_1', 'r1_1_2', 'r1_1_3',
      'r1_2_1', 'r1_2_2', 'r1_2_3',
      'r1_3_1', 'r1_3_2', 'r1_3_3',
      'r1_4_1', 'r1_4_2', 'r1_4_3',
      'r1_5_1', 'r1_5_2', 'r1_5_3',
      'r1_6_1', 'r1_6_2', 'r1_6_3',
      'r1_7_1', 'r1_7_2', 'r1_7_3',
      'r1_8_1', 'r1_8_2', 'r1_8_3',
      'r1_9_1', 'r1_9_2', 'r1_9_3',
      'r1_10_1', 'r1_10_2', 'r1_10_3',
      'r1_11_1', 'r1_11_2', 'r1_11_3',
      /*'r1_12_1', 'r1_12_2', 'r1_12_3',*/ // totales
    ];

    // Recorre los IDs y asigna los valores usando el método retVal
    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_'); // Divide el ID en partes separadas
      const rowIndex = parseInt(row) - 1; // Obtiene el índice de fila restando 1
      const colIndex = parseInt(col) - 1; // Obtiene el índice de columna restando 1
      const value = this.retVal(this.r1Values, rowIndex, colIndex); // Obtiene el valor usando el método retVal
      const inputElement = (<HTMLInputElement>document.getElementById(id)); // Obtiene el elemento del input
      if (inputElement) { // Verifica si el elemento existe
        inputElement.value = value.toString(); // Asigna el valor al input
      }
    });

  }

  cargarValores_r2() {
    const inputIds = [
      'r2_1_1',
      'r2_2_1',
      'r2_3_1',
      'r2_4_1',
      'r2_5_1',
      'r2_6_1',
      'r2_7_1',
      'r2_8_1'
    ];

    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colIndex = parseInt(col) - 1;
      const value = this.retVal(this.r2Values, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
      const inputElement = document.getElementById(id) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = value.toString();
      }
    });
  }

  cargarValores_r3() {
    const inputIds = [
      'r3_1_1', 'r3_1_2', 'r3_1_3',
      'r3_2_1', 'r3_2_2', 'r3_2_3',
      'r3_3_1', 'r3_3_2', 'r3_3_3',
      'r3_4_1', 'r3_4_2', 'r3_4_3',
      'r3_5_1', 'r3_5_2', 'r3_5_3',
      'r3_6_1', 'r3_6_2', 'r3_6_3',
    ];

    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colIndex = parseInt(col) - 1;
      const value = this.retVal(this.r3Values, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
      const inputElement = document.getElementById(id) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = value.toString();
      }
    });
  }

  cargarValores_r4() {
    // Define un arreglo con los IDs de tus inputs
    const inputIds = [
      'r4_1_1',
      'r4_2_1',
      'r4_3_1',
      'r4_4_1',
      'r4_5_1',
      'r4_6_1',
      'r4_7_1',
      'r4_8_1',
      'r4_9_1',
      'r4_10_1'
      /*'r1_12_1', 'r1_12_2', 'r1_12_3',*/ // totales
    ];

    // Recorre los IDs y asigna los valores usando el método retVal
    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_'); // Divide el ID en partes separadas
      const rowIndex = parseInt(row) - 1; // Obtiene el índice de fila restando 1
      const colIndex = parseInt(col) - 1; // Obtiene el índice de columna restando 1
      const value = this.retVal(this.r4Values, rowIndex, colIndex); // Obtiene el valor usando el método retVal
      const inputElement = (<HTMLInputElement>document.getElementById(id)); // Obtiene el elemento del input
      if (inputElement) { // Verifica si el elemento existe
        inputElement.value = value.toString(); // Asigna el valor al input
      }
    });

  }


  cargarValores_r5() {
    const inputIds = [
      'r5_1_1', 'r5_1_2',
      'r5_2_1', 'r5_2_2',
      'r5_3_1', 'r5_3_2',
      'r5_4_1', 'r5_4_2',
      'r5_5_1', 'r5_5_2',
      'r5_6_1', 'r5_6_2',
      'r5_7_1', 'r5_7_2',
      'r5_8_1', 'r5_8_2',
    ];

    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colIndex = parseInt(col) - 1;
      const value = this.retVal(this.r5Values, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
      const inputElement = document.getElementById(id) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = value.toString();
      }
    });
  }

  cargarValores_r6() {
    const inputIds = [
      'r6_1_1', 'r6_1_2',
      'r6_2_1', 'r6_2_2',
      'r6_3_1', 'r6_3_2',
      'r6_4_1', 'r6_4_2',
      'r6_5_1', 'r6_5_2',
      'r6_6_1', 'r6_6_2',
      'r6_7_1', 'r6_7_2',
    ];

    inputIds.forEach((id) => {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colIndex = parseInt(col) - 1;
      const value = this.retVal(this.r6Values, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
      const inputElement = document.getElementById(id) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = value.toString();
      }
    });
  }


  setValue() {
    // Obtenemos el valor del input
    //const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
    // Asignamos el valor al input
    /*(<HTMLInputElement>document.getElementById(inputId)).value = "2";
    console.log("valor asignado: ")*/
    //this.r1_11.nativeElement.value = this.retVal(this.r1Values, 0, 0)
  }




  /*
  @ViewChild('r1_11') r1_11!: ElementRef;     // R es "rubro", 11 es: fila 1, columna 1.
  @ViewChild('r1_12') r1_12!: ElementRef;
  @ViewChild('r1_13') r1_13!: ElementRef;
  @ViewChild('r1_21') r1_21!: ElementRef;
  @ViewChild('r1_22') r1_22!: ElementRef;
  @ViewChild('r1_23') r1_23!: ElementRef;
  @ViewChild('r1_31') r1_31!: ElementRef;
  @ViewChild('r1_32') r1_32!: ElementRef;
  @ViewChild('r1_33') r1_33!: ElementRef;
  @ViewChild('r1_41') r1_41!: ElementRef;
  @ViewChild('r1_42') r1_42!: ElementRef;
  @ViewChild('r1_43') r1_43!: ElementRef;
  @ViewChild('r1_51') r1_51!: ElementRef;
  @ViewChild('r1_52') r1_52!: ElementRef;
  @ViewChild('r1_53') r1_53!: ElementRef;
  @ViewChild('r1_61') r1_61!: ElementRef;
  @ViewChild('r1_62') r1_62!: ElementRef;
  @ViewChild('r1_63') r1_63!: ElementRef;

  @ViewChild('r1_71') r1_71!: ElementRef;
  @ViewChild('r1_72') r1_72!: ElementRef;
  @ViewChild('r1_73') r1_73!: ElementRef;
  @ViewChild('r1_81') r1_81!: ElementRef;
  @ViewChild('r1_82') r1_82!: ElementRef;
  @ViewChild('r1_83') r1_83!: ElementRef;
  @ViewChild('r1_91') r1_91!: ElementRef;
  @ViewChild('r1_92') r1_92!: ElementRef;
  @ViewChild('r1_93') r1_93!: ElementRef;
  cargarValores() {
    // Obtenemos el valor del input
    //const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
    // Asignamos el valor al input
    //(<HTMLInputElement>document.getElementById(inputId)).value = "2";
    //console.log("valor asignado: ")
    this.r1_11.nativeElement.value = this.retVal(this.r1Values, 0, 0)
    this.r1_12.nativeElement.value = this.retVal(this.r1Values, 0, 1)
    this.r1_13.nativeElement.value = this.retVal(this.r1Values, 0, 2)
    this.r1_21.nativeElement.value = this.retVal(this.r1Values, 1, 0)
    this.r1_22.nativeElement.value = this.retVal(this.r1Values, 1, 1)
    this.r1_23.nativeElement.value = this.retVal(this.r1Values, 1, 2)
    this.r1_31.nativeElement.value = this.retVal(this.r1Values, 2, 0)
    this.r1_32.nativeElement.value = this.retVal(this.r1Values, 2, 1)
    this.r1_33.nativeElement.value = this.retVal(this.r1Values, 2, 2)
    this.r1_41.nativeElement.value = this.retVal(this.r1Values, 3, 0)
    this.r1_42.nativeElement.value = this.retVal(this.r1Values, 3, 1)
    this.r1_43.nativeElement.value = this.retVal(this.r1Values, 3, 2)
    this.r1_51.nativeElement.value = this.retVal(this.r1Values, 4, 0)
    this.r1_52.nativeElement.value = this.retVal(this.r1Values, 4, 1)
    this.r1_53.nativeElement.value = this.retVal(this.r1Values, 4, 2)
    this.r1_61.nativeElement.value = this.retVal(this.r1Values, 4, 0)
    this.r1_62.nativeElement.value = this.retVal(this.r1Values, 4, 1)
    this.r1_63.nativeElement.value = this.retVal(this.r1Values, 4, 2)

    this.r1_71.nativeElement.value = this.retVal(this.r1Values, 5, 0)
    this.r1_72.nativeElement.value = this.retVal(this.r1Values, 5, 1)
    this.r1_73.nativeElement.value = this.retVal(this.r1Values, 5, 2)
    this.r1_81.nativeElement.value = this.retVal(this.r1Values, 6, 0)
    this.r1_82.nativeElement.value = this.retVal(this.r1Values, 6, 1)
    this.r1_83.nativeElement.value = this.retVal(this.r1Values, 6, 2)
    this.r1_91.nativeElement.value = this.retVal(this.r1Values, 7, 0)
    this.r1_92.nativeElement.value = this.retVal(this.r1Values, 7, 1)
    this.r1_93.nativeElement.value = this.retVal(this.r1Values, 7, 2)
   
    this.cargarValores_r2()
  }
*/

  @ViewChild('r2_1_1') r2_1_1!: ElementRef;
  @ViewChild('r2_2_1') r2_2_1!: ElementRef;
  @ViewChild('r2_3_1') r2_3_1!: ElementRef;
  @ViewChild('r2_4_1') r2_4_1!: ElementRef;
  @ViewChild('r2_5_1') r2_5_1!: ElementRef;
  @ViewChild('r2_6_1') r2_6_1!: ElementRef;
  @ViewChild('r2_7_1') r2_7_1!: ElementRef;
  @ViewChild('r2_8_1') r2_8_1!: ElementRef;

  cargarValores__() {
    // Obtenemos el valor del input
    //const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
    // Asignamos el valor al input
    /*(<HTMLInputElement>document.getElementById(inputId)).value = "2";
    console.log("valor asignado: ")*/
    this.r2_1_1.nativeElement.value = this.retVal(this.r2Values, 0, 0)
    this.r2_2_1.nativeElement.value = this.retVal(this.r2Values, 1, 0)
    this.r2_3_1.nativeElement.value = this.retVal(this.r2Values, 2, 0)
    this.r2_4_1.nativeElement.value = this.retVal(this.r2Values, 3, 0)
    this.r2_5_1.nativeElement.value = this.retVal(this.r2Values, 4, 0)
    this.r2_6_1.nativeElement.value = this.retVal(this.r2Values, 5, 0)
    this.r2_7_1.nativeElement.value = this.retVal(this.r2Values, 6, 0)
    this.r2_8_1.nativeElement.value = this.retVal(this.r2Values, 7, 0)

  }


  formatNumber(value: number | null): string {
    if (value === null) {
      return '';
    }
    return this.decimalPipe.transform(value, '1.0-0') || '';
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
