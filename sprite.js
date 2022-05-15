class Sprite {
    //pass through json so you don't have to remember the order in the constructor
    constructor({ position, velocity, img, frames = { max: 1, stretch: { width: 1, height: 1 } }, sprites }) {
        this.position = position
        this.img = img
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.moving = false
        this.sprites = sprites

        this.img.onload = () => {
            this.width = this.img.width / this.frames.max
            this.height = this.img.height
        }

    }

    draw() {
        context.drawImage(
            this.img,
            this.frames.val * this.width, //x position to start crop
            0, //y position to start crop
            this.img.width / this.frames.max, // width of image crop
            this.img.height, //height of imange crop
            this.position.x, //x placement of image
            this.position.y, //y placement of image
            this.img.width / this.frames.max * this.frames.stretch.width, //width of image
            this.img.height * this.frames.stretch.height) //height of image

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 10 == 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }

    }
}