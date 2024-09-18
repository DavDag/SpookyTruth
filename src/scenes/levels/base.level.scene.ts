import { Engine, Scene, SceneActivationContext, Vector } from 'excalibur'
import { PlayerActor } from '../../actors/player.actor'
import { MyApp } from '../../app'
import { MyInputs } from '../../utils/input_handling'

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

        this.player = new PlayerActor()
        this.add(this.player)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        this.player.pos = this.configs.playerSpawnPos
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        if (MyInputs.IsButtonStartPressed(engine)) {
            MyApp.Pause()
        }
    }
}
