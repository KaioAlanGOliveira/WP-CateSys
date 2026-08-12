import { ComponentRef } from "@angular/core";
import { Observable } from "rxjs";
import { DialogModalRef } from "./dialog-modal-ref.model";

export class DialogRef<T> {
  
    protected _componentRef: ComponentRef<T> | undefined;
    protected _modalRef: DialogModalRef | undefined;

    get componentInstance(): T {
        return this._componentRef!.instance;
    }

    public close(value?: any): void {
        this._modalRef?.close(value);

    }

    get onClose(): Observable<any> {
        return this._modalRef!.onClose;
    }
}