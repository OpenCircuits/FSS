import {HeaderController} from "site/shared/controllers/HeaderController";
import {FSSCircuitController} from "./FSSCircuitController";

export class AnalogHeaderController extends HeaderController {

    public constructor(main: FSSCircuitController) {
        super(main);
    }

    protected async onLoadCircuit(_main: FSSCircuitController, _file: File): Promise<string> {
        return new Promise(resolve => resolve(""));
    }

    protected onSaveCircuit(_main: FSSCircuitController): void {
    }

}
