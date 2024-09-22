import {
    Actor,
    Animation,
    AnimationStrategy,
    CollisionType,
    Engine,
    range,
    Scene,
    SpriteSheet,
    Vector,
} from 'excalibur'
import { Subject } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { EngineConfigs } from '../configs'

export interface GhostBehaviourProps {
    wanderingDistance: number
}

export class GhostActor extends Actor {
    static readonly Speed = 32

    private dieSub = new Subject<void>()
    private anims: { [key: string]: Animation } = {}

    constructor(
        name: string,
        pos: Vector,
        private props: GhostBehaviourProps
    ) {
        super({
            name: `ghost.${name}`,
            pos: pos,
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive,
            z: EngineConfigs.GhostZIndex,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
        console.log(this.name, this.props)

        // Animations
        const sprites = SpriteSheet.fromImageSource({
            image: Resources.image.ghost,
            grid: {
                rows: 4,
                columns: 7,
                spriteWidth: 48,
                spriteHeight: 32,
            },
        })
        this.graphics.offset = new Vector(-16, -16)
        this.anims['idle.right'] = Animation.fromSpriteSheet(
            sprites,
            range(0, 1),
            200,
            AnimationStrategy.PingPong
        )
        this.anims['idle.left'] = this.anims['idle.right'].clone()
        this.anims['idle.left'].flipHorizontal = true
        this.anims['walk.right'] = Animation.fromSpriteSheet(
            sprites,
            range(7, 10),
            100,
            AnimationStrategy.PingPong
        )
        this.anims['walk.left'] = this.anims['walk.right'].clone()
        this.anims['walk.left'].flipHorizontal = true
        this.anims['die'] = Animation.fromSpriteSheet(
            sprites,
            range(21, 27),
            200,
            AnimationStrategy.Freeze
        )
        Object.keys(this.anims).forEach((key) =>
            this.graphics.add(key, this.anims[key])
        )

        // Start with the idle animation
        this.graphics.use(`idle.right`)

        // Collision
        this.collider.useCircleCollider(20, new Vector(8, 8))

        // Movement
        this.actions.repeatForever((ctx) => {
            ctx.callMethod(() => this.graphics.use('walk.right'))
            ctx.moveBy(this.props.wanderingDistance * 16, 0, GhostActor.Speed)
            ctx.callMethod(() => this.graphics.use('walk.left'))
            ctx.moveBy(-this.props.wanderingDistance * 16, 0, GhostActor.Speed)
        })
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        this.dieSub.next()
    }
}
