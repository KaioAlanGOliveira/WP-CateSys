import { Injectable } from '@angular/core';
import { DialogLoadingComponent } from '../shared/componente/dialog/dialog-loading/dialog-loading.component';
import { DialogMensagemComponent } from '../shared/componente/dialog/dialog-mensagem/dialog-mensagem.component';
import { DialogRef } from '../shared/componente/dialog/models/dialog-ref.model';
import { DialogService } from '../shared/componente/dialog/services/dialog.service';
import { DialogConfirmComponent } from '../shared/componente/dialog/dialog-confirm/dialog-confirm.component';
@Injectable({
  providedIn: 'root'
})
export class UtilService {


  constructor(private dialogService: DialogService) {
  }

  public showErro(msg: string): DialogRef<DialogMensagemComponent> {
    let ref = this.dialogService.open(DialogMensagemComponent, {
      title: 'Erro!',
      closeButton: true,
      esc: true
    });

    ref.componentInstance.mensagem = msg;

    return ref;
  }

  public showMensagem(msg: string): DialogRef<DialogMensagemComponent> {
    let ref = this.dialogService.open(DialogMensagemComponent, {
      title: 'Opa!',
      closeButton: true,
      esc: true
    });

    ref.componentInstance.mensagem = msg;

    return ref;
  }

  public showConfirme(msg: string): DialogRef<DialogConfirmComponent> {
    let ref = this.dialogService.open(DialogConfirmComponent, {
      title: 'Opa!',
      width: '300px',
      closeButton: true,
      esc: true
    });

    ref.componentInstance.mensagem = msg;

    return ref;
  }

  public showLoading(msg: string): DialogRef<DialogLoadingComponent> {

    let ref = this.dialogService.open(DialogLoadingComponent, {
      title: 'Carregando',
      width: '200px',
    });

    ref.componentInstance.mensagem = msg;

    return ref;
  }


}
