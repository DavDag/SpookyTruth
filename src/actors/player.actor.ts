import {
    Actor,
    Animation,
    AnimationStrategy,
    CollisionType,
    Color,
    Engine,
    range,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Resources } from '../assets/resources'
import { EngineConfigs } from '../configs'
import { MyInputs } from '../utils/input_handling'

export class PlayerActor extends Actor {
    static readonly Speed = 32

    private enabled = false
    private anims: { [key: string]: Animation } = {}

    constructor() {
        super({
            name: 'player',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            color: Color.Violet,
            collisionType: CollisionType.Active,
            z: EngineConfigs.PlayerZIndex,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const sprites = SpriteSheet.fromImageSource({
            image: Resources.image.player,
            grid: {
                rows: 4,
                columns: 4,
                spriteWidth: 16,
                spriteHeight: 16,
            },
        })
        this.anims['introduction'] = Animation.fromSpriteSheet(
            sprites,
            range(0, 3),
            500,
            AnimationStrategy.Freeze
        )
        this.anims['idle'] = Animation.fromSpriteSheet(
            sprites,
            range(4, 7),
            150,
            AnimationStrategy.PingPong
        )
        this.anims['walk.right'] = Animation.fromSpriteSheet(
            sprites,
            range(8, 11),
            150,
            AnimationStrategy.Loop
        )
        this.anims['walk.left'] = this.anims['walk.right'].clone()
        this.anims['walk.left'].flipHorizontal = true
        Object.keys(this.anims).forEach((key) =>
            this.graphics.add(key, this.anims[key])
        )

        // Start with the idle animation
        this.graphics.use('idle')
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)
        if (!this.enabled) return

        // Movement
        const dir = Vector.Zero
        if (MyInputs.IsPadLeftHeld(engine)) {
            dir.x -= 1
        }
        if (MyInputs.IsPadRightHeld(engine)) {
            dir.x += 1
        }

        if (dir.x !== 0) {
            this.vel.x = dir.x * PlayerActor.Speed
            this.graphics.use('walk.' + (dir.x > 0 ? 'right' : 'left'))
        } else {
            this.vel.x = 0
            this.graphics.use('idle')
        }
    }

    public animateIntroduction(): Promise<void> {
        this.enabled = false
        this.graphics.use('introduction')
        this.anims['introduction'].events.clear()
        return new Promise<void>((res, rej) => {
            this.anims['introduction'].events.on('end', () => {
                this.enabled = true
                res()
            })
        })
    }
}
