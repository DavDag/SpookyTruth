import {
    Actor,
    Animation,
    AnimationStrategy,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    range,
    Scene,
    Side,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Subject, takeUntil } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { MyInputs } from '../1_utils/input_handling'
import { EngineConfigs } from '../configs'
import { InteractionsActor } from './interactions.actor'

export class DoorActor extends Actor {
    private dieSub = new Subject<void>()
    private openSub = new Subject<void>()
    private closeSub = new Subject<void>()
    private isClosed = true
    private isAnimating = false
    private canInteract = false
    private openingAnim: Animation
    private closingAnim: Animation
    private interaction: InteractionsActor

    public open$ = this.openSub.pipe(takeUntil(this.dieSub))
    public close$ = this.closeSub.pipe(takeUntil(this.dieSub))

    constructor(tile: Vector, isClosed: boolean) {
        super({
            name: 'door',
            pos: tile.scale(16),
            anchor: Vector.Zero,
            width: 16,
            height: 16,
            color: Color.Violet,
            collisionType: CollisionType.Passive,
            z: EngineConfigs.DoorZIndex,
        })

        this.isClosed = isClosed
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Animations
        const sheet = SpriteSheet.fromImageSource({
            image: Resources.image.tileset,
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
        this.closingAnim = this.openingAnim.clone()
        this.closingAnim.reverse()
        this.closingAnim.events.on('end', this.onCloseAnimationEnd.bind(this))
        this.graphics.add('idle', idle)
        this.graphics.add('opening', this.openingAnim)
        this.graphics.add('closing', this.closingAnim)
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
        if (other.owner.name === 'player') {
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

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Handle interaction
        if (this.canInteract && !this.isAnimating) {
            // Open / Close door
            if (MyInputs.IsButtonAPressed(engine)) {
                if (this.isClosed) {
                    this.open()
                } else {
                    this.close()
                }
            }
        }
    }

    private open() {
        this.isAnimating = true
        this.openingAnim.reset()
        this.interaction.hide()
        this.graphics.use('opening')
    }

    private close() {
        this.isAnimating = true
        this.closingAnim.reset()
        this.interaction.hide()
        this.graphics.use('closing')
    }

    private onOpenAnimationEnd() {
        this.isClosed = false
        this.isAnimating = false
        if (this.canInteract) {
            this.interaction.show()
        }
        this.openSub.next()
    }

    private onCloseAnimationEnd() {
        this.isClosed = true
        this.isAnimating = false
        if (this.canInteract) {
            this.interaction.show()
        }
        this.closeSub.next()
    }
}
