import {Vector, V} from "Vector";

import {Shape} from "core/rendering/shapes/Shape";
import {NODE_RADIUS} from "fss/utils/Constants";

export class Arrow implements Shape {
    private pos: Vector;
    private length: number;
    private angle: number;
    private dir: Vector;

    public constructor(pos: Vector, length: number, angle: number, dir: Vector) {
        this.pos = pos;
        this.length = length;
        this.angle = angle;
        this.dir = dir;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const p1 = this.dir.scale(this.length).add(this.dir.negativeReciprocal().scale(this.angle));
        const p2 = this.dir.scale(this.length).sub(this.dir.negativeReciprocal().scale(this.angle));

        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + p1.x, this.pos.y + p1.y);
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + p2.x, this.pos.y + p2.y);
    }
}