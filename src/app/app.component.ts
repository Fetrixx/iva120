import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
// import { FormsModule } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, lastValueFrom} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {MatSnackBar} from "@angular/material/snack-bar";

//import { JsonService } from './jsonService.service';


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
  @Input() jsonFile: any = '../assets/datos2.json'; // CARGA DEL JSON (temporal)

  // jsonDataForm: FormGroup;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.calcularDatos();
    }
  }

/*
  jsonData = '';
  nroOrden = ''
  nameT = '';
  lastName1 = '';
  lastName2 = '';
  ruc = '';
  dv = '';
  seleccion:any

*/

  /**
   * Copia local de los datos del json
   */
  jsonResponse: any = null;

  logInfoHeader(){

    console.log(this.infoHeader);
    console.log(this.infoHeader.value);
  }

  infoHeader = new FormGroup({
    nroOrden: new FormControl('123456789', Validators.minLength(5)),
    ruc: new FormControl('192837465',Validators.minLength(1) ),
    dv: new FormControl('0'),
    apellido1_razon: new FormControl('Apellido1_filler'),
    apellido2: new FormControl('Apellido2_filler'),
    nombres: new FormControl('Nombre_filler'),
    nroOrdenDeclaracion: new FormControl('987654321'),
    periodoEjercicioFiscal: new FormControl('0'),
    month: new FormControl('1'),
    year: new FormControl('2024')
  })

  firstError :any;
  onSubmit(){
    const props = Object.keys(this.infoHeader.value)
    this.firstError = null
    props.forEach((prop) => {
      if (!this.firstError && this.infoHeader.get(prop)?.errors) {
        console.log('setting firstError', prop, this.infoHeader.get(prop)?.errors)
        this.firstError = prop
      }
    })
    if(this.firstError == 'nroOrden'){
      this.infoHeader.get('ruc')?.clearValidators();
      this.infoHeader.get('ruc')?.updateValueAndValidity();
      this.infoHeader.get('dv')?.clearValidators();
      this.infoHeader.get('dv')?.updateValueAndValidity();
      this.infoHeader.get('apellido1_razon')?.clearValidators();
      this.infoHeader.get('apellido1_razon')?.updateValueAndValidity();
      this.infoHeader.get('apellido2')?.clearValidators();
      this.infoHeader.get('apellido2')?.updateValueAndValidity();
      this.infoHeader.get('nombres')?.clearValidators();
      this.infoHeader.get('nombres')?.updateValueAndValidity();

    }
  }

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
  addItem(rubro: string = '', v1: any = null, v2: any = null, v3: any = null) {
    if (v1 !== null && v2 === null && v3 === null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    }
    else if (v1 !== null && v2 !== null && v3 === null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1),
        col2: new FormControl(v2)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    }
    else if (v1 !== null && v2 !== null && v3 !== null) {
      const nuevoItem = new FormGroup({
        col1: new FormControl(v1),
        col2: new FormControl(v2),
        col3: new FormControl(v3)
      });
      (this.jsonDataForm.get(rubro) as FormArray).push(nuevoItem);
    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  postData(){
    const formData = this.jsonDataForm.value;
    const url = 'https://reqbin.com/';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Realiza la solicitud HTTP POST
    this.http.post(url, formData, { headers }).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        // Puedes realizar cualquier acción adicional con la respuesta del servidor aquí
      },
      error => {
        console.error('Error al enviar los datos:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }


  constructor(private http: HttpClient,/*private jsonService: JsonService*/ private _snackBar: MatSnackBar, private fb: FormBuilder) {
    //this.addItem('r1', 111, 222, 333) // añadir un item al form
    this.cerarInputs(); // cera todos.

    console.log("infoHeader")
    console.log(this.infoHeader)
    //this.loadJsonResponse(); // carga una variable con la respuesta del json // no funca


    this.cargarInputs();



    //this.cerarInputs()

  }




  cnt: number = 0;
  ngOnInit() {
    //this.loadJsonData()
    /*this.jsonDataForm.valueChanges.forEach(value => {
      console.log(`(valueChanges ${this.cnt} ) Valores cambiados: `)
      console.log(value)
      this.cnt++;
      //this.calcularDatos()
    });
    */

    this.jsonDataForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),

    ).subscribe(value => {
      console.log(`(valueChanges nro. ${this.cnt} ) Valores cambiados: `)
      console.log(value)
      this.cnt++;

      //this.calcularDatos()
    })


    /*this.jsonDataForm.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log(`(valueChanges ${this.cnt} ) Valores cambiados: `)
      console.log(value)
      this.cnt++;

    })*/
  }


  ngOnChanges(e: any) {
    console.log(e);
    //this.calcularDatos();
  }


  /*
  logForm(e: any) {
    console.log(e);
    return e.value;
  }*/


  /**
   * Crea un log del Form completo con todos sus elementos.
   */
  logForm() {

    console.log(" >>>>> JSON: ");
    console.log(this.jsonDataForm)


    console.log(" >>>>> INFORMATION HEADER: ");
    console.log(this.infoHeader);
    /*

    console.log(this.nameT);
    console.log(this.lastName1);
    console.log(this.lastName2);
    console.log(this.ruc);
    jsonData = '';
    nroOrden = ''
    nameT = '';
    lastName1 = '';
    lastName2 = '';
    ruc = '';
    dv = '';

    jsonResponse: any = null;

    this.jsonData = JSON.stringify(this.jsonDataForm.value);
    */
  }


  /**
   * @param id string: id de la casilla a setear el valor
   * se busca el "rx": (r1,r2,r3) por el id, y su fila y columna corespondiente
   * se toma el dato de el objeto "jsonDataForm" que es un FormGroup
   * valores: this.jsonDataForm.value
   */

  /**
   *
   * @param id id del valor a buscar
   * @returns retorna el valor del item asignado al ID correspondiente
   */

  rowspanSize = 3;
  rowspanHSize = 12
  print(){
    this.calcularDatos();
    this.rowspanSize = 2;
    this.rowspanHSize = 9


    setTimeout(() => {
      window.print();
    },0); // ajusta este valor según sea necesario

    window.onafterprint = () =>{
      this.rowspanSize = 3;
      this.rowspanHSize = 12
    }

  }

  getLocalInputValue(id: string):number{
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    try {
      //console.log("json Data Form")

      //console.log(this.jsonResponse)
      //console.log(this.jsonResponse[prefix][rowIndex])

      const val = this.jsonDataForm.get(prefix)?.get(rowIndex.toString())?.get(colJSON)?.value
      //console.log(`FUNCA... ${id}: ${val}, type: ${typeof (val)}`)

      return val;
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      this.openSnackBar(`${error}`, "ok.") // Mostrar en un snackbar msg
      throw error;


    }

  }

  async getInputValue(id: string): Promise<number> {
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    try {
      if (this.jsonResponse == null){
        this.jsonResponse = await lastValueFrom(this.http.get(this.jsonFile)); //this.http.get(this.jsonFile).toPromise(); // CARGAR JSON
      }
      if (this.jsonResponse == null){
        throw new Error(' Sin datos en archivo o Api (getInputValue)'); // si el json esta vacio
      }

      //console.log(this.jsonResponse[prefix][rowIndex][colJSON])
      return this.jsonResponse[prefix][rowIndex][colJSON];
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      this.openSnackBar(`${error}`, "ok.") // Mostrar en un snackbar msg
      throw error;

    }

  }


  /**
   * (UPDATE) Actualiza un FormControl previamente creado
   * @param id id de la casilla a ser controlada.
   * @param newValue valor de reemplazo
   */
  updateControlValue(id: string, newValue: any) {

    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    //const control = formArray.at(rowIndex).get(`col${colIndex + 1}`) as FormControl;
    const control = formArray.at(rowIndex).get(colJSON) as FormControl;
    control.patchValue(newValue); // or use patchValue() if you want to replace the value entirely
  }


  updateControlValueList(id: string, suma: string[]) {

    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    let total = 0;

    const formArray = this.jsonDataForm.get(rubro) as FormArray;


    suma.forEach(id => {
      //console.log(id)
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colJSON = "col" + col;

      const control = formArray.at(rowIndex).get(colJSON) as FormControl;
      //console.log(`VALOR DL ITEM A SUMAR: ${control.value}`)
      total += control.value;
    });

    const control = formArray.at(rowIndex).get(colJSON) as FormControl;
    control.patchValue(total); // or use patchValue() if you want to replace the value entirely
  }


  updateControlValueList_resta(id: string, suma: string[]) {

    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    let total = 0;

    const formArray = this.jsonDataForm.get(rubro) as FormArray;


    suma.forEach((id, index) => {
      const [prefix, row, col] = id.split('_');
      //const rubro = prefix
      const rowIndex = parseInt(row) - 1;
      const colJSON = "col" + col;

      const control = formArray.at(rowIndex).get(colJSON) as FormControl;
      if (index === 0) {
        total = control.value;
      } else {
        total -= control.value;
      }

    });
    const control = formArray.at(rowIndex).get(colJSON) as FormControl;
    control.patchValue(total); // or use patchValue() if you want to replace the value entirely
  }


  exportJson() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year = now.getFullYear().toString();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    let ampm = parseInt(hours) < 12 ? 'AM' : 'PM';
    const fileName = `IVA_120_v4_${day}-${month}-${year}__${hours}.${minutes}.${seconds}_${ampm}.json`;
    const jsonData = JSON.stringify(this.jsonDataForm.value, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }





  inputsArray = {
    r1_inputs : [
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
    ],
    r2_inputs : [
      ['r2_1_1'],
      ['r2_2_1'],
      ['r2_3_1'],
      ['r2_4_1'],
      ['r2_5_1'],
      ['r2_6_1'],
      ['r2_7_1'],
      ['r2_8_1']
    ],
     r3_inputs : [
      ['r3_1_1', 'r3_1_2', 'r3_1_3'],
      ['r3_2_1', 'r3_2_2', 'r3_2_3'],
      ['r3_3_1', 'r3_3_2', 'r3_3_3'],
      ['r3_4_1', 'r3_4_2', 'r3_4_3'],
      ['r3_5_1', 'r3_5_2', 'r3_5_3'],
      ['r3_6_1', 'r3_6_2', 'r3_6_3'],
    ],
    r4_inputs : [
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
    ],

    r5_inputs : [
      ['r5_1_1', 'r5_1_2'],
      ['r5_2_1', 'r5_2_2'],
      ['r5_3_1', 'r5_3_2'],
      ['r5_4_1', 'r5_4_2'],
      ['r5_5_1', 'r5_5_2'],
      ['r5_6_1', 'r5_6_2'],
      ['r5_7_1', 'r5_7_2'],
      ['r5_8_1', 'r5_8_2'],
    ],
    r6_inputs : [
      ['r6_1_1', 'r6_1_2'],
      ['r6_2_1', 'r6_2_2'],
      ['r6_3_1', 'r6_3_2'],
      ['r6_4_1', 'r6_4_2'],
      ['r6_5_1', 'r6_5_2'],
      ['r6_6_1', 'r6_6_2'],
      ['r6_7_1', 'r6_7_2'],
    ]
  }


  /**
   * carga los valores del json en las casillas (posteriormente usar solamente la variable local)
   */
  async cargarInputs() {

    try {

      for (const fila of this.inputsArray.r1_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }

      }

    } catch (error) {
      console.log("Error al cargar los inputs R1")
      console.log(error)
    }

    try {
      for (const fila of this.inputsArray.r2_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }
      }
    } catch (error) {
      console.log("Error al cargar los inputs R2")
      console.log(error)
    }

    try {


      for (const fila of this.inputsArray.r3_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }
      }
    } catch (error) {
      console.log("Error al cargar los inputs R3")
      console.log(error)
    }

    try {
      for (const fila of this.inputsArray.r4_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }
      }
    } catch (error) {
      console.log("Error al cargar los inputs R4")
      console.log(error)
    }



    try {

      for (const fila of this.inputsArray.r5_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }
      }
    } catch (error) {
      console.log("Error al cargar los inputs R5")
      console.log(error)
    }



    try {

      for (const fila of this.inputsArray.r6_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          let valor = await this.getInputValue(fila[columna]);
          this.updateControlValue(fila[columna], valor);
        }
      }
    } catch (error) {
      console.log("Error al cargar los inputs R6")
      console.log(error)
    }

    this.calcularDatos()

  }


  /**
   * Crea nuevos objetos en el Form, les asigna un valor 0, a ser cambiados en un update
   */
  cerarInputs() {

    /**
     * cantidad de casillas a rellenar en cada rubro
     */
    const items = {
      r1: 12,
      r2: 9,
      r3: 6,
      r4: 10,
      r5: 8,
      r6: 7
    }

    for (let i = 0; i < items.r1; i++) {
      this.addItem('r1', 0, 0, 0)
    }
    for (let i = 0; i < items.r2; i++) {
      this.addItem('r2', 0)
    }
    for (let i = 0; i < items.r3; i++) {
      this.addItem('r3', 0, 0, 0)
    }
    for (let i = 0; i < items.r4; i++) {
      this.addItem('r4', 0)
    }
    for (let i = 0; i < items.r5; i++) {
      this.addItem('r5', 0, 0)
    }
    for (let i = 0; i < items.r6; i++) {
      this.addItem('r6', 0, 0)
    }
  }

  _updateFormsToZero() {

    try {

      for (const fila of this.inputsArray.r1_inputs) {
        //console.log(`elementos de la fila: ${fila[0]},   ${fila[1]},   ${fila[2]}`)
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }

      }
    } catch (error) {
      console.log("Error al cerar valores R1")
      console.log(error)
    }

    try {

      for (const fila of this.inputsArray.r2_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R2")
      console.log(error)
    }

    try {

      for (const fila of this.inputsArray.r3_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R3")
      console.log(error)
    }

    try {

      for (const fila of this.inputsArray.r4_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R4")
      console.log(error)
    }

    try {

      for (const fila of this.inputsArray.r5_inputs) {
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R5")
      console.log(error)
    }

    try {

      for (const fila of this.inputsArray.r6_inputs) {
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R6")
      console.log(error)
    }


  }




  calcularDatos() {

    const r1_total = [
      'r1_12_1', 'r1_12_2', 'r1_12_3'
    ]
    r1_total.forEach(id => {
      this.actualizarSumatoriaIndividual(id, 1, 11)
    })

    //this.actualizarSumatoria(r1_total)
    this.actualizarSumatoriaIndividual('r2_4_1', 1, 3) // primer total R2
    this.actualizarSumatoriaIndividual('r2_8_1', 5, 7) // 2do total R2
    //this.updateControlValue('r2_9_1',(await r2_t + await r2_t2)) // 3er total R2
    this.updateControlValueList('r2_9_1', ['r2_4_1', 'r2_8_1']) // tarda en cargarse


    this.updateControlValueList('r3_6_3', ['r3_1_3','r3_3_3','r3_4_3','r3_5_3'])

    let r3_3_3 = this.getLocalInputValue('r3_2_3') * (  (this.getLocalInputValue('r2_1_1') + this.getLocalInputValue('r2_2_1')) / this.getLocalInputValue('r2_4_1')  ) ;
    //((this.getLocalInputValue(('r2_1_1') + this.getLocalInputValue('r2_2_1')) /  this.getLocalInputValue('r2_4_1')))
    //console.log(`  valor r3-3-3: ${r3_3_3}`);
    this.updateControlValue('r3_3_3', r3_3_3);



    //this.updateControlValueList('r4_1_1', ['r1_12_2','r1_12_3'])

    //this.updateControlValueList('r4_1_1', ['r1_1_1'])

    this.updateControlValue('r4_1_1', ( this.getLocalInputValue('r1_12_2') + this.getLocalInputValue('r1_12_3') ))
    this.updateControlValue('r4_2_1', this.getLocalInputValue('r3_6_3'))
    let r4d = 0;
    let r4g= 0;
    if ((this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1')) > this.getLocalInputValue('r4_1_1')){
      r4d = (this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1')) - this.getLocalInputValue('r4_1_1');
    } // else... 0;
    else{
      r4g = this.getLocalInputValue('r4_1_1') - (this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1'));
    }
    this.updateControlValue('r4_4_1', r4d)
    if ((this.getLocalInputValue('r4_4_1') > this.getLocalInputValue('r4_5_1'))){ // inc. f, inc d - e (r4_4_1 - r4_5_1)
      this.updateControlValue('r4_6_1', (this.getLocalInputValue('r4_4_1')- this.getLocalInputValue('r4_5_1')))
    }
    this.updateControlValue('r4_7_1', r4g)
    this.updateControlValueList_resta('r4_10_1', ['r4_7_1', 'r4_8_1', 'r4_9_1']) // tarda en cargarse


    this.updateControlValue('r5_1_2', this.getLocalInputValue('r4_10_1'))
    //this.updateControlValue('r5_2_1', this.getLocalInputValue('r5_7_1'))
    this.updateControlValue('r5_6_1', (
      this.getLocalInputValue('r5_2_1') + this.getLocalInputValue('r5_3_1') + this.getLocalInputValue('r5_4_1')
    ))
    this.updateControlValue('r5_6_2', (
      this.getLocalInputValue('r5_1_2') + this.getLocalInputValue('r5_5_2')
    ))

    this.updateControlValue('r5_7_1',0)
    this.updateControlValue('r5_8_2',0)
    if ( this.getLocalInputValue('r5_6_1') > this.getLocalInputValue('r5_6_2')  ){ // a favor del contribuyente
      this.updateControlValue('r5_7_1', (this.getLocalInputValue('r5_6_1') - this.getLocalInputValue('r5_6_2')));
      this.updateControlValue('r5_8_2',0)
    } else{
      this.updateControlValue('r5_7_1',0)
      this.updateControlValue('r5_8_2', (this.getLocalInputValue('r5_6_2') - this.getLocalInputValue('r5_6_1')));
    }




    //console.log(this.getLocalInputValue('r3_6_3'));
    //console.log(this.getLocalInputValue('r3_6_3'))



  }

  /**
   * Suma los datos de una columna del rubroX, colX, desde la fila x hasta la fila y.
   * @param rubro
   * @param col
   * @param sumDesde se calcula una suma desde (incluye)
   * @param sumHasta se calcula una suma hasta (incluye)
   * @returns
   */
  calcularSumatoriaRubro(rubro: string, col: string, sumDesde: number, sumHasta: number) {
    let sumatoria = 0;
    const rubroFormArray = this.jsonDataForm.get(rubro) as FormArray;
    let cnt = sumDesde - 1;
    rubroFormArray.controls.forEach((control, index) => {
      if (index >= cnt) {
        if (cnt < sumHasta) {
          sumatoria += control.get(col)!.value || 0;
        }
        cnt++;
      }

    });
    return sumatoria;
  }

  /**
   * (MULTIPLES VALORES A LA VEZ)
   * Actualiza el valor de los campos "total"(MULTIPLES VALORES A LA VEZ)
   * Actualiza el valor de los campos "total"
   * @param inputsTotal  inputsTotal: string array de los valores considerados "total"
   */
  async actualizarSumatoria(inputsTotal: string[]) {
    try {
      let cols: string[] = [];
      inputsTotal.forEach(inp => {
        const [rubro, row, col] = inp.split('_');
        const colJson = "col" + col.toString();
        cols.push(colJson)
      });

      const T1 = await this.calcularSumatoriaRubro('r1', 'col1', 0, 11);
      const T2 = await this.calcularSumatoriaRubro('r1', 'col2', 0, 11);
      const T3 = await this.calcularSumatoriaRubro('r1', 'col3', 0, 11);
      this.updateControlValue(inputsTotal[0], T1);
      this.updateControlValue(inputsTotal[1], T2);
      this.updateControlValue(inputsTotal[2], T3);

    } catch (error) {
      console.log("Error al actualizar sumatoria R1")
      console.log(error)
    }
    ///this.jsonDataForm.get('res')!.patchValue({ r1_12_1: sumatoria });
  }




  /**
   * actualiza el valor de un campo input
   * @param id string identificadora del input destino
   * @param sumDesde se calcula una suma desde (incluye)
   * @param sumHasta se calcula una suma hasta (incluye)
   */
  actualizarSumatoriaIndividual(id: string, sumDesde: number, sumHasta: number) {
    try {
      let cols: string[] = [];
      const [rubro, row, col] = id.split('_');
      const colJson = "col" + col.toString();
      const total =  this.calcularSumatoriaRubro(rubro, colJson, sumDesde, sumHasta);
      this.updateControlValue(id, total);
      return total;
    } catch (error) {
      console.log(`Error al actualizar sumatoria de \"${id}\"`)
      console.log(error)
      return error
    }
    ///this.jsonDataForm.get('res')!.patchValue({ r1_12_1: sumatoria });
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


Debounce time para cargar los inputs?
debounce time para los cambios en input

 al dar a calcular varias veces se incrementa el valor en vez de calcularlo desde 0. ---

 localStorage para acceder al json?, mejora el tiempo de inicializacion?


setValue reemplazado por patchValue


https://stackblitz.com/edit/angular-ren9gd?file=src%2Fapp%2Finput-error-state-matcher-example.html

buscar snackbar: snackbar para errores - YA

al intentar "calcular valores"en valueChanges, al calcular se crea un evento que reacciona al valueChange, y esto crea un loop infinito. (en ngOnInit)

*/
