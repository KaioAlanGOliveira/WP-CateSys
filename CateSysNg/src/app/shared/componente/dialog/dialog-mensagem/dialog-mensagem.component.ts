import { Component, HostListener } from '@angular/core';
import { DialogRef } from '../models/dialog-ref.model';
import { Button } from "primeng/button";

@Component({
  selector: 'cmp-dialog-mensagem',
  templateUrl: './dialog-mensagem.component.html',
  styleUrls: ['./dialog-mensagem.component.css'],
  imports: [Button]
})
export class DialogMensagemComponent {

  mensagem: string | undefined;

  get formattedMensagem(): string {
    return (this.mensagem || '').replace(/\n/g, '<br>');
  }

  constructor(protected ref: DialogRef<DialogMensagemComponent>) { }

  @HostListener("window:keydown.esc")
  onEsc() {
    this.ref.close();
  }
}
