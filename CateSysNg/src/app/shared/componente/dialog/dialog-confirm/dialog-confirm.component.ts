import { Component } from '@angular/core';
import { DialogRef } from '../models/dialog-ref.model';
import { Button } from "primeng/button";

@Component({
  selector: 'cmp-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css'],
  imports: [Button]
})
export class DialogConfirmComponent {

  mensagem: string | undefined;

  constructor(protected ref: DialogRef<DialogConfirmComponent>) { }

}
