import {SELECTION_BOX_STYLE} from "core/rendering/Styles";
import {Camera} from "math/Camera";

import {Renderer}  from "core/rendering/Renderer";
import {Rectangle} from "core/rendering/shapes/Rectangle";

import {ToolManager}        from "core/tools/ToolManager";
import {SelectionTool}      from "core/tools/SelectionTool";
import {WiringTool}         from "core/tools/WiringTool";

import {Component} from "core/models/Component";
import {FSSWireRenderer} from "./FSSWireRenderer";
import {FSSWire} from "fss/models/FSSWire";

export const ToolRenderer = (() => {

    return {
        render(renderer: Renderer, camera: Camera, toolManager: ToolManager): void {
            const tool = toolManager.getCurrentTool();

            const selectionTool = toolManager.getDefaultTool() as SelectionTool;

            // If a wire has been selected, then don't draw the rotation box
            const selections = selectionTool.getSelections();
            const hasOnlyComponents = selections.every((s) => s instanceof Component);

            if (tool instanceof SelectionTool) {
                const selectionBox = tool.getSelectionBox();

                // Draw selection box
                if (selectionBox.isSelecting()) {
                    // Get positions and size
                    const p1 = selectionBox.getP1();
                    const p2 = selectionBox.getP2();
                    const pos = p1.add(p2).scale(0.5);
                    const size = p2.sub(p1);

                    // Draw box
                    renderer.draw(new Rectangle(pos, size), SELECTION_BOX_STYLE, 0.4);
                }
            }
            else if (tool instanceof WiringTool) {
                // Draw fake wire
                const wire = tool.getWire();
                FSSWireRenderer.render(renderer, camera, wire as FSSWire, false);
            }
        }
    };
})();
