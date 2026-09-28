class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        //this.width = canvas.width;
        //this.height = canvas.height;

        this.zoom = 1;

        this.#addEventListeners();
    }

    getMouse(evt){
        return new Point(
            evt.clientX * this.zoom,
            evt.clientY * this.zoom
        )
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousewheel', this.#handleMouseWheel.bind(this));
    }

    #handleMouseWheel(event) {
        const dir = Math.sign(event.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
        console.log(this.zoom);
    }

    #draw() {
        this.ctx.save();
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
}