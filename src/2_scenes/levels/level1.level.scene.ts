import { Engine, SceneActivationContext } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { PostItActor } from '../../3_actors/postit.actor'
import { BaseLevelScene } from './base.level.scene'

export class Level1LevelScene extends BaseLevelScene {
    private prePostItDialog: DialogActor
    private afterPostItDialog: DialogActor
    private fromMemory = false

    constructor() {
        super({
            name: 'level1',
            tiledRes: Resources.levels.level1,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Add dialog
        this.prePostItDialog = new DialogActor(
            new DialogData({
                text: "What is this object?\nIt looks like a post-it note.\n...\nWait!\nI'm remembering something!",
            })
        )
        this.add(this.prePostItDialog)

        this.afterPostItDialog = new DialogActor(
            new DialogData({
                text: "...\nIt's hard to remember properly...\nThose post-it notes seems to help\nLet's search for more of them",
            })
        )
        this.afterPostItDialog.completion$.subscribe(() => {
            this.fromMemory = false
            this.player.enable()
        })
        this.add(this.afterPostItDialog)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        if (this.fromMemory) {
            this.afterPostItDialog.next()
        }
    }

    protected onPostItEnter(postit: PostItActor) {
        // Before proceeding collecting the postit, show dialog
        this.player.disable()
        this.prePostItDialog.next()
        this.prePostItDialog.completion$.subscribe(() => {
            this.fromMemory = true
            super.onPostItEnter(postit)
        })
    }
}
