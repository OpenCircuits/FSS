import {V} from "Vector";
import {ClampedValue} from "math/ClampedValue";

import {Component} from "core/models/Component";
import {Node} from "core/models/Node";
import {PortSet} from "core/models/ports/PortSets";
import {Positioner} from "core/models/ports/positioners/Positioner";

import {FSSDesigner} from "./FSSDesigner";
import {FSSWire} from "./FSSWire";
import {FSSPort} from "./ports/FSSPort";

export class FSSNode extends Component implements Node {
    protected designer: FSSDesigner;

    protected ports: PortSet<FSSPort>;

    public constructor() {
        super(V(50, 50));

        this.ports = new PortSet<FSSPort>(this, new ClampedValue(1), new Positioner<FSSPort>(), FSSPort);
    }

    public setDesigner(designer?: FSSDesigner): void {
        this.designer = designer;
    }

    public getP1(): FSSPort {
        return this.ports.first;
    }

    public getP2(): FSSPort {
        return this.ports.last;
    }

    public getPorts(): FSSPort[] {
        return this.ports.getPorts();
    }

    public getConnections(): FSSWire[] {
        return this.getPorts().flatMap(p => p.getWires());
    }

    public getDesigner(): FSSDesigner {
        return this.designer;
    }

    public copy(): FSSNode {
        const copy = <FSSNode>super.copy();

        copy.ports = this.ports.copy(copy);

        return copy;
    }

    public getDisplayName(): string {
        return "Node";
    }

    public getXMLName(): string {
        return "node";
    }

}