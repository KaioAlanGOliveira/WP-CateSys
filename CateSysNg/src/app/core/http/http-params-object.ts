import { HttpParams } from "@angular/common/http";

export class HttpParamsObject extends HttpParams {

    constructor(object: any) {
        let objectParams: any = {};
        for (let key in object) {
            let value = object[key];
            if (value instanceof Date) {
                value = value.toLocaleDateString('pt-BR');
            }
            objectParams[key] = value;
        }
        super({ fromObject: objectParams });
    }
}
