const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//canvas set up
canvas.width = 1024
canvas.height = 576

//collisions setup
const collisionsReshape = []
while (collisions.length) collisionsReshape.push(collisions.splice(0, 70))

class Boundary {

    static width = 48
    static height = 48

    constructor({ position }) {
        this.position = position
        //original hieght of collision tile was 12 but multiply by 4 because map is zoomed in 400%
        this.width = 48
        this.height = 48
    }

    draw() {
        context.fillStyle = 'rgba(255,0,0,0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = { x: -2100, y: -975 }

collisionsReshape.forEach((row, i) => {
    row.forEach((tile, j) => {
        if (tile == 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
    })
})

//create map image
const mapImg = new Image()
mapImg.src = './assets/map.png'

//create player image
const playerImg = new Image()
playerImg.src = './assets/sprites/playerDown.png'

class Sprite {
    //pass through json so you don't have to remember the order in the constructor
    constructor({ position, velocity, img, frames = { max: 1 } }) {
        this.position = position
        this.img = img
        this.frames = frames

        this.img.onload = () => {
            this.width = this.img.width / this.frames.max
            this.height = this.img.height
        }

    }

    draw() {
        context.drawImage(
            this.img,
            0, //x position to start crop
            0, //y position to start crop
            this.img.width / this.frames.max, // width of image crop
            this.img.height, //height of imange crop
            this.position.x, //x placement of image
            this.position.y, //y placement of image
            this.img.width / this.frames.max, //width of image
            this.img.height) //height of image
    }
}

// 
// 

const map = new Sprite({ position: { x: offset.x, y: offset.y }, img: mapImg })
const player = new Sprite({
    position: {
        x: canvas.width / 2 - (playerImg.width / 4) / 2, //render image at x
        y: canvas.height / 2 + playerImg.height / 2, //render image at y
    },
    img: playerImg,
    frames: { max: 4 }
})


//animation

const keys = {
    arrowDown: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    }
}


function spriteCollision({ sprite1, sprite2 }) {
    return (
        sprite1.position.x + sprite1.width >= sprite2.position.x &&
        sprite1.position.x <= sprite2.position.x + sprite2.width &&
        sprite1.position.y + sprite1.height >= sprite2.position.y &&
        sprite1.position.y <= sprite2.position.y + sprite2.height
    )
}

const moveables = [map, ...boundaries] // ... takes all items from array
function animatePlayer() {
    window.requestAnimationFrame(animatePlayer)
    map.draw()

    boundaries.forEach(boundary => {
        boundary.draw()

    })

    player.draw()

    let moving = true

    if (keys.arrowDown.pressed && lastKey == 'ArrowDown') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 5
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }
        if (moving) {
            moveables.forEach(moveable => { moveable.position.y -= 5 })
        }

    }
    else if (keys.arrowUp.pressed && lastKey == 'ArrowUp') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 5
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }
        if (moving) {
            moveables.forEach(moveable => { moveable.position.y += 5 })
        }

    }
    else if (keys.arrowLeft.pressed && lastKey == 'ArrowLeft') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x + 5,
                            y: boundary.position.y
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }
        if (moving) {
            moveables.forEach(moveable => { moveable.position.x += 5 })
        }

    }
    else if (keys.arrowRight.pressed && lastKey == 'ArrowRight') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x - 5,
                            y: boundary.position.y
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }
        if (moving) {
            moveables.forEach(moveable => { moveable.position.x -= 5 })
        }

    }
}
animatePlayer()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true
            lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break

    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = false
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = false
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false
            break

    }
})