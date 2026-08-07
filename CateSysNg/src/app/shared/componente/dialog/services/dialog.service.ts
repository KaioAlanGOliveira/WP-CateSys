import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Inject, Injector, Type } from "@angular/core";
import { DialogComponent } from "../dialog.component";
import { DialogConfig } from "../models/dialog-config.model";
import { DialogModalRef } from "../models/dialog-modal-ref.model";
import { DialogRefController } from "../models/dialog-ref-controller.model";
import { DialogRef } from "../models/dialog-ref.model";
import { DialogInjectorService } from "./dialog-injector.service";


@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private componentFactory: ComponentFactory<DialogComponent>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        @Inject(DialogInjectorService) private dialogInjector: DialogInjectorService) {
        this.componentFactory = componentFactoryResolver.resolveComponentFactory(DialogComponent);
    }

    public open<T>(component: Type<T>, config?: DialogConfig): DialogRef<T> {

        const modalRef = this.createModal(config || {});
        const dialogRef = this.createDialog<T>(component, modalRef);

        return dialogRef;
    }

    private createDialog<T>(component: Type<T>, modalRef: DialogModalRef): DialogRef<T> {

        const dialogRef = new DialogRefController<T>();
        const componetRef = this.createComponentRef(component, dialogRef);
        dialogRef.componentRef = componetRef;

        modalRef.dialogRef = dialogRef;
        dialogRef.modalRef = modalRef;

        this.dialogInjector.stackBeforeAppRoot(dialogRef.componentRef, modalRef.componentRef!);

        return dialogRef;
    }

    private createModal(config: DialogConfig): DialogModalRef {

        const modalRef = new DialogModalRef(config);
        const modalComponetRef = this.createModalComponentRef(modalRef);

        modalRef.componentRef = modalComponetRef;

        return modalRef;
    }

    private createModalComponentRef(dialogModalRef: DialogModalRef): ComponentRef<DialogComponent> {
        return this.componentFactory.create(Injector.create({
            providers: [
                { provide: DialogModalRef, useValue: dialogModalRef }
            ],
            parent: this.injector
        }));
    }

    private createComponentRef(component: Type<any>, dialogRef: DialogRef<any>): ComponentRef<any> {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        return componentFactory.create(Injector.create({
            providers: [
                { provide: DialogRef, useValue: dialogRef }
            ],
            parent: this.injector
        }));
    }

    public getLastDialogElement(): HTMLElement {
        return this.dialogInjector.getLastContentDomElement();
    }
}








