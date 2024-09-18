import { Engine, SceneActivationContext, Vector } from 'excalibur'
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

        this.player.actions.clearActions()
        this.player.actions.callMethod(() => {
            this.player.animateIntroduction(() => {
                // TODO: Dialog
            })
        })
    }
}
