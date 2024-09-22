import {
    Actor,
    Collider,
    CollisionContact,
    CollisionType,
    Engine,
    Scene,
    Side,
    Vector,
} from 'excalibur'
import { Subject } from 'rxjs'
import { EngineConfigs } from '../configs'
import { InteractionsActor } from './interactions.actor'

export class MirrorActor extends Actor {
    private dieSub = new Subject<void>()
    private interaction: InteractionsActor

    constructor(pos: Vector) {
        super({
            name: 'mirror',
            pos: pos,
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            collisionType: CollisionType.Passive,
            z: EngineConfigs.MirrorZIndex,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Interaction
        this.interaction = new InteractionsActor(Vector.Up.scale(2), 'buttonA')
        this.interaction.hide()
        this.addChild(this.interaction)
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
