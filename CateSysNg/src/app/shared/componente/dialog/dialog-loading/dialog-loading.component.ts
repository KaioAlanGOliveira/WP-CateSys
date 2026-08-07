import { Component } from '@angular/core';
import { ProgressSpinner } from "primeng/progressspinner";

@Component({
  selector: 'cmp-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.css'],
  imports: [ProgressSpinner]
})
export class DialogLoadingComponent {

  public mensagem: string | undefined;
}
