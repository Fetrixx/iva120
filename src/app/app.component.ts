import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, lastValueFrom} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms'
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserDataService} from "./services/user-data.service";


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

  infoHeader = new FormGroup({
    nroOrden: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
    ruc: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
    dv: new FormControl('', Validators.pattern("^[0-9]*$")),
    apellido1_razon: new FormControl('', Validators.required),
    apellido2: new FormControl(''),
    nombres: new FormControl(''),
    tipoDeclaracion: new FormControl('1- Declaración Jurada Original'),
    nroOrdenDeclaracion: new FormControl('', Validators.pattern("^[0-9]*$")),
    //periodoEjercicioFiscal: new FormControl(''),
    periodoEjercicioFiscal: new FormGroup({
      month: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(2)]),
      year: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]*$")])
    }),

  })

  seleccionarTipoDeclaracion(valor: string) {
    this.infoHeader.controls['tipoDeclaracion'].setValue(valor);
  }

  jsonDataForm = new FormGroup({ // array local de datos
    r1: new FormArray([]),
    r2: new FormArray([]),
    r3: new FormArray([]),
    r4: new FormArray([]),
    r5: new FormArray([]),
    r6: new FormArray([]),
    res: new FormArray([])
  })

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.calcularDatos();
    }
  }

  /**
   * Copia local de los datos del json
   */
  jsonResponse: any = null;

  logInfoHeader() {

    console.log(this.infoHeader);
    console.log(this.infoHeader.value);
  }

  /**
   * @param rubro rubro al que se añade
   * @param v1 parámetro 1
   * @param v2 parámetro 2
   * @param v3 parámetro 3
   */
  addItem(rubro: string = '', v1: any = null, v2: any = null, v3: any = null) {
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

  openSnackBar(message: string, action: string, durationTime: number = 5000) {
    this._snackBar.open(message, action, {
      duration: durationTime,
      verticalPosition: 'top'
    });
  }

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private userData: UserDataService) {
    this.cerarInputs(); // cera todos.
    console.log("infoHeader")
    console.log(this.infoHeader)
    this.cargarInputs();
  }

  cnt: number = 0;

  ngOnInit() {
    this.jsonDataForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(value => {
      console.log(`(valueChanges nro. ${this.cnt} ) Valores cambiados: `)
      console.log(value)
      this.cnt++;

      // Verificar si algún valor es una cadena vacía y reemplazarlo con 0
      this.replaceEmptyStringsWithZero();


      this.calcularDatos() // crea un loop, (desata un evento que vuelve a llamar al valueChanges.)
    })
  }

  replaceEmptyStringsWithZero() {
    const formValue = Object.keys(this.jsonDataForm.value);
    formValue.forEach((elem) => {
      //console.log(this.jsonDataForm.get(elem)?.value)
      this.jsonDataForm.get(elem)?.value.forEach((item: any, index: number) => {
        Object.keys(item).forEach((prop) => {
          if (item[prop] === '') {
            // Reemplazar cadena vacía con 0 en el json
            item[prop] = 0;
            let id = `${elem}_${index+1}_${prop.at(prop.length-1)}`
            // Reemplazar cadena vacía con 0 en el input
            this.updateControlValue(id,0, false)
            //debugger;
          }
        });
      });
    });
  }

  ngOnChanges(e: any) {
    console.log(e);
    //this.calcularDatos();
  }

  msg = ''
  firstError: boolean = false;

  getUserData(data: any) {
    console.warn(data)
    this.userData.saveUser(data).subscribe((result) => {
      console.warn(result);
    })
  }

  onSubmit(): any {
    this.firstError = false; // si no se cambia a true (con error), esta lista para enviar
    const props = Object.keys(this.infoHeader.value)
    props.forEach((prop) => {
      console.log(this.infoHeader.get(prop)?.errors) // si los valores no son cargados, llega como true
      if (this.infoHeader.get(prop)?.errors) { // si hay algun error
        if (!this.firstError) {
          this.firstError = true;
        }
        //console.log('setting firstError', prop, this.infoHeader.get(prop)?.errors)
      }

    })
    if (this.firstError) { // hay error
      this.msg = "Rellene los campos correctamente.";
      console.log(this.msg)

      this.openSnackBar(this.msg, 'OK')
      //return true
    } else {// no hay errores
      this.msg = "Enviado, no hay errores";
      console.log(this.msg)

      //this.openSnackBar(this.msg, 'OK')
    }
  }

  postData() {
    this.onSubmit();
    if (!this.firstError) { // si no hay errores
      this.msg = 'Enviado correctamente.'
      console.log(this.msg)
      //console.log(`1st err: ${this.firstError}`)
      this.openSnackBar(this.msg, 'OK',)

      this.getUserData(this.jsonDataForm.value)


      /*
      const formData = this.jsonDataForm.value;
      //const url = 'https://reqbin.com/';
      const url = ''

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      // Realiza la solicitud HTTP POST
      this.http.post(url, formData, { headers }).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          // Puedes realizar cualquier acción adicional con la respuesta del servidor aquí
          if (response === 'OK'){
            Console.warn("POST Successful")

            this.msg = 'Enviado'
            this.openSnackBar(this.msg, 'OK')
          }
        },
        error => {
          console.error('Error al enviar los datos:', error);
          this.openSnackBar(`PostError: ${error}`, 'OK')
          // Maneja el error de acuerdo a tus necesidades
        }
      );

      */

    } else {
      this.openSnackBar('Rellene los campos correctamente...', 'OK')
    }
  }

  /**
   * get data (json obj) to load the  form.
   */
  /*
  getData() {
    //this.openSnackBar('Datos obtenidos correctamente.', 'OK')
  }*/

  /**
   * Crea un log del Form completo con todos sus elementos.
   */
  logForm() {
    console.log("\n".repeat(5));
    console.log(" >>>>> JSON: ");
    console.log(this.jsonDataForm)
    console.log(" >>>>> INFORMATION HEADER: ");
    console.log(this.infoHeader);

  }

  logValues() {
    console.log("\n".repeat(5));
    console.log(" >>>>> JSON VALUES: ");
    console.log(this.jsonDataForm.value);
    console.log(" >>>>> JSON INFOHEADER: ");
    console.log(this.infoHeader.value);

  }

  rowspanSize = 3;
  rowspanHSize = 12

  print() {
    this.calcularDatos();
    this.rowspanSize = 2;
    this.rowspanHSize = 9

    setTimeout(() => {
      window.print();
    }, 0); // ajusta este valor según sea necesario
    window.onafterprint = () => {
      this.rowspanSize = 3;
      this.rowspanHSize = 12
    }
  }

  getLocalInputValue(id: string): number {
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    try {
      return this.jsonDataForm.get(prefix)?.get(rowIndex.toString())?.get(colJSON)?.value;
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      this.openSnackBar(`${error}`, "OK") // Mostrar en un snackbar msg
      throw error;
    }
  }

  async getInputValue(id: string): Promise<number> {
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    try {
      if (this.jsonResponse == null) {
        this.jsonResponse = await lastValueFrom(this.http.get(this.jsonFile)); //this.http.get(this.jsonFile).toPromise(); // CARGAR JSON
      }
      if (this.jsonResponse == null) {
        throw new Error(' Sin datos en archivo o Api (getInputValue)'); // si el json esta vacio
      }
      return this.jsonResponse[prefix][rowIndex][colJSON];
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      this.openSnackBar(`${error}`, "OK") // Mostrar en un snackbar msg
      throw error;

    }
  }

  /**
   * (UPDATE) Actualiza un FormControl previamente creado
   * @param id id de la casilla a ser controlada.
   * @param newValue valor de reemplazo
   * @param emit "false"para no emitir un evento como valueChange. su valor predefinido es emitir el valor.
   */
  updateControlValue(id: string, newValue: any, emit:any = true) {
    /*if (newValue === ''){
      newValue = 0;
    }*/
    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    //const control = formArray.at(rowIndex).get(`col${colIndex + 1}`) as FormControl;
    const control = formArray.at(rowIndex).get(colJSON) as FormControl;
    control.patchValue(newValue, {emitEvent: emit}); // or use patchValue() if you want to replace the value entirely
  }

  updateControlValueList(id: string, suma: string[], emit:boolean=true) {
    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    let total = 0;
    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    suma.forEach(id => {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colJSON = "col" + col;
      const control = formArray.at(rowIndex).get(colJSON) as FormControl;
      total += control.value;
    });
    const control = formArray.at(rowIndex).get(colJSON) as FormControl;

    control.patchValue(total, {emitEvent: emit}); // or use patchValue() if you want to replace the value entirely
  }


  updateControlValueList_resta(id: string, suma: string[], emit:boolean =true) {
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
    control.patchValue(total, {emitEvent: emit}); // or use patchValue() if you want to replace the value entirely
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
    const blob = new Blob([jsonData], {type: 'application/json'});
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
    r1_inputs: [
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
    r2_inputs: [
      ['r2_1_1'],
      ['r2_2_1'],
      ['r2_3_1'],
      ['r2_4_1'],
      ['r2_5_1'],
      ['r2_6_1'],
      ['r2_7_1'],
      ['r2_8_1']
    ],
    r3_inputs: [
      ['r3_1_1', 'r3_1_2', 'r3_1_3'],
      ['r3_2_1', 'r3_2_2', 'r3_2_3'],
      ['r3_3_1', 'r3_3_2', 'r3_3_3'],
      ['r3_4_1', 'r3_4_2', 'r3_4_3'],
      ['r3_5_1', 'r3_5_2', 'r3_5_3'],
      ['r3_6_1', 'r3_6_2', 'r3_6_3'],
    ],
    r4_inputs: [
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

    r5_inputs: [
      ['r5_1_1', 'r5_1_2'],
      ['r5_2_1', 'r5_2_2'],
      ['r5_3_1', 'r5_3_2'],
      ['r5_4_1', 'r5_4_2'],
      ['r5_5_1', 'r5_5_2'],
      ['r5_6_1', 'r5_6_2'],
      ['r5_7_1', 'r5_7_2'],
      ['r5_8_1', 'r5_8_2'],
    ],
    r6_inputs: [
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

    this.actualizarSumatoriaIndividual('r2_4_1', 1, 3) // primer total R2
    this.actualizarSumatoriaIndividual('r2_8_1', 5, 7) // 2do total R2

    this.updateControlValueList('r2_9_1', ['r2_4_1', 'r2_8_1'], false) // tarda en cargarse


    this.updateControlValueList('r3_6_3', ['r3_1_3', 'r3_3_3', 'r3_4_3', 'r3_5_3'], false)

    let r3_3_3 = this.getLocalInputValue('r3_2_3') * ((this.getLocalInputValue('r2_1_1') + this.getLocalInputValue('r2_2_1')) / this.getLocalInputValue('r2_4_1'));

    this.updateControlValue('r3_3_3', r3_3_3, false);

    this.updateControlValue('r4_1_1', (this.getLocalInputValue('r1_12_2') + this.getLocalInputValue('r1_12_3')), false)
    this.updateControlValue('r4_2_1', this.getLocalInputValue('r3_6_3'), false)
    let r4d = 0;
    let r4g = 0;
    if ((this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1')) > this.getLocalInputValue('r4_1_1')) {
      r4d = (this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1')) - this.getLocalInputValue('r4_1_1');
    } // else... 0;
    else {
      r4g = this.getLocalInputValue('r4_1_1') - (this.getLocalInputValue('r4_2_1') + this.getLocalInputValue('r4_3_1'));
    }
    this.updateControlValue('r4_4_1', r4d, false)
    if ((this.getLocalInputValue('r4_4_1') > this.getLocalInputValue('r4_5_1'))) { // inc. f, inc d - e (r4_4_1 - r4_5_1)
      this.updateControlValue('r4_6_1', (this.getLocalInputValue('r4_4_1') - this.getLocalInputValue('r4_5_1')), false)
    }
    this.updateControlValue('r4_7_1', r4g, false)
    this.updateControlValueList_resta('r4_10_1', ['r4_7_1', 'r4_8_1', 'r4_9_1'], false) // tarda en cargarse


    this.updateControlValue('r5_1_2', this.getLocalInputValue('r4_10_1'), false)
    //this.updateControlValue('r5_2_1', this.getLocalInputValue('r5_7_1'))
    this.updateControlValue('r5_6_1', (
      this.getLocalInputValue('r5_2_1') + this.getLocalInputValue('r5_3_1') + this.getLocalInputValue('r5_4_1')
    ), false)
    this.updateControlValue('r5_6_2', (
      this.getLocalInputValue('r5_1_2') + this.getLocalInputValue('r5_5_2')
    ), false)

    this.updateControlValue('r5_7_1', 0, false)
    this.updateControlValue('r5_8_2', 0, false)
    if (this.getLocalInputValue('r5_6_1') > this.getLocalInputValue('r5_6_2')) { // a favor del contribuyente
      this.updateControlValue('r5_7_1', (this.getLocalInputValue('r5_6_1') - this.getLocalInputValue('r5_6_2')), false);
      this.updateControlValue('r5_8_2', 0, false)
    } else {
      this.updateControlValue('r5_7_1', 0, false)
      this.updateControlValue('r5_8_2', (this.getLocalInputValue('r5_6_2') - this.getLocalInputValue('r5_6_1')), false);
    }

    this.replaceEmptyStringsWithZero()
  }
/*
  _replaceEmptyStringsWithZero() {

    const formValue = Object.keys(this.jsonDataForm.value);
    formValue.forEach((elem) => {
      //console.log(this.jsonDataForm.get(elem)?.value)
      // Recorrer cada elemento del FormArray
      for (const item of this.jsonDataForm.get(elem)?.value) {
        for (const prop in item) {

          if (item[prop] === '') {
            // Reemplazar cadena vacía con 0
            item[prop] = 0;
            let st = `${elem}_x_${prop.at(prop.length-1)}`
            //this.updateControlValue('', 0)
            debugger
          }
        }
      }
    })
  }*/



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
   * actualiza el valor de un campo input
   * @param id string identificadora del input destino
   * @param sumDesde se calcula una suma desde (incluye)
   * @param sumHasta se calcula una suma hasta (incluye)
   */
  actualizarSumatoriaIndividual(id: string, sumDesde: number, sumHasta: number) {
    try {
      const [rubro, row, col] = id.split('_');
      const colJson = "col" + col.toString();
      const total = this.calcularSumatoriaRubro(rubro, colJson, sumDesde, sumHasta);
      this.updateControlValue(id, total, false);
      return total;
    } catch (error) {
      console.log(`Error al actualizar sumatoria de \"${id}\"`)
      console.log(error)
      return error
    }
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



agregar separador de miles al input
manejar el post

// al cambiar un campo, se recalcula, si se deja vacio, se asigna como 0


*/
