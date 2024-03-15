/*

todo:
- manage json data with form
- save data on memory
- css clamp to adapt font size? clamp(12px, 4vw, 32px)?

alt ways to manage data?
ways to load the data instead of id per id
reactive forms
formgroup?
formcontrol?
validator

http post (crud)
json pipe

agregar validacion para comprobar los cambios del usuario


r3_1_1 funciona, replicar eso en todos los campos



errores no aparecen al cargar datos directamente o al no cargar el html
los errores son causados porque los datos v1,v2,v3 se cargan de manera asincronica, y los inputs ya se muestran antes que estos valores esten asignados
haciendo que los valores sean cargados, pero no pueden ser visualizados.


WORKAROUND  
el form inicializa cerado
al tocar el boron cargar json, se cargan los valores (en teoria)
pero no se actualizan los valores en los inputs

*/
import { Component, ElementRef, ViewChild, Input, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { JsonService } from './jsonService.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnChanges {

  title = 'iva120';
  /**
   * link to the json
   */
  @Input() jsonFile: any = '../assets/test2.json'; // CARGA DEL JSON (temporal)
  // jsonDataForm: FormGroup;

  formArray = new FormArray([]);

  jsonDataForm = new FormGroup({ // array local de datos
    r1: new FormArray([
    ]),
    r2: new FormArray([
    ]),
    r3: new FormArray([
    ]),
    r4: new FormArray([
    ]),
    r5: new FormArray([
    ]),
    r6: new FormArray([
    ]),
    res: new FormArray([
    ])
  })

  /**
   * @param rubro rubro al que se añade
   * @param v1 parametro1
   * @param v2 parametro2
   * @param v3 parametro3
   */
  agregarItem_alForm(rubro: string = '', v1: any = null, v2: any = null, v3: any = null) {
    if (v1 !== null && v2 === null && v3 === null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    } else if (v1 !== null && v2 !== null && v3 === null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1),
        col2: new FormControl(v2)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    } else if (v1 !== null && v2 !== null && v3 !== null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1),
        col2: new FormControl(v2),
        col3: new FormControl(v3)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    }
    
  }

  addItemToForm(v1: any = null, v2: any = null, v3: any = null, v4: any = null, v5: any = null) {
    if ((v2 && v3 && v4 && v5) === null) {
      const item = this.formBuilder.group({
        col1: new FormControl(v1),
      });
    }

    const item = this.formBuilder.group({
      col1: new FormControl(v1),
      col2: new FormControl(v2),
      col3: new FormControl(v3),
      col4: new FormControl(v4),
    });
    // this.r1.push(item);
    console.log("this.r1: ")
    console.log(this.r1);
    console.log("item: ")
    console.log(item);
    /*console.log(this.subr1);
    console.log(this.subr1?.value);*/
  }

  rubro1Config = {
    value: [],
    config: [{
      class: 'tile',
      col: '4',
      row: '2',
      classInput: 'inputNEWNumber'
    }]
  };

  jsonFormFile?: FormGroup;
  jsonObject: any;


  constructor(private http: HttpClient, private decimalPipe: DecimalPipe, private formBuilder: FormBuilder, private jsonService: JsonService) {
    
    //this.createJsonObj(this.jsonObject, this.jsonFile) // creacion del objeto espejo al json
    this.agregarItem_alForm('r1', 111, 222, 333)
    this.cerarInputs(); // cera todos.
    
    //this.cargarInputs(); // 4242 , tiene que ser del  json

    //this.cerarInputs()

    //this.createJsonObj() // crea un objeto espejo al json

    // this.
  }


   ngOnInit() {
    //this.loadJsonData()
    this.jsonDataForm.valueChanges.forEach(value => console.log(value));
     
    
    //this.addItem();

  }


  ngOnChanges(e: any) {
    console.log(e);
  }

  addItem() {
    const item = this.formBuilder.group({
      col1: new FormControl(1234),
      col2: new FormControl('2'),
      col3: new FormControl('3'),
      col4: new FormControl('4'),
    });
    // this.r1.push(item);
    console.log("this.r1: ")
    console.log(this.r1);
    console.log("item: ")
    console.log(item);
    /*console.log(this.subr1);
    console.log(this.subr1?.value);*/
  }

  get r1() {
    return this.jsonDataForm.get('r1');
  }

  logForm(e: any) {
    console.log(e);
    return e.value;
  }

  testP() {
    console.log(this.r1);
  }

  getJsonData(): Observable<any> {
    return this.http.get<any>(this.jsonFile);
  }

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

  printScreen() {
    //Get the print button and put it into a variable
    var cargarTodos_Btn = document.getElementById("cargarTodos");
    //Set the print button visibility to 'hidden' 
    cargarTodos_Btn!.style.visibility = 'hidden';
    //Print the page content
    window.print()
    cargarTodos_Btn!.style.visibility = 'visible';

  }

  getValue(comp = 'r2') {
    //return this.jsonDataForm.get
    console.log("valor de " + comp)
    console.log(this.jsonDataForm.get(comp)?.value);
    //console.log(this.jsonDataForm.get('r3'))
    return this.jsonDataForm.get(comp)?.value;
  }

  cargarDatosJson() {
    this.http.get<any>(this.jsonFile).subscribe(response => {
      // Asegúrate de que la estructura de tu JSON coincida con la estructura esperada por tus formularios
      // Supongamos que tienes los mismos nombres de claves en tu JSON como en tus formularios

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
  
  /**
   * @param id string: id de la casilla a setear el valor
   * se busca el "rx": (r1,r2,r3) por el id, y su fila y columna corespondiente
   * se toma el dato de el objeto "jsonDataForm" que es un FormGroup
   * valores: this.jsonDataForm.value
   */
  getInputValue__tohHml(id: string) {
    const [prefix, row, col] = id.split('_');
    const rubro = prefix;
    const rowIndex = parseInt(row) - 1;
    const colIndex = parseInt(col) - 1;
    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    const value = formArray.at(rowIndex).get(`col${colIndex + 1}`)?.value;

    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement && !inputElement.disabled) {
      inputElement.value = value.toString();
    }
  }

  async getInputValue_(id: string): Promise<number> {
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    try {
      const response: any = await this.http.get(this.jsonFile).toPromise();
      const value = response[prefix][rowIndex][colJSON];
      console.log("Valor obtenido:", value);
      console.log(typeof(value));
      return value;
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      throw error;
    }

  }

  getInputValue(id: string){
    return 404
  }
  
  get() {
    this.http.get<any>(this.jsonFile).subscribe(response => {
      Object.keys(response).forEach(key => {
        // Itera sobre los elementos del JSON y agrega controles al FormArray
        response[key].forEach((item: any) => {
          console.log(item)
        });
        // console.log(`${key}:`, formArray.value);
      });
    });
  }


  /**
   * CONSOLE.LOG
   * @param id string: id de la casilla a setear el valor
   * se busca el "rx": (r1,r2,r3) por el id, y su fila y columna corespondiente
   * se toma el dato de el objeto "jsonDataForm" que es un FormGroup
   * valores: this.jsonDataForm.value
   */
  getInputValue_with_consolelog(id: string) {
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
    console.log("console.log(this.jsonDataForm)")
    console.log(this.jsonDataForm.value)


    //return this.jsonDataForm.get(rubro)?.value;
  }



  async cargarInputs() {

    try {
    
      const r1_inputs = [
        ['r1_1_1', 'r1_1_2', 'r1_1_3'],
        ['r1_2_1', 'r1_2_2', 'r1_2_3'],
        ['r1_3_1', 'r1_3_2', 'r1_3_3'],
        ['r1_4_1', 'r1_4_2', 'r1_4_3'],
        ['r1_5_1', 'r1_5_2', 'r1_5_3'],
        ['r1_6_1', 'r1_6_2', 'r1_6_3'],
        ['r1_7_1', 'r1_7_2', 'r1_7_3'],
        ['r1_8_1', 'r1_8_2', 'r1_8_3'],
        ['r1_9_1', 'r1_9_2', 'r1_9_3'],
        ['r1_10_1', 'r1_10_2', 'r1_10_3'],
        ['r1_11_1', 'r1_11_2', 'r1_11_3'],
        /*'r12_1', 'r12_2', 'r12_3',*/ // totales
      ];


      for (const fila of r1_inputs){
        console.log(`elementos de la fila: ${ fila[0] },   ${ fila[1] },   ${ fila[2] }` )
        
          let v1 = await this.getInputValue_(fila[0]);
          let v2 = await this.getInputValue_(fila[1]);
          let v3 = await this.getInputValue_(fila[2]);

          
          //let v1 = this.getInputValue(fila[0]);
          //let v2 = this.getInputValue(fila[1]);
          //let v3 = this.getInputValue(fila[2]);
          this.agregarItem_alForm('r1', v1,v2,v3);
          console.log("AGREGADOS CON EXITO:")
          console.log(v1,v2,v3);
          
          
          //this.agregarItem_alForm('r1', 404,404,404);
      }
      

    } catch (error) {
      console.log("ERROR AL OBTENER EL INPUT VAL")
    }
      
    
    

    
    

    const r2_inputs = [
      'r2_1_1',
      'r2_2_1',
      'r2_3_1',
      'r2_4_1',
      'r2_5_1',
      'r2_6_1',
      'r2_7_1',
      'r2_8_1'
    ];
    const r3_inputs = [
      'r3_1_1', 'r3_1_2', 'r3_1_3',
      'r3_2_1', 'r3_2_2', 'r3_2_3',
      'r3_3_1', 'r3_3_2', 'r3_3_3',
      'r3_4_1', 'r3_4_2', 'r3_4_3',
      'r3_5_1', 'r3_5_2', 'r3_5_3',
      'r3_6_1', 'r3_6_2', 'r3_6_3',
    ];

    const r4_inputs = [
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

    const r5_inputs = [
      'r5_1_1', 'r5_1_2',
      'r5_2_1', 'r5_2_2',
      'r5_3_1', 'r5_3_2',
      'r5_4_1', 'r5_4_2',
      'r5_5_1', 'r5_5_2',
      'r5_6_1', 'r5_6_2',
      'r5_7_1', 'r5_7_2',
      'r5_8_1', 'r5_8_2',
    ];
    const r6_inputs = [
      ['r6_1_1', 'r6_1_2'],
      ['r6_2_1', 'r6_2_2'],
      ['r6_3_1', 'r6_3_2'],
      ['r6_4_1', 'r6_4_2'],
      ['r6_5_1', 'r6_5_2'],
      ['r6_6_1', 'r6_6_2'],
      'r6_7_1', 'r6_7_2',
    ];





  }

  cerarInputs() {


    const r1_inputs = [
      ['r1_1_1', 'r1_1_2', 'r1_1_3'],
      ['r1_2_1', 'r1_2_2', 'r1_2_3'],
      ['r1_3_1', 'r1_3_2', 'r1_3_3'],
      ['r1_4_1', 'r1_4_2', 'r1_4_3'],
      ['r1_5_1', 'r1_5_2', 'r1_5_3'],
      ['r1_6_1', 'r1_6_2', 'r1_6_3'],
      ['r1_7_1', 'r1_7_2', 'r1_7_3'],
      ['r1_8_1', 'r1_8_2', 'r1_8_3'],
      ['r1_9_1', 'r1_9_2', 'r1_9_3'],
      ['r1_10_1', 'r1_10_2', 'r1_10_3'],
      ['r1_11_1', 'r1_11_2', 'r1_11_3'],
      /*'r12_1', 'r12_2', 'r12_3',*/ // totales
    ];

    const r2_inputs = [
      ['r2_1_1'],
      ['r2_2_1'],
      ['r2_3_1'],
      ['r2_4_1'],
      ['r2_5_1'],
      ['r2_6_1'],
      ['r2_7_1'],
      ['r2_8_1']
    ];
    const r3_inputs = [
      ['r3_1_1', 'r3_1_2', 'r3_1_3'],
      ['r3_2_1', 'r3_2_2', 'r3_2_3'],
      ['r3_3_1', 'r3_3_2', 'r3_3_3'],
      ['r3_4_1', 'r3_4_2', 'r3_4_3'],
      ['r3_5_1', 'r3_5_2', 'r3_5_3'],
      ['r3_6_1', 'r3_6_2', 'r3_6_3'],
    ];

    const r4_inputs = [
      ['r4_1_1'],
      ['r4_2_1'],
      ['r4_3_1'],
      ['r4_4_1'],
      ['r4_5_1'],
      ['r4_6_1'],
      ['r4_7_1'],
      ['r4_8_1'],
      ['r4_9_1'],
      ['r4_10_1']
    ];

    const r5_inputs = [
      ['r5_1_1', 'r5_1_2'],
      ['r5_2_1', 'r5_2_2'],
      ['r5_3_1', 'r5_3_2'],
      ['r5_4_1', 'r5_4_2'],
      ['r5_5_1', 'r5_5_2'],
      ['r5_6_1', 'r5_6_2'],
      ['r5_7_1', 'r5_7_2'],
      ['r5_8_1', 'r5_8_2'],
    ];
    const r6_inputs = [
      ['r6_1_1', 'r6_1_2'],
      ['r6_2_1', 'r6_2_2'],
      ['r6_3_1', 'r6_3_2'],
      ['r6_4_1', 'r6_4_2'],
      ['r6_5_1', 'r6_5_2'],
      ['r6_6_1', 'r6_6_2'],
      'r6_7_1', 'r6_7_2',
    ];

    r1_inputs.forEach((fila) => {
      this.agregarItem_alForm('r1', 0, 0, 0)
    });
    r2_inputs.forEach((fila) => {
      this.agregarItem_alForm('r2', 0, 0, 0)
    });
    r3_inputs.forEach((fila) => {
      this.agregarItem_alForm('r3', 0, 0, 0)
    });
    r4_inputs.forEach((fila) => {
      this.agregarItem_alForm('r4', 0, 0, 0)
    });
    r5_inputs.forEach((fila) => {
      this.agregarItem_alForm('r5', 0, 0, 0)
    });
    r6_inputs.forEach((fila) => {
      this.agregarItem_alForm('r6', 0, 0, 0)
    });

  }






























  
  /**
  * DEPRECATED????
  * 
  */
  loadJsonData() {

    //this.http.get<{ config: any[], data: any[] }>(this.jsonLink) // get "data" y config de type any[] dentro del json
    this.http.get<{ res: any[], r1: any[], r2: any[], r3: any[], r4: any[], r5: any[], r6: any[] }>(this.jsonFile).subscribe(response => {

      this.rubro1 = response.r1;
      console.log("response.r1[0]: ")
      console.log(response.r1[0]);
      console.log("response.r1[0].col1: ")
      console.log(response.r1[0].col1);
      this.rubro2 = response.r2;
      this.rubro3 = response.r3;
      this.rubro4 = response.r4;
      this.rubro5 = response.r5;
      this.rubro6 = response.r6;
      this.res = response.res;

      this.cargarDatosJson()
    });
  }



      
  /**
   * @param id toma un id y lo deconstruye para tomar un valor del json
   * retorna el valor del json
   */
  /*
  getInputValue(id: string): number {
    // id viene bien
    const [prefix, row, col] = id.split('_');
    console.log("EL SPLIT ES: ")
    console.log([prefix, row, col])
    const rubroSplit = prefix;
    const rowIndex = parseInt(row) - 1;
    //const colIndex = parseInt(col) - 1;
    const colJSON = "col" + col
    
    let value: number;
    this.http.get<any>(this.jsonFile).subscribe(response => {
      //console.log("ljkvblkdfvbldfvb")
      const rubroData = response[prefix];
      //console.log("r1 REsponse")
      //console.log(colJSON)
      
      
      //ejemplo:  response en r1, en 0, en col1 o... response.r1[0].col1
      const value:number = response[prefix][rowIndex][colJSON];
      console.log("getInputValue retornando :   " )
      console.log(response[prefix][rowIndex][colJSON]) 
      //resp = valueIN;
      return value
      //console.log(response.rubro[rowIndex])
    });


    return 404;


    //console.log(this.jsonObject)

    //const formArray = this.jsonDataForm.get(rubro) as FormArray;
    //const value = formArray.at(rowIndex).get(`col${colIndex + 1}`)?.value;

    /*const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement && !inputElement.disabled) {
      inputElement.value = value.toString();
    }
    //console.log("EL VALOR GET ES: " + value)
  }*/





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
