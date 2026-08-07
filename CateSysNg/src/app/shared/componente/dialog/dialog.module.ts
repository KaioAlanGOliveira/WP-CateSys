import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogMensagemComponent } from './dialog-mensagem/dialog-mensagem.component';
import { DialogComponent } from './dialog.component';
// Removed FocusInitModule import due to static analysis issues
import { DialogLoadingComponent } from './dialog-loading/dialog-loading.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    DialogComponent,
    DialogMensagemComponent,
    DialogConfirmComponent,
    DialogLoadingComponent,
    ButtonModule,
    // FocusInitModule,
    ProgressSpinnerModule
  ]
})
export class DialogModule { }
