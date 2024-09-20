import { Engine, Scene, SceneActivationContext, Vector } from 'excalibur'
import { MyInputs } from '../../1_utils/input_handling'
import { PlayerActor } from '../../3_actors/player.actor'
import { MyLightPP } from '../../9_postprocessors/light.postprocessor'
import { MyApp } from '../../app'

export interface LevelConfigs {
    playerSpawnPos: Vector
}

export class BaseLevelScene extends Scene {
    protected player: PlayerActor

    constructor(private configs: LevelConfigs) {
        super()
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Create the player at the spawn position
        this.player = new PlayerActor()
        this.player.pos = this.configs.playerSpawnPos
        this.add(this.player)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)
        MyLightPP.Enable()
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Open the pause menu
        if (MyInputs.IsButtonStartPressed(engine)) {
            MyApp.OpenPause()
        }
    }
}
