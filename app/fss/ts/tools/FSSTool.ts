import {SelectionTool} from "core/tools/SelectionTool";
import {Input} from "core/utils/Input";
import {FSSNode} from "fss/models/FSSNode";
import {PlaceAction} from "core/actions/addition/PlaceAction";

export class FSSTool extends SelectionTool {

    public onClick(input: Input, button: number): boolean {
        if (super.onClick(input, button))
            return true;

        const worldMousePos = this.camera.getWorldPos(input.getMousePos());

        // create new node
        const node = new FSSNode();
        node.setPos(worldMousePos);

        this.action.add(new PlaceAction(this.designer, node).execute());
    }
}