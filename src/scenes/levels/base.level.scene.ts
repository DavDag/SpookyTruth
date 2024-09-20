import { Engine, Scene, Vector } from 'excalibur'
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

        // Create the player at the spawn position
        this.player = new PlayerActor()
        this.player.pos = this.configs.playerSpawnPos
        this.add(this.player)
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Open the pause menu
        if (MyInputs.IsButtonStartPressed(engine)) {
            MyApp.OpenPause()
        }
    }
}
