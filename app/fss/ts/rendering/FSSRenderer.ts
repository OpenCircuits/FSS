import {DEFAULT_FILL_COLOR, DEFAULT_BORDER_COLOR,
        DEFAULT_BORDER_WIDTH, SELECTED_BORDER_COLOR,
        SELECTED_FILL_COLOR} from "core/utils/Constants";
import {V} from "Vector";

import {Renderer} from "core/rendering/Renderer";

import {Camera} from "math/Camera";
import {Selectable} from "core/utils/Selectable";

import {FSSNode} from "fss/models/FSSNode";
import {Circle} from "core/rendering/shapes/Circle";
import {Style} from "core/rendering/Style";
import {IOLabelRenderer} from "core/rendering/IOLabelRenderer";

export const FSSRenderer = (() => {
    return {
        render(renderer: Renderer, camera: Camera, object: FSSNode, selected: boolean, selections: Selectable[]): void {
            // Check if object is on the screen
            if (!camera.cull(object.getCullBox()))
                return;

            renderer.save();

            const transform = object.getTransform();

            const size = transform.getSize();

            // Transform the renderer
            renderer.transform(camera, transform);

            const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
            const fillCol   = (selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);
            const style = new Style(fillCol, borderCol, DEFAULT_BORDER_WIDTH);

            renderer.draw(new Circle(V(), size.x/2), style);

            // Render the IOLabels, does not render labels if they are blank
            IOLabelRenderer.render(renderer, camera, object);

            renderer.restore();
        }
    };
})();
