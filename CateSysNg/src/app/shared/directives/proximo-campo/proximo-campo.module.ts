import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProximoCampoDirective } from './proximo-campo.directive';


@NgModule({
  exports:[
    ProximoCampoDirective
  ],
  declarations: [],
  imports: [
    CommonModule,
    ProximoCampoDirective
  ]
})
export class ProximoCampoModule { }
