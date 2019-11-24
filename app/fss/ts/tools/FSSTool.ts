import {SelectionTool} from "core/tools/SelectionTool";
import {Input} from "core/utils/Input";
import {FSSNode} from "fss/models/FSSNode";

export class FSSTool extends SelectionTool {

    public onClick(input: Input, button: number): boolean {
        console.log("ASD");
        if (super.onClick(input, button))
            return true;
        console.log("ASD2");

        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        // create new node
        const node = new FSSNode();
        node.setPos(worldMousePos);

        this.designer.addObject(node);
    }
}