import {FSSCircuitView} from "./FSSCircuitView";

export class MainDesignerView extends FSSCircuitView {

    public constructor() {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error("Canvas element not found!");
        super(canvas);
    }

}
