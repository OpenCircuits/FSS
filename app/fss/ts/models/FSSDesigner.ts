// import {AnalogObjectSet} from "../utils/ComponentUtils";

import {IOObject} from "core/models/IOObject";
import {CircuitDesigner} from "core/models/CircuitDesigner";

import {FSSNode} from "./FSSNode";
import {FSSWire} from "./FSSWire";
import {FSSPort} from "./ports/FSSPort";
import {IOObjectSet} from "core/utils/ComponentUtils";

export class FSSDesigner extends CircuitDesigner {
    private objects: FSSNode[];
    private wires: FSSWire[];
    private updateRequests: number;

    private updateCallback: () => void;

    public constructor(callback: () => void = () => {}) {
        super();

        this.updateCallback = callback;

        this.reset();
    }

    public reset(): void {
        this.objects = [];
        this.wires   = [];
        this.updateRequests = 0;
    }

    /**
     * Method to call when you want to force an update
     *     Used when something changed but isn't propagated
     *     (i.e. Clock updated but wasn't connected to anything)
     */
    public forceUpdate(): void {
        this.updateCallback();
    }

    public createWire(p1: FSSPort, p2: FSSPort): FSSWire {
        return new FSSWire(p1, p2);
    }

    public addGroup(group: IOObjectSet): void {
        for (const c of group.getComponents())
            this.addObject(c as FSSNode);

        for (const w of group.getWires())
            this.addWire(w as FSSWire);
    }

    public addObjects(objects: FSSNode[]): void {
        for (const object of objects)
            this.addObject(object);
    }

    public addObject(obj: FSSNode): void {
        if (this.objects.includes(obj))
            throw new Error("Attempted to add object that already existed!");

        obj.setDesigner(this);
        this.objects.push(obj);
    }

    public addWire(wire: FSSWire): void {
        if (this.wires.includes(wire))
            throw new Error("Attempted to add a wire that already existed!");

        wire.setDesigner(this);
        this.wires.push(wire);
    }

    public remove(o: FSSNode | FSSWire): void {
        if (o instanceof FSSNode)
            this.removeObject(o);
        else
            this.removeWire(o);
    }

    public removeObject(obj: FSSNode): void {
        if (!this.objects.includes(obj))
            throw new Error("Attempted to remove object that doesn't exist!");

        this.objects.splice(this.objects.indexOf(obj), 1);
        obj.setDesigner(undefined);
    }

    public removeWire(wire: FSSWire): void {
        if (!this.wires.includes(wire))
            throw new Error("Attempted to remove wire that doesn't exist!");

        this.wires.splice(this.wires.indexOf(wire), 1);
        wire.setDesigner(undefined);
    }

    // public save(node: XMLNode): void {
    //     SaveGroup(node, this.objects, this.wires);
    // }

    // public load(node: XMLNode): void {
    //     const group = LoadGroup(node);

    //     // Add all objects/wires
    //     group.getAllComponents().forEach((c) => this.addObject(c));
    //     group.wires.forEach((w) => {
    //         this.wires.push(w);
    //         w.setDesigner(this);
    //     });

    //     // Update since the circuit has changed
    //     this.updateCallback();
    // }

    // Shift an object to a certain position
    //  within it's list
    public shift(obj: FSSNode | FSSWire, i?: number): number {
        // Find initial position in list
        const arr: IOObject[] =
                (obj instanceof FSSNode) ? (this.objects) : (this.wires);
        const i0 = arr.indexOf(obj);
        if (i0 === -1)
            throw new Error("Can't move object! Object doesn't exist!");

        // Shift object to position
        i = (i == undefined ? arr.length : i);
        arr.splice(i0, 1);
        arr.splice(i, 0, obj);

        // Return initial position
        return i0;
    }

    // public getGroup(): AnalogObjectSet {
    //     return new AnalogObjectSet((<IOObject[]>this.objects).concat(this.wires));
    // }

    public getObjects(): FSSNode[] {
        return this.objects.slice(); // Shallow copy array
    }

    public getWires(): FSSWire[] {
        return this.wires.slice(); // Shallow copy array
    }

    public getXMLName(): string {
        return "circuit";
    }

}
