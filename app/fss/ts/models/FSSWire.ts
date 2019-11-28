import {Vector} from "Vector";

import {Wire} from "core/models/Wire";
import {FSSPort} from "./ports/FSSPort";
import {FSSNode} from "./FSSNode";

export class FSSWire extends Wire {
    protected p1: FSSPort;
    protected p2: FSSPort;

    public constructor(p1: FSSPort, p2: FSSPort) {
        super(p1, p2);


        if (p1 != null && p2 != null) {
            const mid = p1.getWorldTargetPos().add(p2.getWorldTargetPos()).scale(0.5);
            this.shape.setC1(mid);
            this.shape.setC2(mid);
        }
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
    }

    public split(): FSSNode {
        return new FSSNode();
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
