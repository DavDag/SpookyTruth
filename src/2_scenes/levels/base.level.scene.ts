import { TiledResource } from '@excaliburjs/plugin-tiled'
import { Engine, Scene, SceneActivationContext, Vector } from 'excalibur'
import { MyInputs } from '../../1_utils/input_handling'
import { MySounds } from '../../1_utils/sound_handling'
import { MyStorage } from '../../1_utils/storage'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { DoorActor } from '../../3_actors/door.actor'
import { GhostActor } from '../../3_actors/ghost.actor'
import { LightActor, LightType } from '../../3_actors/light.actor'
import { MirrorActor } from '../../3_actors/mirror.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { PostItActor } from '../../3_actors/postit.actor'
import { MyLightPP } from '../../9_postprocessors/light.postprocessor'
import { MyApp } from '../../app'
import { UnlockMemoryPiece } from '../memory.scene'

export interface LevelConfigs {
    name: string
    tiledRes: TiledResource
}

export class BaseLevelScene extends Scene {
    private deathDialog: DialogActor
    protected player: PlayerActor

    protected doors: DoorActor[] = []

    constructor(private configs: LevelConfigs) {
        super()
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Create doors from the Tiled map
        this.configs.tiledRes.getObjectsByClassName('door').forEach((obj) => {
            const d = new DoorActor(new Vector(obj.x, obj.y - 16), obj.name)
            this.add(d)
            this.doors.push(d)
        })

        // Create mirrors from the Tiled map
        this.configs.tiledRes.getTilesByClassName('mirror').forEach((tile) => {
            const m = new MirrorActor(tile.exTile.pos)
            this.add(m)
        })

        // Create post-its from the Tiled map
        this.configs.tiledRes.getObjectsByClassName('postit').forEach((obj) => {
            const p = new PostItActor(
                new Vector(obj.x, obj.y - 16),
                parseInt(obj.name)
            )
            this.add(p)
        })

        // Create ghosts from the Tiled map
        this.configs.tiledRes.getObjectsByClassName('ghost').forEach((obj) => {
            const g = new GhostActor(obj.name, new Vector(obj.x, obj.y - 16), {
                wanderingDistance:
                    (obj.properties.get('wandering_dist') as number) ?? 0,
            })
            this.add(g)
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
        this.camera.strategy.lockToActor(this.player)

        // Load the Tiled map (& camera strategy using plugin)
        this.configs.tiledRes.addToScene(this)

        // Listen to the player entering a door
        this.player.onDoorEnter$.subscribe((door) => this.onDoorEnter(door))

        // Listen to the player opening a post-it
        this.player.onPostItEnter$.subscribe((postit) =>
            this.onPostItEnter(postit)
        )

        // Death dialog
        if (
            MyStorage.Retrieve('deathCount', 0) > 0 &&
            MyStorage.Retrieve('deathDialog', 0) === 0
        ) {
            // First death
            this.deathDialog = new DialogActor(
                new DialogData({
                    text: "I'm so scared by those ghosts...\nI should be more careful.",
                })
            )
            this.deathDialog.completion$.subscribe(() => {
                this.player.enable()
                MySounds.ResumeMusicTheme()
                MyStorage.Store('deathDialog', 1)
            })
            this.add(this.deathDialog)

            // Start the dialog
            MySounds.PauseMusicTheme()
            this.player.disable()
            this.deathDialog.actions.callMethod(() => this.deathDialog.next())
        }
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

    protected onDoorEnter(door: DoorActor) {
        // console.log(`Player entered door towards: ${door.dest}`)
        this.goToLevel(door.dest)
    }

    protected onPostItEnter(postit: PostItActor) {
        postit.kill()
        void UnlockMemoryPiece(this.engine, 'level', postit.piece)
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
