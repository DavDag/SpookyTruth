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

export class PlayerActor extends Actor {
    anims: { [key: string]: Animation } = {}
    enabled = false

    constructor() {
        super({
            name: 'player',
            pos: Vector.Zero,
            width: 16,
            height: 16,
            color: Color.Violet,
            collisionType: CollisionType.Active,
            z: 1,
            anchor: Vector.Zero,
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
        Object.keys(this.anims).forEach((key) =>
            this.graphics.add(key, this.anims[key])
        )

        // Start with the idle animation
        this.graphics.use('idle')
    }

    public animateIntroduction(onComplete?: () => void) {
        this.graphics.use('introduction')
        this.anims['introduction'].events.clear()
        this.anims['introduction'].events.on('complete', () => {
            onComplete?.()
        })
    }
}
