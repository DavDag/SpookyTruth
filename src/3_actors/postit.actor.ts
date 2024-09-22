import {
    Actor,
    Animation,
    AnimationStrategy,
    Collider,
    CollisionContact,
    CollisionType,
    Engine,
    range,
    Scene,
    Side,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Subject } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { MyStorage } from '../1_utils/storage'
import { EngineConfigs } from '../configs'
import { InteractionsActor } from './interactions.actor'

export class PostItActor extends Actor {
    private dieSub = new Subject<void>()
    private interaction: InteractionsActor

    constructor(
        pos: Vector,
        public readonly piece: number
    ) {
        super({
            name: 'postit',
            pos: pos,
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            collisionType: CollisionType.Passive,
            z: EngineConfigs.PostItZIndex,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Animations
        const sheet = SpriteSheet.fromImageSource({
            image: Resources.image.tileset,
            grid: {
                rows: 10,
                columns: 10,
                spriteWidth: 16,
                spriteHeight: 16,
            },
        })
        const idle = Animation.fromSpriteSheet(
            sheet,
            range(96, 99),
            500,
            AnimationStrategy.Loop
        )
        this.graphics.add('idle', idle)
        this.graphics.use('idle')

        // Interaction
        this.interaction = new InteractionsActor(Vector.Up, 'buttonA')
        this.interaction.hide()
        this.addChild(this.interaction)

        // Kill if already collected
        if (new Set(MyStorage.Retrieve('memory.pieces', [])).has(this.piece))
            this.kill()
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        this.dieSub.next()
    }

    onCollisionStart(
        self: Collider,
        other: Collider,
        side: Side,
        contact: CollisionContact
    ) {
        super.onCollisionStart(self, other, side, contact)

        // Check for player collision
        if (other.owner.name === 'player') {
            this.interaction.show()
        }
    }

    onCollisionEnd(
        self: Collider,
        other: Collider,
        side: Side,
        lastContact: CollisionContact
    ) {
        super.onCollisionEnd(self, other, side, lastContact)

        // Check for player collision
        if (other.owner.name === 'player') {
            this.interaction.hide()
        }
    }
}
