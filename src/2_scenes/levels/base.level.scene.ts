import { TiledResource } from '@excaliburjs/plugin-tiled'
import { Engine, Scene, SceneActivationContext, Vector } from 'excalibur'
import { MyInputs } from '../../1_utils/input_handling'
import { DoorActor } from '../../3_actors/door.actor'
import { LightActor, LightType } from '../../3_actors/light.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { MyLightPP } from '../../9_postprocessors/light.postprocessor'
import { MyApp } from '../../app'

export interface LevelConfigs {
    playerSpawnTile: Vector
    tiledRes: TiledResource
}

export class BaseLevelScene extends Scene {
    protected player: PlayerActor

    constructor(private configs: LevelConfigs) {
        super()
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Load the Tiled map
        this.configs.tiledRes.addToScene(this)

        // Create doors from the Tiled map
        this.configs.tiledRes.getTilesByProperty('door').forEach((tile) => {
            const d = new DoorActor(tile.exTile.pos)
            this.add(d)
        })

        // Create lights from the Tiled map
        this.configs.tiledRes.getTilesByProperty('light').forEach((tile) => {
            const l = new LightActor(
                tile.exTile.pos.add(new Vector(0.5, 0.5).scale(16)),
                (tile.tiledTile.properties.get('light') ??
                    'castle.candle') as LightType
            )
            this.add(l)
        })

        // Create the player at the spawn position
        this.player = new PlayerActor()
        this.player.pos = this.configs.playerSpawnTile.scale(16)
        this.add(this.player)

        // Listen to the player entering a door
        this.player.onDoorEnter$.subscribe((door) => {
            console.log('Player entered door', door)
            // TODO: Change level
        })
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
