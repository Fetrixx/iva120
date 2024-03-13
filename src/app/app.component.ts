/*

todo:
- manage json data with form
- save data on memory
- css clamp to adapt font size? clamp(12px, 4vw, 32px)?

*/
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'iva120';
  @Input() jsonFile: any = '../assets/test2.json'; // CARGA DEL JSON (temporal)

  rubro1Config = {
    value: [],
    config: [{
      class: 'tile',
      col: '4',
      row: '2',
      classInput: 'inputNEWNumber'
    }]
  };

  jsonFormFile?: FormGroup ;
  


  constructor(private http: HttpClient, private decimalPipe: DecimalPipe, private formBuilder: FormBuilder) {
    this.jsonFormFile = this.formBuilder.group({
      r1: this.formBuilder.array([]),
      r2: this.formBuilder.array([]),
      r3: this.formBuilder.array([]),
      r4: this.formBuilder.array([]),
      r5: this.formBuilder.array([]),
      r6: this.formBuilder.array([]),
      res: this.formBuilder.array([]),
    })
  }

  getJsonData(): Observable<any> {
    return this.http.get<any>(this.jsonFile);
  }

  jsonObject = this.getJsonData();

  log() {
    console.log(this.jsonFile);
  }


  // Objetos del json...obj "rubro1, r2..."
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
      console.log("response.r1[0]: ")
      console.log(response.r1[0]);
      console.log("response.r1[0].col1: ")
      console.log(response.r1[0].col1);
      /*for (let i = 0; i < this.rubro1.length; i++) {
        this.jsonDataForm.get('r1')?.setValue(this.rubro1[i])
      }*/



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
      /*for (let i = 0; i < this.rubro1.length; i++) {  // llenando todos los datos existentes para las casillas
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
      }*/

      this.cargarDatosJson()
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
    

    this.http.get<any>(this.jsonFile).subscribe(response => {
      Object.keys(response).forEach(key => {
        // Obtén el FormArray correspondiente
        const formArray = this.jsonDataForm.get(key) as FormArray;
  
        // Itera sobre los elementos del JSON y agrega controles al FormArray
        response[key].forEach((item: any) => {
          const formGroup = this.createFormGroup(item);
          formArray.push(formGroup);
        });
        console.log(`${key}:`, formArray.value);
      });
    });
    // Itera sobre las claves del JSON
    

    
    //console.log(this.r1Values)

  }

  createFormGroup(item: any): FormGroup {
    const formGroup = this.formBuilder.group({});
    Object.keys(item).forEach(key => {
      formGroup.addControl(key, this.formBuilder.control(item[key]));
    });
    return formGroup;
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
    this.calculos_grid();
  }


  cargarTodos2() {
    this.cargarValores_inputR1();
    this.cargarValores_inputR2();
    this.cargarValores_inputR3();
    this.cargarValores_inputR4();
    //this.cargarValores_r5();
    //this.cargarValores_r6();
    //this.calculos_grid();
  }

  

  calculos_grid() {
    // Totales R1: 'r1_12_1', 'r1_12_2', 'r1_12_3'
    const r1_t3 = [
      'r1_1_3', 'r1_8_3'
    ]
    // Totales R2: 'r2_4_1', 'r2_8_1', 'r2_9_1'
    const r2_t1 = [
      'r2_1_1', 'r2_2_1', 'r2_3_1'
    ]

    /*
    r2_t1.forEach(id) => {
    const inputElement = (<HTMLInputElement>document.getElementById('r2_4_1')); // Obtiene el elemento del input
    
    const inputElement = (<HTMLInputElement>document.getElementById('r2_4_1')); // Obtiene el elemento del input
    console.log('r2_4_1: ');
    console.log(inputElement.value);*/


    r1_t3.forEach((id) => {
      const r1_t3_O = (<HTMLInputElement>document.getElementById('r1_12_3'));
      r1_t3_O.value = '0';
      const [prefix, row, col] = id.split('_'); // Divide el ID en partes separadas
      const rowIndex = parseInt(row) - 1; // Obtiene el índice de fila restando 1
      const colIndex = parseInt(col) - 1; // Obtiene el índice de columna restando 1
      const value = this.retVal(this.r1Values, rowIndex, colIndex); // Obtiene el valor usando el método retVal
      const inputElement = (<HTMLInputElement>document.getElementById(id)); // Obtiene el elemento del input
      if (inputElement) { // verifica si el elemento existe, y si esta activado.
        r1_t3_O.value = (parseFloat(r1_t3_O.value) + value).toString(); // Asigna el valor al input

        console.log("valor inicial: " + r1_t3_O.value)
        console.log("valor a sumar: " + value)
        console.log("suma: " + (parseFloat(r1_t3_O.value) + value))

        //(parseInt(r2_t1_O.value) + value).toString()
        console.log("VALOR SUMADO r1_t3_O")
        console.log(r1_t3_O.value)
      }
    });


    r2_t1.forEach((id) => {
      const r2_t1_O = (<HTMLInputElement>document.getElementById('r2_4_1'));
      const [prefix, row, col] = id.split('_'); // Divide el ID en partes separadas
      const rowIndex = parseInt(row) - 1; // Obtiene el índice de fila restando 1
      const colIndex = parseInt(col) - 1; // Obtiene el índice de columna restando 1
      const value = this.retVal(this.r2Values, rowIndex, colIndex); // Obtiene el valor usando el método retVal
      const inputElement = (<HTMLInputElement>document.getElementById(id)); // Obtiene el elemento del input
      if (inputElement && !inputElement.disabled) { // verifica si el elemento existe, y si esta activado.
        r2_t1_O.value = (parseFloat(r2_t1_O.value) + value).toString(); // Asigna el valor al input
        //(parseInt(r2_t1_O.value) + value).toString()
        console.log("VALOR SUMADO r2_t1_O")
        console.log(r2_t1_O.value)

      }
    });





  }

  cargarValores_inputR1() {
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
      this.getInputValue(id)
    });

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
      if (inputElement && !inputElement.disabled) { // verifica si el elemento existe, y si esta activado.
        inputElement.value = value.toString(); // Asigna el valor al input
      }
    });

  }

  cargarValores_inputR2() {
    // Define un arreglo con los IDs de inputs
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
      this.getInputValue(id)
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
      if (inputElement && !inputElement.disabled) {
        inputElement.value = value.toString();
      }
    });
  }

  cargarValores_inputR3() {
    // Define un arreglo con los IDs de inputs
    const inputIds = [
      'r3_1_1', 'r3_1_2', 'r3_1_3',
      'r3_2_1', 'r3_2_2', 'r3_2_3',
      'r3_3_1', 'r3_3_2', 'r3_3_3',
      'r3_4_1', 'r3_4_2', 'r3_4_3',
      'r3_5_1', 'r3_5_2', 'r3_5_3',
      'r3_6_1', 'r3_6_2', 'r3_6_3',
    ];
    
    inputIds.forEach((id) => {
      this.getInputValue(id)
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
      if (inputElement && !inputElement.disabled) {
        inputElement.value = value.toString();
      }
    });
  }

  cargarValores_inputR4() {
    // Define un arreglo con los IDs de inputs
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
    ];
    
    inputIds.forEach((id) => {
      this.getInputValue(id)
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
      if (inputElement && !inputElement.disabled) { // Verifica si el elemento existe
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
      if (inputElement && !inputElement.disabled) {
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
      if (inputElement && !inputElement.disabled) {
        inputElement.value = value.toString();
      }
    });
  }


  /*setValue() {
    // Obtenemos el valor del input
    //const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
    // Asignamos el valor al input
    //(<HTMLInputElement>document.getElementById(inputId)).value = "2";
    //console.log("valor asignado: ")
    //this.r1_11.nativeElement.value = this.retVal(this.r1Values, 0, 0)
  }*/




  /*
  @ViewChild('r1_11') r1_11!: ElementRef;     // R es "rubro", 11 es: fila 1, columna 1.
  
  cargarValores() {
    // Obtenemos el valor del input
    //const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
    // Asignamos el valor al input
    //(<HTMLInputElement>document.getElementById(inputId)).value = "2";
    //console.log("valor asignado: ")
    this.r1_11.nativeElement.value = this.retVal(this.r1Values, 0, 0)

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

  printScreen() {
    //Get the print button and put it into a variable
    var cargarTodos_Btn = document.getElementById("cargarTodos");
    //Set the print button visibility to 'hidden' 
    cargarTodos_Btn!.style.visibility = 'hidden';
    //Print the page content
    window.print()
    cargarTodos_Btn!.style.visibility = 'visible';

  }

  test(e: any, i: number) {
    //debugger;

    //console.log(e);
    //console.log(e.target.value);
    //console.log(this.r1Values ) // array de valores: [0] = [123,123,123,123]
    //console.log(this.rubro1)// array de objetos key:val; [0] = {col1: 5164..., col2:...}
    console.log("this.getValue(): ")
    this.getValue()
    this.jsonDataForm.get('r1')?.value //gets values 
    //console.log("console.log(this.jsonDataForm.get('r1')?.value)")
    //console.log(this.jsonDataForm.get('r1')?.value)
    this.rubro1[0] = e.target.value;
    const value = this.retVal(this.r1Values, 0, 0);
  }

  /*getData(rubro: 'r1') {
    return this.jsonDataForm.get(rubro)?.value;
  }*/

  jsonDataForm = this.formBuilder.group({
    //r1: ["abc123"], // funca
    r1: this.formBuilder.array([]),
    r2: this.formBuilder.array([]),
    r3: this.formBuilder.array([]),
    r4: this.formBuilder.array([]),
    r5: this.formBuilder.array([]),
    r6: this.formBuilder.array([]),
    res: this.formBuilder.array([])
    /*r1: [this.rubro1],
    r2: [this.jsonFile.r2],*/
  });

  logValue(comp = 'r1') {
    console.log
  }

  getValue(comp = 'r2') {
    //return this.jsonDataForm.get
    console.log("valor de " + comp)
    console.log(this.jsonDataForm.get(comp)?.value);
    //console.log(this.jsonDataForm.get('r3'))
    return this.jsonDataForm.get(comp)?.value;
  }


  
  /*
  cargarDatosJson() {
    this.http.get<any>(this.jsonFile).subscribe(response => {
      this.jsonDataForm.patchValue({
        
        r1: response.r1, // response.r1 = array completo de r1 = this.rubro1
        r2: response.r2,
        r3: response.r3,
        r4: response.r4,
        r5: response.r5,
        r6: response.r6,
        res: response.res


      });
    });
  }


  //setValue(comp = 'r2', value: any) {
//    //this.jsonDataForm.get(comp)!.value = value;
//    this.jsonDataForm.get(comp)?.value;
  //}

  getData(rubro: 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6' | 'res') {
    console.log(this.jsonDataForm.get(rubro)?.value);
    return this.jsonDataForm.get(rubro)?.value;
  }

  setValue(comp: 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6' | 'res', value: any) {
    this.jsonDataForm.get(comp)?.setValue(value);
  }*/

  cargarDatosJson() {
    this.http.get<any>(this.jsonFile).subscribe(response => {
      // Asegúrate de que la estructura de tu JSON coincida con la estructura esperada por tus formularios
      // Supongamos que tienes los mismos nombres de claves en tu JSON como en tus formularios

      /*
      Object.keys(response).forEach(key => {
        this.jsonDataForm.get(key)?.patchValue(response[key]);
      });*/
      

      // Itera sobre las claves de tu JSON y establece los valores correspondientes en el formulario
      Object.keys(response).forEach(key => {
        const formArray = this.jsonDataForm.get(key) as FormArray;
        formArray.clear(); // Limpia el FormArray antes de agregar los nuevos valores
        response[key].forEach((item: any) => {
          formArray.push(this.formBuilder.group(item));
        });
      });
    });
  }

  get r1Control() {
    return (this.jsonDataForm.get('r1') as FormArray).controls[0].get('col1');
  }

  getInputValue(id: string){
      const [prefix, row, col] = id.split('_');
      const rubro = prefix;
      const rowIndex = parseInt(row) - 1;
      const colIndex = parseInt(col) - 1;
      //console.log(this.jsonDataForm.get(rubro)?.value)
      //const value = this.retVal(this.jsonDataForm.get(rubro)?.value, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
      const formArray = this.jsonDataForm.get(rubro) as FormArray;
      const value = formArray.at(rowIndex).get(`col${colIndex + 1}`)?.value;

      const inputElement = document.getElementById(id) as HTMLInputElement;
      if (inputElement && !inputElement.disabled) {
        inputElement.value = value.toString();
      }
      //console.log(value)
    

    //return this.jsonDataForm.get(rubro)?.value;
  }

  getInputValueLOG(id: string){
    const [prefix, row, col] = id.split('_');
    const rubro = prefix;
    const rowIndex = parseInt(row) - 1;
    const colIndex = parseInt(col) - 1;
    //console.log(this.jsonDataForm.get(rubro)?.value)
    //const value = this.retVal(this.jsonDataForm.get(rubro)?.value, rowIndex, colIndex); // Suponiendo que tienes r2Values definido
    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    const value = formArray.at(rowIndex).get(`col${colIndex + 1}`)?.value;

    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement && !inputElement.disabled) {
      inputElement.value = value.toString();
    }
    console.log(value)
  

  //return this.jsonDataForm.get(rubro)?.value;
}

  cargarValores_inputR1123() {
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
      this.getInputValue(id)
    });

  }





  getData(rubro: string) {
    console.log("Rubro: " + rubro)
    console.log(this.jsonDataForm.get(rubro)?.value)
    return this.jsonDataForm.get(rubro)?.value;
  }

  setValue(comp: string, value: any) {
    this.jsonDataForm.get(comp)?.setValue(value);
  }

}







/*

jsonDataForm = this.formBuilder.group({
    r1: [this.items.r1],
    r2: [this.items.r2],
  });

  getValue(comp = 'r1') {
    return this.formBuilder.get(comp).value;
  }

  setValue(comp = 'r1', value: any) {
    this.formBuilder.get(comp).value = value;
  }


*/


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
