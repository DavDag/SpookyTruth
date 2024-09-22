import {
    ActionSequence,
    Actor,
    Animation,
    AnimationStrategy,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    ParallelActions,
    range,
    Scene,
    Side,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Subject, take, takeUntil } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { MyInputs } from '../1_utils/input_handling'
import { EngineConfigs } from '../configs'
import { DoorActor } from './door.actor'
import { LightActor } from './light.actor'

export class PlayerActor extends Actor {
    static readonly Speed = 32

    private dieSub = new Subject<void>()
    private onIntroductionEndSub = new Subject<void>()
    public onIntroductionEnd$ = this.onIntroductionEndSub.pipe(
        takeUntil(this.dieSub)
    )
    private onDieEndSub = new Subject<void>()
    public onDieEnd$ = this.onDieEndSub.pipe(takeUntil(this.dieSub))
    private onDoorEnterSub = new Subject<DoorActor>()
    public onDoorEnter$ = this.onDoorEnterSub.pipe(takeUntil(this.dieSub))

    private enabled = false
    private anims: { [key: string]: Animation } = {}
    private light: LightActor
    private direction: string = 'right'
    private nearDoor: DoorActor | null = null

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

        // Light
        this.light = new LightActor(
            this.pos.add(new Vector(12, 6)),
            'player.candle'
        )
        this.addChild(this.light)
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Animations
        const sprites = SpriteSheet.fromImageSource({
            image: Resources.image.player,
            grid: {
                rows: 4,
                columns: 7,
                spriteWidth: 48,
                spriteHeight: 32,
            },
        })
        this.graphics.offset = new Vector(-16, -16)
        this.anims['die'] = Animation.fromSpriteSheet(
            sprites,
            range(21, 27),
            200,
            AnimationStrategy.Freeze
        )
        this.anims['die'].events.on('end', () => this.onDieEndSub.next())
        this.anims['introduction'] = this.anims['die'].clone()
        this.anims['introduction'].reverse()
        this.anims['introduction'].events.on('end', () => {
            this.graphics.use(`idle.${this.direction}`)
            this.onIntroductionEndSub.next()
        })
        this.anims['idle.right'] = Animation.fromSpriteSheet(
            sprites,
            range(0, 6),
            100,
            AnimationStrategy.Loop
        )
        this.anims['idle.left'] = this.anims['idle.right'].clone()
        this.anims['idle.left'].flipHorizontal = true
        this.anims['walk.right'] = Animation.fromSpriteSheet(
            sprites,
            range(7, 13),
            100,
            AnimationStrategy.Loop
        )
        this.anims['walk.left'] = this.anims['walk.right'].clone()
        this.anims['walk.left'].flipHorizontal = true
        Object.keys(this.anims).forEach((key) =>
            this.graphics.add(key, this.anims[key])
        )

        // Start with the idle animation
        this.graphics.use(`idle.${this.direction}`)
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
            this.direction = dir.x > 0 ? 'right' : 'left'
            this.graphics.use(`walk.${this.direction}`)
        } else {
            this.vel.x = 0
            this.graphics.use(`idle.${this.direction}`)
        }

        // Handle button A
        if (MyInputs.IsButtonAPressed(engine)) {
            if (this.nearDoor && this.nearDoor.canOpen()) {
                this.animateEnterDoor()
            }
        }
    }

    onCollisionStart(
        self: Collider,
        other: Collider,
        side: Side,
        contact: CollisionContact
    ) {
        super.onCollisionStart(self, other, side, contact)

        // Check for door collision
        if (other.owner instanceof DoorActor) {
            this.nearDoor = other.owner
        }
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        this.dieSub.next()
    }

    public enable() {
        this.enabled = true
    }

    public disable() {
        this.enabled = false
    }

    public animateIntroduction() {
        this.graphics.use('introduction')
    }

    public animateDie() {
        this.enabled = false
        this.graphics.use('die')
    }

    private animateEnterDoor() {
        this.enabled = false
        this.actions
            .callMethod(() => {
                this.nearDoor.open()
                this.nearDoor.open$
                    .pipe(take(1))
                    .subscribe(() => this.onDoorEnterSub.next(this.nearDoor))
            })
            .callMethod(() => {
                this.direction =
                    this.pos.x > this.nearDoor.pos.x ? 'left' : 'right'
                this.graphics.use(`walk.${this.direction}`)
            })
            .runAction(
                new ParallelActions([
                    new ActionSequence(this, (ctx) => {
                        ctx.moveTo(this.nearDoor.pos, PlayerActor.Speed / 2)
                    }),
                    new ActionSequence(this, (ctx) => {
                        ctx.fade(0, 500)
                    }),
                ])
            )
    }
}
