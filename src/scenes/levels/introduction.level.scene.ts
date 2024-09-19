import {
    Actor,
    Color,
    Engine,
    SceneActivationContext,
    Sprite,
    Vector,
} from 'excalibur'
import { Resources } from '../../assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class IntroductionLevelScene extends BaseLevelScene {
    constructor() {
        super({
            playerSpawnPos: new Vector(4, 7).scale(16),
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        // Background
        const bg = new Actor({
            name: 'Background',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 160,
            height: 144,
            color: Color.Violet,
        })
        bg.graphics.use(
            new Sprite({
                image: Resources.image.introductionRoom,
            })
        )
        this.add(bg)

        // Animate player introduction
        this.player.actions.clearActions()
        this.player.actions.callMethod(() => {
            this.player.animateIntroduction(() => {
                // TODO: Dialog
            })
        })
    }
}
