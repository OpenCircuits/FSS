import {IO_PORT_SELECT_RADIUS, RIGHT_MOUSE_BUTTON} from "core/utils/Constants";

import {Camera} from "math/Camera";
import {CircleContains} from "math/MathUtils";

import {Input} from "core/utils/Input";
import {Tool} from "core/tools/Tool";
import {WiringTool} from "core/tools/WiringTool";
import {Action} from "core/actions/Action";

import {FSSTool} from "./FSSTool";
import {FSSDesigner} from "fss/models/FSSDesigner";
import {FSSPort} from "fss/models/ports/FSSPort";
import {FSSWire} from "fss/models/FSSWire";
import {ConnectionAction} from "core/actions/addition/ConnectionAction";
import {Vector, V} from "Vector";

export class FSSWiringTool extends WiringTool {
    protected designer: FSSDesigner;

    protected port: FSSPort;

    private action: ConnectionAction;

    public constructor(designer: FSSDesigner, camera: Camera) {
        super(designer, camera);
    }

    public shouldActivate(currentTool: Tool, event: string, input: Input, button?: number): boolean {
        if (!(currentTool instanceof FSSTool))
            return false;

        if (!((event == "mouseup" || event == "mousedrag") && button == RIGHT_MOUSE_BUTTON && input.getTouchCount() == 1))
            return false;

        const worldMousePos = this.camera.getWorldPos(input.getMouseDownPos());
        const objects = this.designer.getObjects().reverse();

        // Make sure a port is being clicked
        return this.findPort(objects, worldMousePos) != undefined;
    }

    public activate(currentTool: Tool, event: string, input: Input): Action {
        super.activate(currentTool, event, input);

        // Create wire
        this.wire = new FSSWire(this.port, null);

        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        this.wire.getShape().setP2(worldMousePos);
        this.wire.getShape().setC2(worldMousePos);
        this.wire.getShape().setC1(this.wire.getShape().getP1());

        return undefined;
    }

    public onMouseMove(input: Input): boolean {
        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        // Set one side of curve to mouse position
        const shape = this.wire.getShape();
        shape.setP2(worldMousePos);
        shape.setC2(worldMousePos);

        return true;
    }

    public onMouseUp(input: Input, _: number): boolean {
        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        // Get all ports
        const ports = this.designer.getObjects().flatMap((o) => o.getPorts());

        // Find first port that's being clicked on that isn't this.port
        const port = ports.find((p) => p != this.port && CircleContains(p.getWorldTargetPos(), IO_PORT_SELECT_RADIUS, worldMousePos));

        if (port)
            this.action = new ConnectionAction(this.port, port);

        return true;
    }

    public deactivate(): Action {
        const action = this.action;

        // Reset action
        this.action = undefined;
        return (action ? action.execute() : undefined);
    }

}
