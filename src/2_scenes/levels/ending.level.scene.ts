import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { PlayerActor } from '../../3_actors/player.actor'
import { UnlockMemoryPiece } from '../memory.scene'
import { BaseLevelScene } from './base.level.scene'

export class EndingLevelScene extends BaseLevelScene {
    private enterRoomDialog: DialogActor
    private candleOffDialog: DialogActor
    private mirrorClickDialog: DialogActor

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
            void UnlockMemoryPiece(engine, 'ending', 9)
        })
        this.add(this.mirrorClickDialog)

        // Start dialog
        this.player.disable()
        this.enterRoomDialog.actions.callMethod(() =>
            this.enterRoomDialog.next()
        )
    }
}
