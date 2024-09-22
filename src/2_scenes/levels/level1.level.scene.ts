import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { BaseLevelScene } from './base.level.scene'

export class Level1LevelScene extends BaseLevelScene {
    private dialog: DialogActor

    constructor() {
        super({
            name: 'level1',
            tiledRes: Resources.levels.level1,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Add dialog
        this.dialog = new DialogActor(
            new DialogData({
                text: '',
            })
        )
        this.dialog.completion$.subscribe(() => {
            this.player.enable()
        })
        this.add(this.dialog)

        // Enable player
        this.player.enable()
    }
}
