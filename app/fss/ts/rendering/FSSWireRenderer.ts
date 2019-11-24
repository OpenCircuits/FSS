import {DEFAULT_FILL_COLOR,
        SELECTED_FILL_COLOR,
        WIRE_THICKNESS} from "core/utils/Constants";
import {Camera} from "math/Camera";

import {Renderer} from "core/rendering/Renderer";
import {Curve}    from "core/rendering/shapes/Curve";
import {Line}     from "core/rendering/shapes/Line";
import {Style}    from "core/rendering/Style";

import {FSSWire} from "fss/models/FSSWire";

export const FSSWireRenderer = (() => {
    return {
        render(renderer: Renderer, camera: Camera, wire: FSSWire, selected: boolean): void {
            if (!camera.cull(wire.getCullBox()))
                return;

            // @TODO move to function for getting color based on being selection/on/off
            const color = selected ? SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR;
            const style = new Style(undefined, color, WIRE_THICKNESS / camera.getZoom());

            // get curve and start/end positions
            const curve = wire.getShape();

            const p1 = camera.getScreenPos(curve.getP1());
            const p2 = camera.getScreenPos(curve.getP2());
            const c1 = camera.getScreenPos(curve.getC1());
            const c2 = camera.getScreenPos(curve.getC2());

            renderer.draw(new Curve(p1, p2, c1, c2), style);
        }
    };
})();
