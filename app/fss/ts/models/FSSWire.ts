import {INITIAL_WIRE_AMPLITUDE} from "fss/utils/Constants";

import {Wire} from "core/models/Wire";
import {FSSPort} from "./ports/FSSPort";
import {FSSNode} from "./FSSNode";

export class FSSWire extends Wire {
    protected p1: FSSPort;
    protected p2: FSSPort;

    private amplitude: number;

    public constructor(p1: FSSPort, p2: FSSPort) {
        super(p1, p2);

        this.amplitude = INITIAL_WIRE_AMPLITUDE;
    }

    protected updateCurve(): void {
        if (!this.dirtyShape)
            return;
        this.dirtyShape = false;

        // Update to be on ports
        if (this.p1 != null)
            this.shape.setP1(this.p1.getWorldTargetPos());
        if (this.p2 != null)
            this.shape.setP2(this.p2.getWorldTargetPos());

        // Update curve control points
        const p1 = this.shape.getP1();
        const p2 = this.shape.getP2();
        const dir = p2.sub(p1).normalize().negativeReciprocal();

        this.shape.setC1(dir.scale(this.amplitude).add(p1));
        this.shape.setC2(dir.scale(this.amplitude).add(p2));
    }

    public split(): FSSNode {
        return new FSSNode();
    }

    public getIsOn(): boolean {
        return false;
    }

}
