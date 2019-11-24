import {NODE_RADIUS} from "fss/utils/Constants";
import {Vector} from "Vector";
import {CircleContains} from "math/MathUtils";

import {Component} from "core/models/Component";
import {Port} from "core/models/ports/Port";

import {FSSNode} from "app/fss/ts/models/FSSNode";
import {FSSWire} from "app/fss/ts/models/FSSWire";

export class FSSPort extends Port {
    protected parent: FSSNode;

    private connections: FSSWire[];

    public constructor(parent: Component) {
        super(parent);
        this.connections = [];
    }

    public connect(w: FSSWire): void {
        this.connections.push(w);
    }

    public disconnect(w: FSSWire): void {
        // find index and splice
        const i = this.connections.indexOf(w);
        if (i != -1)
            this.connections.splice(i, 1);
    }

    public isWithinSelectBounds(v: Vector): boolean {
        return CircleContains(this.getWorldTargetPos(), NODE_RADIUS, v);
    }

    public getInitialDir(): Vector {
        return new Vector(0, 0);
    }

    public getWires(): FSSWire[] {
        return this.connections.slice(); // Shallow copy
    }

    public getParent(): FSSNode {
        return this.parent;
    }

}
