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
import { MySounds } from '../1_utils/sound_handling'
import { MyStorage } from '../1_utils/storage'
import { EngineConfigs } from '../configs'
import { DoorActor } from './door.actor'
import { GhostActor } from './ghost.actor'
import { LightActor } from './light.actor'
import { MirrorActor } from './mirror.actor'
import { PostItActor } from './postit.actor'

export class PlayerActor extends Actor {
    static readonly Speed = 64
    static readonly JumpSpeed = 200

    private dieSub = new Subject<void>()
    private onIntroductionEndSub = new Subject<void>()
    public onIntroductionEnd$ = this.onIntroductionEndSub.pipe(
        takeUntil(this.dieSub)
    )
    private onDieEndSub = new Subject<void>()
    public onDieEnd$ = this.onDieEndSub.pipe(takeUntil(this.dieSub))
    private onDoorEnterSub = new Subject<DoorActor>()
    public onDoorEnter$ = this.onDoorEnterSub.pipe(takeUntil(this.dieSub))
    private onMirrorEnterSub = new Subject<MirrorActor>()
    public onMirrorEnter$ = this.onMirrorEnterSub.pipe(takeUntil(this.dieSub))
    private onPostItEnterSub = new Subject<PostItActor>()
    public onPostItEnter$ = this.onPostItEnterSub.pipe(takeUntil(this.dieSub))

    private enabled = true
    private anims: { [key: string]: Animation } = {}
    private light: LightActor
    private direction: string = 'right'
    private nearDoor: DoorActor | null = null
    private nearMirror: MirrorActor | null = null
    private nearPostIt: PostItActor | null = null
    private onGround = true

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
            range(0, 2),
            200,
            AnimationStrategy.PingPong
        )
        this.anims['idle.left'] = this.anims['idle.right'].clone()
        this.anims['idle.left'].flipHorizontal = true
        this.anims['walk.right'] = Animation.fromSpriteSheet(
            sprites,
            range(7, 11),
            100,
            AnimationStrategy.PingPong
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

        // Gravity
        this.vel.y += 400 * (delta / 1000)

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
            // Open door
            if (this.nearDoor && this.nearDoor.canOpen()) {
                this.animateEnterDoor()
            } else if (this.nearMirror) {
                this.animateEnterMirror()
            } else if (this.nearPostIt) {
                this.animateOpenPostIt()
            } else {
                // Jump
                if (this.onGround) {
                    this.vel.y = -PlayerActor.JumpSpeed
                    this.onGround = false
                }
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
        // console.log('PlayerActor.onCollisionStart', other.owner.name)

        // Check for door collision
        if (other.owner instanceof DoorActor) {
            this.nearDoor = other.owner
        }

        // Check for mirror collision
        if (other.owner instanceof MirrorActor) {
            this.nearMirror = other.owner
        }

        // Check for post-it collision
        if (other.owner instanceof PostItActor) {
            this.nearPostIt = other.owner
        }

        // Check for ghost collision
        if (other.owner instanceof GhostActor) {
            this.animateDie()
        }

        // Check for ground collision
        if (other.owner.name === 'Walls' && side === Side.Bottom) {
            this.onGround = true
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
        this.vel = Vector.Zero
        this.acc = Vector.Zero
        this.graphics.use('die')
        this.actions.delay(2000).callMethod(() => {
            void this.scene.engine.goToScene('game')
        })
        MyStorage.Store('deathCount', MyStorage.Retrieve('deathCount', 0) + 1)
    }

    public candleOff() {
        this.light.kill()
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

    private animateEnterMirror() {
        this.enabled = false
        this.vel = Vector.Zero
        this.acc = Vector.Zero
        this.graphics.use('idle.right')
        this.actions.clearActions()
        this.actions
            .callMethod(() => MySounds.StopMusicTheme())
            .moveTo(this.nearMirror.pos, PlayerActor.Speed / 2)
            .delay(1000)
            .callMethod(() => this.onMirrorEnterSub.next(this.nearMirror))
    }

    private animateOpenPostIt() {
        this.enabled = false
        this.vel = Vector.Zero
        this.acc = Vector.Zero
        this.graphics.use('idle.right')
        this.actions.clearActions()
        this.actions.delay(1000).callMethod(() => {
            this.enabled = true
            this.onPostItEnterSub.next(this.nearPostIt)
        })
    }
}
