
import { Component, ElementRef, ViewChild, Input, OnInit, OnChanges, HostListener } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, debounceTime, distinctUntilChanged, lastValueFrom, switchMap, timestamp } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
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
  @Input() jsonFile: any = '../assets/datos.json'; // CARGA DEL JSON (temporal)
  formattedValue: string = '';
  // jsonDataForm: FormGroup;
  
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.calcularDatos();
    }
  }

   // Función para formatear el valor con separadores de miles
   formatNumber(value: string): void {
    // Eliminar todos los puntos y comas del valor
    value = value.replace(/[.,]/g, '');

    // Formatear el valor con puntos como separadores de miles
    this.formattedValue = parseFloat(value).toLocaleString('es-ES');
  }

  formArray = new FormArray([]);

  jsonData = '';
  nameT = '';
  lastName1 = '';
  lastName2 = '';
  ruc = '';
  response: any;



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

  constructor(private http: HttpClient, private decimalPipe: DecimalPipe, private formBuilder: FormBuilder, /*private jsonService: JsonService*/) {
    //this.addItem('r1', 111, 222, 333) // añadir un item al form
    this.cerarInputs(); // cera todos.

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

  get r1() {
    return this.jsonDataForm.get('r1');
  }

  get form() {
    return this.jsonDataForm
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
    console.log(this.jsonDataForm);
    console.log(this.nameT);
    console.log(this.lastName1);
    console.log(this.lastName2);
    console.log(this.ruc);
    this.jsonData = JSON.stringify(this.jsonDataForm.value);
  }

  testP() {
    console.log(this.r1);
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

  getValue(comp = 'r2') {
    //return this.jsonDataForm.get
    console.log("valor de " + comp)
    console.log(this.jsonDataForm.get(comp)?.value);
    //console.log(this.jsonDataForm.get('r3'))
    return this.jsonDataForm.get(comp)?.value;
  }

  cargarDatosJson() {
    this.http.get<any>(this.jsonFile).subscribe(response => {
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

  /**
   * 
   * @param id id del valor a buscar
   * @returns retorna el valor del item con el id correspondiente
   */
  async getInputValue(id: string): Promise<number> {
    const [prefix, row, col] = id.split('_');
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;

    try {
      if (this.response == null)
        this.response = await lastValueFrom(this.http.get(this.jsonFile)); //this.http.get(this.jsonFile).toPromise();
      if (this.response == null)
        throw new Error(' Sin datos en archivo o Api');

      const value = this.response[prefix][rowIndex][colJSON];
      //console.log("Valor obtenido:", value);
      //console.log(typeof(value));
      return value;
    } catch (error) {
      console.error("Error al obtener el valor:", error);
      // Puedes manejar el error como prefieras, por ejemplo, lanzando una excepción
      throw error;
      // Mostrar en un snackbar msg
    }

  }

  getInputValue_TEMP(id: string) {
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
   * (.UPDATE) Actualiza un FormControl previamente creado 
   * @param rubro r1, r2,r3...
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


  updateControlValueList(id: string, suma:string[]) {

    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    let total = 0;
    
    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    

    suma.forEach(id=> {
      const [prefix, row, col] = id.split('_');
      const rowIndex = parseInt(row) - 1;
      const colJSON = "col" + col;

      const control = formArray.at(rowIndex).get(colJSON) as FormControl;
      total += control.value;
    });

    const control = formArray.at(rowIndex).get(colJSON) as FormControl;
    control.patchValue(total); // or use patchValue() if you want to replace the value entirely
  }


  updateControlValueList_resta(id: string, suma:string[]) {

    const [prefix, row, col] = id.split('_');
    const rubro = prefix
    const rowIndex = parseInt(row) - 1;
    const colJSON = "col" + col;
    let total = 0;
    
    const formArray = this.jsonDataForm.get(rubro) as FormArray;
    

    suma.forEach((id, index)=> {
      const [prefix, row, col] = id.split('_');
      //const rubro = prefix
      const rowIndex = parseInt(row) - 1;
      const colJSON = "col" + col;

      const control = formArray.at(rowIndex).get(colJSON) as FormControl;
      if (index === 0){
        total = control.value;
      } else{
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
    let fileName = ''
    fileName = `IVA_120_v4_${day}-${month}-${year}__${hours}.${minutes}.${seconds}_${ampm}.json`;
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

      for (const fila of r1_inputs) {

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
      for (const fila of r2_inputs) {

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
      const r3_inputs = [
        ['r3_1_1', 'r3_1_2', 'r3_1_3'],
        ['r3_2_1', 'r3_2_2', 'r3_2_3'],
        ['r3_3_1', 'r3_3_2', 'r3_3_3'],
        ['r3_4_1', 'r3_4_2', 'r3_4_3'],
        ['r3_5_1', 'r3_5_2', 'r3_5_3'],
        ['r3_6_1', 'r3_6_2', 'r3_6_3'],
      ];

      for (const fila of r3_inputs) {

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
      for (const fila of r4_inputs) {

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
      for (const fila of r5_inputs) {

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
      const r6_inputs = [
        ['r6_1_1', 'r6_1_2'],
        ['r6_2_1', 'r6_2_2'],
        ['r6_3_1', 'r6_3_2'],
        ['r6_4_1', 'r6_4_2'],
        ['r6_5_1', 'r6_5_2'],
        ['r6_6_1', 'r6_6_2'],
        ['r6_7_1', 'r6_7_2'],
      ];
      for (const fila of r6_inputs) {

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
   * Crea nuevos objetos en el Form,  les asigna un valor 0, a ser cambiados en un update
   */
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
      ['r1_12_1', 'r1_12_2', 'r1_12_3'], // total
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
      ['r2_8_1'],
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
      this.addItem('r1', 0, 0, 0)
    });
    r2_inputs.forEach((fila) => {
      this.addItem('r2', 0)
    });
    r3_inputs.forEach((fila) => {
      this.addItem('r3', 0, 0, 0)
    });
    r4_inputs.forEach((fila) => {
      this.addItem('r4', 0)
    });
    r5_inputs.forEach((fila) => {
      this.addItem('r5', 0, 0)
    });
    r6_inputs.forEach((fila) => {
      this.addItem('r6', 0, 0)
    });

  }

  updateFormsToZero() {

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




      for (const fila of r1_inputs) {
        console.log(`elementos de la fila: ${fila[0]},   ${fila[1]},   ${fila[2]}`)
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }

      }
    } catch (error) {
      console.log("Error al cerar valores R1")
      console.log(error)
    }

    try {
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
      for (const fila of r2_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R2")
      console.log(error)
    }

    try {
      const r3_inputs = [
        ['r3_1_1', 'r3_1_2', 'r3_1_3'],
        ['r3_2_1', 'r3_2_2', 'r3_2_3'],
        ['r3_3_1', 'r3_3_2', 'r3_3_3'],
        ['r3_4_1', 'r3_4_2', 'r3_4_3'],
        ['r3_5_1', 'r3_5_2', 'r3_5_3'],
        ['r3_6_1', 'r3_6_2', 'r3_6_3'],
      ];

      for (const fila of r3_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R3")
      console.log(error)
    }

    try {
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
      for (const fila of r4_inputs) {

        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R4")
      console.log(error)
    }

    try {
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
      for (const fila of r5_inputs) {
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R5")
      console.log(error)
    }

    try {
      const r6_inputs = [
        ['r6_1_1', 'r6_1_2'],
        ['r6_2_1', 'r6_2_2'],
        ['r6_3_1', 'r6_3_2'],
        ['r6_4_1', 'r6_4_2'],
        ['r6_5_1', 'r6_5_2'],
        ['r6_6_1', 'r6_6_2'],
        ['r6_7_1', 'r6_7_2'],
      ];
      for (const fila of r6_inputs) {
        for (let columna = 0; columna < fila.length; columna++) {
          this.updateControlValue(fila[columna], 0);
        }
      }
    } catch (error) {
      console.log("Error al cerar valores R6")
      console.log(error)
    }


  }


  async especiales(){
    let r3_3_3 = await this.getInputValue('r3_2_3') * ((await this.getInputValue('r2_1_1') + await this.getInputValue('r2_2_1')) / await this.getInputValue('r2_4_1'));
    this.updateControlValue('r3_3_3',r3_3_3);

  }


  calcularDatos() {

    const r1_total = [
      'r1_12_1', 'r1_12_2', 'r1_12_3'
    ]
    r1_total.forEach(id => {
      this.actualizarSumatoriaIndividual(id, 1, 11)
    })
    //this.actualizarSumatoria(r1_total)
    this.actualizarSumatoriaIndividual('r2_4_1',1,3) // primer total R2
    this.actualizarSumatoriaIndividual('r2_8_1',5,7) // 2do total R2

    //this.updateControlValue('r2_9_1',(await r2_t + await r2_t2)) // 3er total R2
    this.updateControlValueList('r2_9_1', ['r2_4_1','r2_8_1']) // tarda en cargarse

    const r3_total = [
      'r3_6_1','r3_6_2','r3_6_3',
    ]
    r3_total.forEach(id => {
      this.actualizarSumatoriaIndividual(id, 1, 5)
    })
    

    this.updateControlValueList_resta('r4_10_1', ['r4_7_1','r4_8_1','r4_9_1']) // tarda en cargarse

    
  }

  /**
   * Suma los datos de una columna del rubroX, colX, desde la fila x hasta la fila y.
   * @param rubro 
   * @param col 
   * @param sumDesde se calcula una suma desde (incluye)
   * @param sumHasta se calcula una suma hasta (incluye)
   * @returns 
   */
  async calcularSumatoriaRubro(rubro: string, col: string, sumDesde: number, sumHasta: number) {
    let sumatoria = 0;
    const rubroFormArray = this.jsonDataForm.get(rubro) as FormArray;
    let cnt = sumDesde - 1;
    rubroFormArray.controls.forEach((control, index) => {
      if (index >= cnt){
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
   * Actualiza el valor de los campos "total"
   * @param inputsTotal: string array de los valores considerados "total"
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
  async actualizarSumatoriaIndividual(id: string, sumDesde: number, sumHasta: number) {
    try {
      let cols: string[] = [];
      const [rubro, row, col] = id.split('_');
      const colJson = "col" + col.toString();
      const total = await this.calcularSumatoriaRubro(rubro, colJson, sumDesde, sumHasta);
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
*/
