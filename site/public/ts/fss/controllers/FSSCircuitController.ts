import {FSSDesigner} from "fss/models/FSSDesigner";

import {MainDesignerView} from "site/fss/views/MainDesignerView";
import {FSSTool} from "fss/tools/FSSTool";
import {ToolManager} from "core/tools/ToolManager";
import {PanTool} from "core/tools/PanTool";
import {TranslateTool} from "core/tools/TranslateTool";
import {CircuitView} from "site/shared/views/CircuitView";
import {RenderQueue} from "core/utils/RenderQueue";
import {Camera} from "math/Camera";
import {Selectable} from "core/utils/Selectable";
import {Vector} from "Vector";
import {Input} from "core/utils/Input";
import {FSSWiringTool} from "fss/tools/FSSWiringTool";
// import {SplitWireTool} from "core/tools/SplitWireTool";

export class FSSCircuitController {
    private active: boolean;

    protected designer: FSSDesigner;

    protected view: CircuitView;

    protected toolManager: ToolManager;
    private defaultTool: FSSTool;

    private renderQueue: RenderQueue;

    protected input: Input;

    public constructor() {
        this.active = true;

        this.designer = new FSSDesigner(() => this.render());
        this.view = new MainDesignerView();

        this.renderQueue = new RenderQueue(() =>
            this.view.render(this.designer,
                             this.getSelections(),
                             this.toolManager));

        // utils
        this.defaultTool = new FSSTool(this.designer, this.getCamera());
        this.toolManager = new ToolManager(this.defaultTool);

        this.toolManager.addTools(new PanTool(this.getCamera()),
                                  new TranslateTool(this.getCamera()),
                                  new FSSWiringTool(this.designer, this.getCamera()));

        // input
        this.input = new Input(this.view.getCanvas());
        this.input.addListener("click",     (b) => !this.active || this.onClick(b));
        this.input.addListener("mousedown", (b) => !this.active || this.onMouseDown(b));
        this.input.addListener("mousedrag", (b) => !this.active || this.onMouseDrag(b));
        this.input.addListener("mousemove", ( ) => !this.active || this.onMouseMove());
        this.input.addListener("mouseup",   (b) => !this.active || this.onMouseUp(b));
        this.input.addListener("keydown",   (b) => !this.active || this.onKeyDown(b));
        this.input.addListener("keyup",     (b) => !this.active || this.onKeyUp(b));
        this.input.addListener("zoom",    (z,c) => !this.active || this.onZoom(z,c));

        window.addEventListener("resize", _e => this.resize(), false);

        this.getCanvas().addEventListener("mousedown", (e: MouseEvent) => {
            e.preventDefault();
            // this.onMouseDown(e);
        });

        // Stop default right click menu
        this.getCanvas().addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
            // this.onContextMenu(e, canvas);
        });
    }

    private resize(): void {
        this.view.resize();
        this.render();
    }

    protected onMouseDown(button: number): boolean {
        if (this.toolManager.onMouseDown(this.input, button)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onMouseMove(): boolean {
        if (this.toolManager.onMouseMove(this.input)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onMouseDrag(button: number): boolean {
        if (this.toolManager.onMouseDrag(this.input, button)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onMouseUp(button: number): boolean {
        if (this.toolManager.onMouseUp(this.input, button)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onClick(button: number): boolean {
        if (this.toolManager.onClick(this.input, button)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onKeyDown(key: number): boolean {
        if (this.toolManager.onKeyDown(this.input, key)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onKeyUp(key: number): boolean {
        if (this.toolManager.onKeyUp(this.input, key)) {
            this.render();
            return true;
        }
        return false;
    }

    protected onZoom(zoom: number, center: Vector): boolean {
        // TODO: Move to tool
        this.view.getCamera().zoomTo(center, zoom);

        this.render();
        return true;
    }

    public render(): void {
        this.renderQueue.render();
    }

    public getSelections(): Selectable[] {
        return this.defaultTool.getSelections();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.view.getCanvas();
    }

    public getCamera(): Camera {
        return this.view.getCamera();
    }

    public getDesigner(): FSSDesigner {
        return this.designer;
    }

}
