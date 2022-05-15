const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//canvas set up
canvas.width = 1024
canvas.height = 576
const offset = { x: -2100, y: -975 }

//create player boundaries
const boundaries = []
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

const map = new Sprite({ position: { x: offset.x, y: offset.y }, img: mapImg })

//create player image w/ sprites
const playerImgDown = new Image()
playerImgDown.src = './assets/sprites/playerDown.png'

const playerImgUp = new Image()
playerImgUp.src = './assets/sprites/playerUp.png'

const playerImgLeft = new Image()
playerImgLeft.src = './assets/sprites/playerLeft.png'

const playerImgRight = new Image()
playerImgRight.src = './assets/sprites/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - (playerImgDown.width / 4) / 2, //render image at x
        y: canvas.height / 2 + playerImgDown.height / 2, //render image at y
    },
    img: playerImgDown,
    frames: { max: 4, stretch: { width: 1, height: 1 } },
    sprites: {
        down: playerImgDown,
        up: playerImgUp,
        left: playerImgLeft,
        right: playerImgRight
    }
})

//create foreground image
const foregroundImg = new Image()
foregroundImg.src = './assets/foreground.png'

const foreground = new Sprite({ position: { x: offset.x, y: offset.y }, img: foregroundImg })

//create battle zones
const battleZones = []
battleReshape.forEach((row, i) => {
    row.forEach((tile, j) => {
        if (tile == 1025) {
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
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

const moveables = [map, ...boundaries, foreground, ...battleZones] // ... takes all items from array
function animatePlayer() {
    window.requestAnimationFrame(animatePlayer)
    map.draw()

    boundaries.forEach(boundary => {
        boundary.draw()

    })

    battleZones.forEach(zone => {
        zone.draw()
    })

    player.draw()
    foreground.draw()

    //detect in battle zone when button is pressed
    if (keys.arrowDown.pressed || keys.arrowLeft.pressed || keys.arrowRight.pressed || keys.arrowUp.pressed) {

        for (let i = 0; i < battleZones.length; i++) {
            const zone = battleZones[i]
            const overlap = (Math.min(player.position.x + player.width, zone.position.x + zone.width)
                - Math.max(player.position.x, zone.position.x))
                * (Math.min(player.position.y + player.height, zone.position.y + zone.height)
                    - Math.max(player.position.y, zone.position.y))
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: zone
                }) &&
                overlap > (player.width * player.height) / 2 &&
                Math.random() <= 0.05
            ) {
                console.log('possible battle!')
                break
            }
        }
    }

    let moving = true
    player.moving = false

    //moving down
    if (keys.arrowDown.pressed && lastKey == 'ArrowDown') {
        player.moving = true
        player.img = player.sprites.down

        //detect boundary collision
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }

        if (moving) {
            moveables.forEach(moveable => { moveable.position.y -= 3 })
        }

    }
    // moving up
    else if (keys.arrowUp.pressed && lastKey == 'ArrowUp') {
        player.moving = true
        player.img = player.sprites.up

        //detect boundary collision
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }

        //move if in motion
        if (moving) {
            moveables.forEach(moveable => { moveable.position.y += 3 })
        }

    }
    //moving left
    else if (keys.arrowLeft.pressed && lastKey == 'ArrowLeft') {
        player.moving = true
        player.img = player.sprites.left

        //detect boundary collision
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }

        }

        // move map if in motion
        if (moving) {
            moveables.forEach(moveable => { moveable.position.x += 3 })
        }

    }
    // moving right
    else if (keys.arrowRight.pressed && lastKey == 'ArrowRight') {
        player.moving = true
        player.img = player.sprites.right

        //detect boundary collision
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                spriteCollision({
                    sprite1: player,
                    sprite2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                console.log('collided!')
                moving = false
                break
            }
        }

        // move map if in motion
        if (moving) {
            moveables.forEach(moveable => { moveable.position.x -= 3 })
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