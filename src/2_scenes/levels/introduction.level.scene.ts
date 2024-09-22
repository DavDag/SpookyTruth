import { Engine, Vector } from 'excalibur'
import { take } from 'rxjs'
import { Resources } from '../../0_assets/resources'
import { MySounds } from '../../1_utils/sound_handling'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { BaseLevelScene } from './base.level.scene'

export class IntroductionLevelScene extends BaseLevelScene {
    private dialog: DialogActor

    constructor() {
        super({
            playerSpawnTile: new Vector(4, 7),
            tiledRes: Resources.levels.introduction,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
        MySounds.PauseMusicTheme()

        // // Background
        // const bg = new Actor({
        //     name: 'Background',
        //     pos: Vector.Zero,
        //     anchor: Vector.Zero,
        //     width: 160,
        //     height: 144,
        //     color: Color.Violet,
        //     z: EngineConfigs.BackgroundZIndex,
        // })
        // bg.graphics.use(
        //     new Sprite({
        //         image: Resources.image.introductionRoom,
        //     })
        // )
        // this.add(bg)

        // Add dialog
        this.dialog = new DialogActor(
            new DialogData({
                text: '...\nWhy am I here?\n...\nI need to find a way out!',
            })
        )
        this.dialog.completion$.subscribe(() => {
            this.player.enable()
            MySounds.ResumeMusicTheme()
        })
        this.add(this.dialog)

        // Animate player introduction
        this.player.disable()
        this.player.actions.callMethod(() => this.player.animateIntroduction())
        this.player.onIntroductionEnd$
            .pipe(take(1))
            .subscribe(() => this.dialog.next())
    }
}
