import { ComponentRef } from "@angular/core";
import { DialogRef } from "./dialog-ref.model";
import { DialogModalRef } from "./dialog-modal-ref.model";

export class DialogRefController<T> extends DialogRef<T>  {

    set modalRef(modalRef: DialogModalRef) {
        this._modalRef = modalRef;
    }

    get componentRef(): ComponentRef<T> | undefined {
        return this._componentRef;
    }

    set componentRef(componentRef: ComponentRef<T>) {
        this._componentRef = componentRef;
    }

    public detroy(): void {
        this._componentRef?.destroy();
    }
}