import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injectable } from '@angular/core';
import { DialogComponent } from '../dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogInjectorService {

  constructor(private appRef: ApplicationRef) { }

  public stackBeforeAppRoot(componetRef: ComponentRef<any>, modalRef: ComponentRef<DialogComponent>): void {
    const modalDomElement = this.createDomElement(modalRef);
    document.body.appendChild(modalDomElement);
    this.insertContent(componetRef, modalDomElement);
  }

  private insertContent(componetRef: ComponentRef<any>, modalDomElement: HTMLElement): void {
    const domElement = this.createDomElement(componetRef);
    const contentInsert = modalDomElement.querySelector('.dialog-content');
    if (contentInsert) {
      contentInsert.appendChild(domElement);
    }
  }

  private createDomElement(componentRef: ComponentRef<any>): HTMLElement {
    this.appRef.attachView(componentRef.hostView);
    return this.getDomElement(componentRef);
  }

  public getDomElement(componentRef: ComponentRef<any>): HTMLElement {
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    return domElement;
  }

  public getLastDomElement(): HTMLElement {
    return document.querySelector("cmp-dialog:last-of-type") as HTMLElement;
  }

  public getLastContentDomElement(): HTMLElement {
    let lastContent = document.querySelector(".dialog-content:last-of-type") as HTMLElement;
    if (!lastContent) {
      return document.querySelector("cmp-dialog.dialog-content:last-of-type") as HTMLElement;
    }
    return lastContent;
  }

}
