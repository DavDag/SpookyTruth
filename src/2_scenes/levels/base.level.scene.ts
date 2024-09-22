import { TiledResource } from '@excaliburjs/plugin-tiled'
import { Engine, Scene, SceneActivationContext, Vector } from 'excalibur'
import { MyInputs } from '../../1_utils/input_handling'
import { MyStorage } from '../../1_utils/storage'
import { DoorActor } from '../../3_actors/door.actor'
import { LightActor, LightType } from '../../3_actors/light.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { MyLightPP } from '../../9_postprocessors/light.postprocessor'
import { MyApp } from '../../app'

export interface LevelConfigs {
    name: string
    tiledRes: TiledResource
}

export class BaseLevelScene extends Scene {
    protected player: PlayerActor

    constructor(private configs: LevelConfigs) {
        super()
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Create doors from the Tiled map
        this.configs.tiledRes.getObjectsByClassName('door').forEach((obj) => {
            const d = new DoorActor(new Vector(obj.x, obj.y - 16), obj.name)
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
        this.player.pos.add(new Vector(0.5, 0.5).scale(16))
        this.add(this.player)

        // Spawn on the spawn point
        const obj = this.configs.tiledRes.getObjectsByName('spawn')?.[0]
        this.player.pos.x = obj?.x ?? 0
        this.player.pos.y = (obj?.y ?? 16) - 16

        // Spawn on the last door used
        const lastLevelName: string = MyStorage.Retrieve(
            'lastLevelName',
            'spawn'
        )
        this.configs.tiledRes.getObjectsByName(lastLevelName).forEach((obj) => {
            this.player.pos.x = obj.x
            this.player.pos.y = obj.y - 16
        })

        // Camera strategy
        this.camera.strategy.elasticToActor(this.player, 0.1, 0.1)

        // Load the Tiled map (& camera strategy using plugin)
        this.configs.tiledRes.addToScene(this)

        // Listen to the player entering a door
        this.player.onDoorEnter$.subscribe((door) => this.onDoorEnter(door))
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

    private onDoorEnter(door: DoorActor) {
        console.log(`Player entered door towards: ${door.dest}`)
        this.goToLevel(door.dest)
    }

    public goToLevel(level: string) {
        MyStorage.Store('lastLevelName', this.configs.name)
        void this.engine.goToScene('game', {
            sceneActivationData: {
                level,
            },
        })
    }
}
