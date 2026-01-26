/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class ScriptExecutionService extends BaseCoreService {
    constructor() {
        super();
    }

    public execute(option: IParamsRequestApi<{ script: string }>): void {
        this.requestApiWithAuth(API_DOCUMENT.scriptExecution.execute, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
