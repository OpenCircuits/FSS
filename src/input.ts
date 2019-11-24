import {Point} from './geometry';
import {RIGH_MOUSE_BUTTON} from './canvas';

export function initControls(canvas){
	canvas.addEventListener('mousedown', (e) => {
		mouse_down = true;
		if(e.button === RIGHT_MOUSE_BUTTON)
			return;

		if(e.shiftKey && isOverNode()){
			begin_arrow = true;
			current_node = getClosestNode();
		}
		if(isOverNode() && !key_down)
			current_node = getClosestNode();

		for (var i = arrows.length - 1; i >= 0; i--) {
			if(arrows[i].mouse_over && current_arrow === null){
				current_arrow = arrows[i];
				break;
			}
		}

	});

	canvas.addEventListener('mousemove', (e) => {
		mouse_pos = getMouse(e);
		dragging = mouse_down;
		if(nodes.length == 0 || key_down)
			return;

		if(current_node){
			current_node.moveTo(mouse_pos);
		}

		if(!isOverNode() && mouse_down && current_arrow !== null){
			current_arrow.ctrl_pos = mouse_pos;
		}
	});

	canvas.addEventListener('mouseup', (e) => {
		mouse_down = false;
		dragging = false;

		if(e.button === RIGHT_MOUSE_BUTTON){
			//remove all conections from this node
			if(isOverNode()){
				deleteNode();
			}

			current_node = null;
			current_arrow = null;
			return;
		}

		if(begin_arrow){
			begin_arrow = false;
			if(isOverNode()){
				//if we landed on another node create a new arrow
				addNewArrow(current_node, getClosestNode());
			}
		}

		mouse_pos = getMouse(e);
		if( !isOverNode() && !key_down && current_arrow === null) {
			nodes.push( new Node(mouse_pos, nodes.length.toString(10) ));
		}

		current_node = null;
		current_arrow = null;
	});


	window.addEventListener('keydown', (e) =>{
			//draw arrow instead
			current_node = null;
			key_down = true;

			if(e.shiftKey && isOverNode() && mouse_down){
				begin_arrow = true;
				current_node = getClosestNode();
				return;
			}
		});

	//incase the user is over a node and releases the shift key
	//before the mouse button
	window.addEventListener('keyup', (e) =>{
		key_down = false;

		if(begin_arrow){
			begin_arrow = false;
			if(isOverNode()){
				//if we landed on another node create a new arrow
				addNewArrow(current_node, getClosestNode());
			}
		}
		current_node = null;
	});


	//end function
}

//corrects the raw mouse position to a mouse position relative to the canvas
//upper left corner is (0,0)
export function getMouse(pos){
	return new Point(pos.offsetX, pos.offsetY);
}