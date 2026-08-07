import { DialogComponent } from "../dialog.component";
import { DialogConfig } from "./dialog-config.model";
import { DialogRefController } from "./dialog-ref-controller.model";
import { Subject, Observable } from "rxjs";

export class DialogModalRef extends DialogRefController<DialogComponent>{

    private onCloseSuject = new Subject<any>();
    private _dialogRef: DialogRefController<any> | undefined;

    constructor(private _config: DialogConfig) {
        super();
    }

    set dialogRef(dialogRef: DialogRefController<any>) {
        this._dialogRef = dialogRef;
    }

    get config(): DialogConfig {
        return this._config;
    }

    override get onClose(): Observable<any> {
        return this.onCloseSuject.asObservable();
    }

    public override close(value?: any): void {
        this._dialogRef?.detroy();
        this.detroy();
        this.onCloseSuject.next(value);
    }

}