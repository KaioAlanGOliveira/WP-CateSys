import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cmpProximoCampo]'
})
export class ProximoCampoDirective {

  @Input("cmpProximoCampo") id!: string;

  constructor() {
  }

  @HostListener("keydown.enter")
  onEnter() {
    proximoCampo(this.id);
  }
}
export function proximoCampo(id:string){
  let lastDialog = document.body.querySelector('cmp-dialog:last-of-type');
    let el: HTMLElement | null;
  
    if (lastDialog) {
      el = lastDialog.querySelector("#" + id);
    } else {
      let moduleActated = document.querySelector(".main > router-outlet + *") as HTMLElement;
      if (!moduleActated) {
        moduleActated = document.body;
      }
      el = moduleActated.querySelector("#" + id);
    }
  
    el?.focus();
}