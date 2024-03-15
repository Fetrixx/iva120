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


  jsonDataForm_OLD = new FormGroup({
    r1: new FormGroup({ // values here
      col1: new FormControl(1123),
      col2: new FormControl(2),
      col3: new FormControl(3),
      col4: new FormControl(4),
    })
    /*,
    r2: this.formBuilder.array([]),
    r3: this.formBuilder.array([]),
    r4: this.formBuilder.array([]),
    r5: this.formBuilder.array([]),
    r6: this.formBuilder.array([]),
    res: this.formBuilder.array([])*/
  });
  /*
  jsonDataForm = new FormGroup({
    r1: new FormGroup({ // values here
      col1: new FormControl(1123),
      col2: new FormControl(2),
      col3: new FormControl(3),
      col4: new FormControl(4),
    })
    ,
    //r2: this.formBuilder.array([]),
    //r3: this.formBuilder.array([]),
    //r4: this.formBuilder.array([]),
    //r5: this.formBuilder.array([]),
    //r6: this.formBuilder.array([]),
    //res: this.formBuilder.array([])
  });*/





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
    /*const nuevoItem = new FormGroup({
      col1: new FormControl(v1),
      col2: new FormControl(v2),
      col3: new FormControl(v3),
    });
    (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    */

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
    //this.cerarInputs(); // cera todos.
    this.cargarInputs(); // 4242 , tiene que ser del  json

    //this.cerarInputs()

    //this.createJsonObj() // crea un objeto espejo al json

    // this.
  }



  /**
   * Crea un objeto espejo al json que se le da
   * @param obj: objeto 
   * @param jsonLink: link al json 
   */
  createJsonObj(obj: any, jsonLink: string) {
    this.jsonService.getAllData(jsonLink)
      .subscribe(data => {
        if (data) {
          obj = data
          console.log("Json object: ")
          console.log(obj)
          console.log("type: ")
          console.log(typeof (obj))

          //console.log("OBJ: ")
          // obj.res[0].col1 // como acceder al objeto correspondiente a r_1_1
          //console.log(obj.res[0].col1)
        }
      });


  }

  ngOnInit() {
    //this.loadJsonData()
    this.jsonDataForm.valueChanges.forEach(value => console.log(value));

    this.addItem();


    /*this.http.get<any>(this.jsonFile).subscribe(response => {
      Object.keys(response).forEach(key => {
        // Obtén el FormArray correspondiente
        const formArray = this.jsonDataForm.get(key) as FormArray;

        // Itera sobre los elementos del JSON y agrega controles al FormArray
        response[key].forEach((item: any) => {
          const formGroup = this.createFormGroup(item);
          formArray.push(formGroup);
        });
        // console.log(`${key}:`, formArray.value);
      });
    });
    console.log("El formArray (copia de json ) es:")
    console.log(this.formArray)
    */

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
  /*
    get r1() {
      return this.jsonDataForm.get('r1') as FormArray;
    }
  
    get subr1(): FormControl {
      // return this.r1.at(0).get('col1') as FormControl;
      return this.r1.controls.at(0) as FormControl;
    }*/

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

  //jsonObject = this.getJsonData();

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




  createFormGroup(item: any): FormGroup {
    const formGroup = this.formBuilder.group({});
    Object.keys(item).forEach(key => {
      formGroup.addControl(key, this.formBuilder.control(item[key]));
    });
    return formGroup;
  }

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


  /**
   * DEPRECATED
   */
  cargarTodos() {
    this.cargarValores_r1();
    this.cargarValores_r2();
    this.cargarValores_r3();
    this.cargarValores_r4();
    this.cargarValores_r5();
    this.cargarValores_r6();
    this.calculos_grid();
  }




  /**
   * Calcula los campos totales
   */
  calculos_grid() {
    // Totales R1: 'r12_1', 'r12_2', 'r12_3'
    const r1_t3 = [
      'r1_3', 'r1_8_3'
    ]
    // Totales R2: 'r2_4_1', 'r2_8_1', 'r2_9_1'
    const r2_t1 = [
      'r2_1_1', 'r2_2_1', 'r2_3_1'
    ]

    r1_t3.forEach((id) => {
      const r1_t3_O = (<HTMLInputElement>document.getElementById('r12_3'));
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
  /*
    get r1Control() {
      return (this.jsonDataForm.get('r1') as FormArray).controls[0].get('col1');
    }*/

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

  /*
    createJsonObj(obj: any, jsonLink:string) {
      this.jsonService.getAllData(jsonLink)
        .subscribe(data => {
          if (data) {
            obj = data
            console.log("Json object: ")
            console.log(obj)
            console.log("type: ")
            console.log(typeof(obj))
  
            //console.log("OBJ: ")
            // obj.res[0].col1 // como acceder al objeto correspondiente a r_1_1
            //console.log(obj.res[0].col1)
          }
        });
     
        
    }
  */

    
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

  async getInputValue(id: string): Promise<number> {
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



  cargarInputs() {


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

    r1_inputs.forEach( (fila) => {
      let v1, v2, v3, v4: number;
      for (let columna = 0; columna < fila.length; columna++) {

        /*  if (columna === 0){
          //v1 = this.getInputValue(fila[columna]);
          
          console.log(this.getInputValue(fila[columna]))
        }*/

          //console.log("COLUMNA NRO: " + columna)
        if (columna === 0) {
          //console.log(r1_inputs[fila][columna])
          //console.log(this.getInputValue(r1_inputs[fila][columna]))
          //console.log("Si columna es 1, entonces item es: ")
          //console.log()
          //this.getInputValue(fila[columna])
          //v1 = this.getInputValue(fila[columna]);
          console.log("Si columna es 1, entonces item es: ")
          v1 =  this.getInputValue(fila[columna]);
          console.log(v1)
        }
        else if (columna === 1) {
          //v2 = this.getInputValue(fila[columna]);
          v2 =  this.getInputValue(fila[columna]);
        }
        else if (columna === 2) {
          v3 =  this.getInputValue(fila[columna]);
        }


      }
    

      this.agregarItem_alForm('r1', v1, v2, v3)
      //this.agregarItem_alForm('r1', 101, 101, 101)
      console.log("this.agregarItem_alForm('r1',v1,v2,v3): ")
      console.log(v1, v2, v3)
    }
    );
    //debugger
    /*
      for (let fila = 0; fila < 3; fila++) {
      let v1,v2,v3,v4:number
      for (let columna = 0; columna < 3; columna++) {
        if (columna === 0) {
          console.log(r1_inputs[fila][columna])
          console.log(this.getInputValue(r1_inputs[fila][columna]))
          v1 = this.getInputValue(r1_inputs[fila][columna]);
        }
        else if (columna === 1) {
          v2 = this.getInputValue(r1_inputs[fila][columna]);
        }
        else if (columna === 3) {
          v3 = this.getInputValue(r1_inputs[fila][columna]);
        }
      }
      this.agregarItem_alForm('r1',v1,v2,v3)
      console.log("this.agregarItem_alForm('r1',v1,v2,v3): ")
      console.log(v1,v2,v3)
      
    }*/

    /*
    r1_inputs.forEach((fila) => {
      const v1,v2;
      fila.forEach((columna) => {
        if (columna === 0)
        
      });
      this.agregarItem_alForm('r1',this.getInputValue('r1_1'),222,333)

    });
    */



    //console.log(r1_inputs[0])
    //debugger

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




    /*
    this.agregarItem_alForm('r1',this.getInputValue('r1_1'),222,333)
    r1_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    r2_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    r3_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    r4_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    r5_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    r6_inputs.forEach((id) => {
      this.getInputValue(id)
    });
    */

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
   * DEPRECATED
   */
  cargarValores_r1() {
    // Define un arreglo con los IDs de tus inputs
    const inputIds = [
      'r1_1', 'r1_2', 'r1_3',
      'r1_2_1', 'r1_2_2', 'r1_2_3',
      'r1_3_1', 'r1_3_2', 'r1_3_3',
      'r1_4_1', 'r1_4_2', 'r1_4_3',
      'r1_5_1', 'r1_5_2', 'r1_5_3',
      'r1_6_1', 'r1_6_2', 'r1_6_3',
      'r1_7_1', 'r1_7_2', 'r1_7_3',
      'r1_8_1', 'r1_8_2', 'r1_8_3',
      'r1_9_1', 'r1_9_2', 'r1_9_3',
      'r10_1', 'r10_2', 'r10_3',
      'r11_1', 'r11_2', 'r11_3',
      /*'r12_1', 'r12_2', 'r12_3',*/ // totales
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

  /**
   * DEPRECATED
   */
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
  /**
   * DEPRECATED
   */
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
  /**
   * DEPRECATED
   */
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
      /*'r12_1', 'r12_2', 'r12_3',*/ // totales
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

  /**
   * DEPRECATED
   */
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
  /**
   * DEPRECATED
   */
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

  /**
   * DEPRECATED
   */
  cargarValores_inputR1123() {
    // Define un arreglo con los IDs de tus inputs
    const inputIds = [
      'r1_1', 'r1_2', 'r1_3',
      'r1_2_1', 'r1_2_2', 'r1_2_3',
      'r1_3_1', 'r1_3_2', 'r1_3_3',
      'r1_4_1', 'r1_4_2', 'r1_4_3',
      'r1_5_1', 'r1_5_2', 'r1_5_3',
      'r1_6_1', 'r1_6_2', 'r1_6_3',
      'r1_7_1', 'r1_7_2', 'r1_7_3',
      'r1_8_1', 'r1_8_2', 'r1_8_3',
      'r1_9_1', 'r1_9_2', 'r1_9_3',
      'r10_1', 'r10_2', 'r10_3',
      'r11_1', 'r11_2', 'r11_3',
      /*'r12_1', 'r12_2', 'r12_3',*/ // totales
    ];

    // Recorre los IDs y asigna los valores usando el método retVal
    inputIds.forEach((id) => {
      this.getInputValue(id)
    });

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

  cargarValores_inputR1() {
    // Define un arreglo con los IDs de los inputs
    const inputIds = [
      'r1_1', 'r1_2', 'r1_3',
      'r1_2_1', 'r1_2_2', 'r1_2_3',
      'r1_3_1', 'r1_3_2', 'r1_3_3',
      'r1_4_1', 'r1_4_2', 'r1_4_3',
      'r1_5_1', 'r1_5_2', 'r1_5_3',
      'r1_6_1', 'r1_6_2', 'r1_6_3',
      'r1_7_1', 'r1_7_2', 'r1_7_3',
      'r1_8_1', 'r1_8_2', 'r1_8_3',
      'r1_9_1', 'r1_9_2', 'r1_9_3',
      'r10_1', 'r10_2', 'r10_3',
      'r11_1', 'r11_2', 'r11_3',
      /*'r12_1', 'r12_2', 'r12_3',*/ // totales
    ];

    // Recorre los IDs y asigna los valores 
    inputIds.forEach((id) => {
      this.getInputValue(id)
    });

  }

  cargarValores_inputR2() {
    // Define un arreglo con los IDs de los inputs
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


  /**
   * @param e rubro.
   * muestra valores en consola.
   */
  obtenerElValor(e: string) {
    console.log("this.jsonDataForm.get(e)?.value[0].col1: ")
    console.log(this.jsonDataForm.get(e)?.value[0].col1) // obtener el valor col1, r1_1
    console.log("this.jsonDataForm.get(e)?.value[0]: ")
    console.log(this.jsonDataForm.get(e)?.value[0]) // obtener el valor col1, r1_1
  }

  /**
   * 
   * @param rubro indica el rubro "r1, r2, r3" tal como: 'r1'
   * @returns objeto del rubro con todos sus items
   */
  getData(rubro: string) {
    console.log("Rubro: " + rubro)
    console.log(this.jsonDataForm.get(rubro)?.value) // object
    return this.jsonDataForm.get(rubro)?.value;
  }

  /**
   * @param comp "Rubro", puede ser r1, r2, r3, etc. 
   * @param value valor por el que se reemplazara el rubro seleccionado
   * reemplaza el elemento completo, no solo un elemento en el array
   */
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
