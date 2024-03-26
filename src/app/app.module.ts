import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatRadioModule } from '@angular/material/radio';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
//import { Component } from '@angular/core';


import { MatNativeDateModule } from '@angular/material/core';

import { MatCardModule } from '@angular/material/card';

import { DatepickerViewsSelection } from './dateMMYYYY/datepicker-views-selection';
import { HttpClientModule } from '@angular/common/http';

import { DecimalPipe } from '@angular/common';
//import { JsonService } from './jsonService.service';
import { ReactiveFormsModule } from '@angular/forms';
//import { ThousandsSeparatorDirective } from './thousands-separator.directive'; // Importa la directiva aquí
import { FormsModule } from '@angular/forms';


import {IConfig, NgxMaskDirective, provideEnvironmentNgxMask} from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    AppComponent,
    //ThousandsSeparatorDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatGridListModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    DatepickerViewsSelection,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [DecimalPipe,
    provideEnvironmentNgxMask(maskConfig),
    /* JsonService, */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




