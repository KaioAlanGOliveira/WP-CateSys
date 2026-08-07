import { Component, HostListener } from '@angular/core';
import { DialogConfig } from './models/dialog-config.model';
import { DialogModalRef } from './models/dialog-modal-ref.model';
import { DialogInjectorService } from './services/dialog-injector.service';

@Component({
  selector: 'cmp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  protected config: DialogConfig;

  constructor(private ref: DialogModalRef, private dialogInjector: DialogInjectorService) {
    this.config = this.ref.config;
  }

  public close(): void {
    this.ref.close();
  }

  @HostListener("window:keydown.esc")
  onEsc() {
    if (this.config.esc) {
      const lastDialog = this.dialogInjector.getLastDomElement();
      const domElement = this.ref.componentRef ? this.dialogInjector.getDomElement(this.ref.componentRef) : null;
      if (lastDialog && domElement && lastDialog == domElement) {
        this.ref.close();
      }
    }
  }
}
