import {CircuitView} from "site/shared/views/CircuitView";

import {Selectable} from "core/utils/Selectable";

// import {AnalogWireRenderer} from "analog/rendering/eeobjects/AnalogWireRenderer";
// import {AnalogComponentRenderer} from "analog/rendering/eeobjects/AnalogComponentRenderer";
// import {AnalogWire} from "analog/models/AnalogWire";
// import {AnalogComponent} from "analog/models/AnalogComponent";
import {ToolManager} from "core/tools/ToolManager";
import {FSSWire} from "app/fss/ts/models/FSSWire";
import {FSSNode} from "app/fss/ts/models/FSSNode";
import {FSSRenderer} from "fss/rendering/FSSRenderer";
import {FSSWireRenderer} from "fss/rendering/FSSWireRenderer";
import {ToolRenderer} from "fss/rendering/ToolRenderer";
// import {ToolRenderer} from "analog/rendering/ToolRenderer";

export class FSSCircuitView extends CircuitView {

    public constructor(canvas: HTMLCanvasElement, vw: number = 1, vh: number = 1) {
        super(canvas, vw, vh);
    }

    protected renderWire(wire: FSSWire, selections: Selectable[]): void {
        const selected = selections.includes(wire);
        FSSWireRenderer.render(this.renderer, this.camera, wire, selected);
    }

    protected renderObject(obj: FSSNode, selections: Selectable[]): void {
        const selected = selections.includes(obj);
        FSSRenderer.render(this.renderer, this.camera, obj, selected, selections);
    }

    protected renderTools(toolManager: ToolManager): void {
        ToolRenderer.render(this.renderer, this.camera, toolManager);
    }

}
