class GraphEditor{
    constructor(viewport, graph){
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
        this.#addEventListeners();
    }

    #addEventListeners(){
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("contextmenu", (evt) => {
            evt.preventDefault();
        });
        this.canvas.addEventListener("mouseup", () => {
            this.dragging = false;
        });
    }

    #handleMouseMove(evt){
        this.mouse = this.viewport.getMouse(evt);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if(this.dragging === true){
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseDown(evt){
        //const mouse = new Point(evt.offsetX, evt.offsetY);
        //this.hovered = getNearestPoint(mouse, this.graph.points, 10);

        if(evt.button === 2 || (evt.button === 0 && evt.ctrlKey)){ // Right click (or Ctrl+Click for touchpads)
            if(this.selected){
                this.selected = null;
            } else if(this.hovered){
                this.#removePoint(this.hovered);
            }
        } else if(evt.button === 0){ // Left click
            if(this.hovered){
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #select(point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point){
        this.graph.removePoint(point);
        this.hovered = null;
        if(this.selected === point){
            this.selected = null;
        }
    }

    display(){
        this.graph.draw(this.ctx);
        if(this.hovered){
           this.hovered.draw(this.ctx, { fill: true});
        }
        if(this.selected){
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true});
        }
    }
}