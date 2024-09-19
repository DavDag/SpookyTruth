import {
    Actor,
    Animation,
    AnimationStrategy,
    Color,
    Engine,
    range,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Resources } from '../assets/resources'
import { EngineConfigs } from '../configs'

export type InteractionType = 'buttonA'

export class InteractionsActor extends Actor {
    private readonly type: InteractionType

    constructor(tile: Vector, type: InteractionType) {
        super({
            name: `interactions.${type}`,
            pos: tile.scale(16),
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            color: Color.Violet,
            z: EngineConfigs.InteractionsZIndex,
        })

        this.type = type
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Animations
        const sheet = SpriteSheet.fromImageSource({
            image: Resources.image.interactions,
            grid: {
                rows: 4,
                columns: 4,
                spriteWidth: 16,
                spriteHeight: 16,
            },
        })

        // ButtonA
        if (this.type == 'buttonA') {
            const anim = Animation.fromSpriteSheet(
                sheet,
                range(0, 3),
                200,
                AnimationStrategy.Loop
            )
            this.graphics.use(anim)
        }
    }

    public show() {
        this.graphics.visible = true
    }

    public hide() {
        this.graphics.visible = false
    }
}
