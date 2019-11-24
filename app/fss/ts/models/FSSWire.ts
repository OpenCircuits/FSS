import {Wire} from "core/models/Wire";
import {FSSPort} from "./ports/FSSPort";
import {FSSNode} from "./FSSNode";

export class FSSWire extends Wire {
    protected p1: FSSPort;
    protected p2: FSSPort;

    private isOn: boolean;

    public constructor(p1: FSSPort, p2: FSSPort) {
        super(p1, p2);
    }

    public split(): FSSNode {
        return new FSSNode();
    }

    public getIsOn(): boolean {
        return this.isOn;
    }

}
