import {Tool} from "core/tools/Tool";
import {Camera} from "math/Camera";
import {FSSTool} from "./FSSTool";
import {Input} from "core/utils/Input";
import {FSSWire} from "fss/models/FSSWire";
import {Vector} from "Vector";
import {Action} from "core/actions/Action";
import {LEFT_MOUSE_BUTTON} from "core/utils/Constants";

export class WireCurveTool extends Tool {
    private camera: Camera;

    private wire: FSSWire;
    private initialAmp: number;

    public constructor(camera: Camera) {
        super();
        this.camera = camera;
    }

    public shouldActivate(currentTool: Tool, event: string, input: Input): boolean {
        if (!(currentTool instanceof FSSTool))
            return false;
        if (!(event == "mousedrag" && input.getTouchCount() == 1))
            return false;

        // Make sure we're pressing a wire
        const currentPressedObj = currentTool.getCurrentlyPressedObj();
        return (currentPressedObj instanceof FSSWire);
    }

    public activate(currentTool: Tool, event: string, input: Input, button?: number): void {
        if (!(currentTool instanceof FSSTool))
            throw new Error("Tool not selection tool!");

        this.wire = currentTool.getCurrentlyPressedObj() as FSSWire;
        this.initialAmp = this.wire.getAmplitude();
    }

    public shouldDeactivate(event: string, _: Input): boolean {
        return (event == "mouseup");
    }

    public deactivate(): Action {
        // TODO: make action for changing wire amplitude
        return undefined;
    }

    public onMouseDrag(input: Input, button: number): boolean {
        if (button !== LEFT_MOUSE_BUTTON)
            return false;

        const worldMouseDownPos = this.camera.getWorldPos(input.getMouseDownPos());
        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        // Find change in position by subtracting current pos by initial pos
        const dPos = worldMousePos.sub(worldMouseDownPos);
        const dir = this.wire.getCurveDir();

        // get amount moved in direction of the curvature
        const l = -dPos.dot(dir);

        // set amplitude
        this.wire.setAmplitude(this.initialAmp - l);

        return true;
    }

}