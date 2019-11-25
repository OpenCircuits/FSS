import {INITIAL_WIRE_AMPLITUDE} from "fss/utils/Constants";
import {Vector} from "Vector";

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
        const dir = this.getCurveDir();
        this.shape.setC1(dir.scale(this.amplitude).add(this.shape.getP1()));
        this.shape.setC2(dir.scale(this.amplitude).add(this.shape.getP2()));
    }

    public setAmplitude(amp: number): void {
        this.amplitude = amp;
        this.onTransformChange();
    }

    public split(): FSSNode {
        return new FSSNode();
    }

    public getAmplitude(): number {
        return this.amplitude;
    }

    public getCurveDir(): Vector {
        const p1 = this.shape.getP1();
        const p2 = this.shape.getP2();
        return p2.sub(p1).normalize().negativeReciprocal();
    }

    public getIsOn(): boolean {
        return false;
    }

}
