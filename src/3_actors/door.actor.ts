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
import { Subject, takeUntil } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { EngineConfigs } from '../configs'
import { InteractionsActor } from './interactions.actor'

export class DoorActor extends Actor {
    private dieSub = new Subject<void>()
    private openSub = new Subject<void>()
    private openingAnim: Animation
    private interaction: InteractionsActor
    private isClosed = true
    private canInteract = false

    public open$ = this.openSub.pipe(takeUntil(this.dieSub))

    constructor(pos: Vector) {
        super({
            name: 'door',
            pos: pos,
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            collisionType: CollisionType.Passive,
            z: EngineConfigs.DoorZIndex,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Animations
        const sheet = SpriteSheet.fromImageSource({
            image: Resources.image.door,
            grid: {
                rows: 4,
                columns: 4,
                spriteWidth: 16,
                spriteHeight: 16,
            },
        })
        const idle = sheet.getSprite(0, 0)
        this.openingAnim = Animation.fromSpriteSheet(
            sheet,
            range(0, 3),
            250,
            AnimationStrategy.Freeze
        )
        this.openingAnim.events.on('end', this.onOpenAnimationEnd.bind(this))
        this.graphics.add('idle', idle)
        this.graphics.add('opening', this.openingAnim)
        this.graphics.use('idle')

        // Interaction
        this.interaction = new InteractionsActor(Vector.Up, 'buttonA')
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
        if (other.owner.name === 'player' && this.isClosed) {
            this.canInteract = true
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
            this.canInteract = false
            this.interaction.hide()
        }
    }

    public canOpen() {
        return this.canInteract && this.isClosed
    }

    public open() {
        this.isClosed = false
        this.interaction.hide()
        this.graphics.use('opening')
    }

    private onOpenAnimationEnd() {
        this.openSub.next()
    }
}
