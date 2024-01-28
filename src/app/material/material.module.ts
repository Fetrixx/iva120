//only for importing and exporting material components

import { NgModule } from '@angular/core';


// import modules here
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';



const MaterialComponents = [
  MatButtonModule,
  MatCardModule
]
@NgModule({
  imports: [ MaterialComponents],
  exports: [ MaterialComponents]
  
})
export class MaterialModule { }
