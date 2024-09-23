import {
    Actor,
    Engine,
    SceneActivationContext,
    Sprite,
    Vector,
} from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { MySounds } from '../../1_utils/sound_handling'
import { MyStorage } from '../../1_utils/storage'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { MyLightPP } from '../../9_postprocessors/light.postprocessor'
import { UnlockMemoryPiece } from '../memory.scene'
import { BaseLevelScene } from './base.level.scene'

export class EndingLevelScene extends BaseLevelScene {
    private enterRoomDialog: DialogActor
    private candleOffDialog: DialogActor
    private mirrorClickDialog: DialogActor
    private lastMemoryPieceDialog: DialogActor
    private fromMemory = false

    private finalImage: Actor

    constructor() {
        super({
            name: 'ending',
            tiledRes: Resources.levels.ending,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Final image
        this.finalImage = new Actor({
            pos: Vector.Zero,
            anchor: Vector.Zero,
            z: 100,
        })
        this.finalImage.graphics.use(
            new Sprite({ image: Resources.image.finale })
        )
        this.finalImage.graphics.opacity = 0
        this.add(this.finalImage)

        // Add dialog (enter room)
        this.enterRoomDialog = new DialogActor(
            new DialogData({
                text: "Is this the last room?\nI'm feeling a bit strange...",
            })
        )
        this.enterRoomDialog.completion$.subscribe(() => {
            this.player.actions
                .moveBy(16, 0, PlayerActor.Speed)
                .callMethod(() => {
                    this.player.candleOff()
                    this.candleOffDialog.next()
                })
        })
        this.add(this.enterRoomDialog)

        // Add dialog (candle off)
        this.candleOffDialog = new DialogActor(
            new DialogData({
                text: 'Oh no!\nMy candle turned off...\nI cannot see anything!',
            })
        )
        this.candleOffDialog.completion$.subscribe(() => {
            this.player.enable()
        })
        this.add(this.candleOffDialog)

        // Add dialog (mirror click)
        this.mirrorClickDialog = new DialogActor(
            new DialogData({
                text: 'Is this a mirror?',
            })
        )
        this.mirrorClickDialog.completion$.subscribe(() => {
            this.finalImage.actions
                .callMethod(() => {
                    MyLightPP.Disable()
                })
                .fade(1, 1000)
                .delay(2000)
                .callMethod(() => {
                    this.finalImage.graphics.opacity = 0
                    this.fromMemory = true
                    void UnlockMemoryPiece(engine, 'level', 8)
                })
        })
        this.add(this.mirrorClickDialog)
        this.player.onMirrorEnter$.subscribe(() =>
            this.mirrorClickDialog.next()
        )

        // Add dialog (last memory piece)
        this.lastMemoryPieceDialog = new DialogActor(
            new DialogData({
                text: 'Now I do remember...\nI am...\na ghost...\n...\nDoes this mean that...\nEvery other ghost I met was searching too?\n...',
            })
        )
        this.add(this.lastMemoryPieceDialog)
        this.lastMemoryPieceDialog.completion$.subscribe(() => {
            MySounds.StopMusicTheme2()
            MyStorage.Store('lastLevelName', '')
            this.engine
                .goToScene('credits')
                .then(() => this.engine.removeScene('level'))
        })

        // Start dialog
        this.player.disable()
        this.enterRoomDialog.actions.callMethod(() =>
            this.enterRoomDialog.next()
        )

        // Play music
        MySounds.PauseMusicTheme()
        MySounds.PlayMusicTheme2()
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)
        if (this.fromMemory) {
            this.lastMemoryPieceDialog.next()
        }
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        this.finalImage.pos.x = this.camera.pos.x - 80
    }
}
