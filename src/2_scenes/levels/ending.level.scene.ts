import { Engine, SceneActivationContext } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { MySounds } from '../../1_utils/sound_handling'
import { MyStorage } from '../../1_utils/storage'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { UnlockMemoryPiece } from '../memory.scene'
import { BaseLevelScene } from './base.level.scene'

export class EndingLevelScene extends BaseLevelScene {
    private enterRoomDialog: DialogActor
    private candleOffDialog: DialogActor
    private mirrorClickDialog: DialogActor
    private lastMemoryPieceDialog: DialogActor
    private fromMemory = false

    constructor() {
        super({
            name: 'ending',
            tiledRes: Resources.levels.ending,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

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
            this.fromMemory = true
            void UnlockMemoryPiece(engine, 'level', 8)
        })
        this.add(this.mirrorClickDialog)
        this.player.onMirrorEnter$.subscribe(() =>
            // TODO: Show mirror image
            this.mirrorClickDialog.next()
        )

        // Add dialog (last memory piece)
        this.lastMemoryPieceDialog = new DialogActor(
            new DialogData({
                text: 'Now I do remember...\nI am...\na ghost...\n...\nMaybe even the other ghosts are just memories...',
            })
        )
        this.add(this.lastMemoryPieceDialog)
        this.lastMemoryPieceDialog.completion$.subscribe(() => {
            MySounds.StopMusicTheme()
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
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)
        if (this.fromMemory) {
            this.lastMemoryPieceDialog.next()
        }
    }
}
