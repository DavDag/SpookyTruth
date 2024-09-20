import { Actor, Color, Engine, Sprite, Vector } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { DoorActor } from '../../3_actors/door.actor'
import { EngineConfigs } from '../../configs'
import { BaseLevelScene } from './base.level.scene'

export class IntroductionLevelScene extends BaseLevelScene {
    private dialog: DialogActor

    constructor() {
        super({
            playerSpawnPos: new Vector(4, 7).scale(16),
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Background
        const bg = new Actor({
            name: 'Background',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 160,
            height: 144,
            color: Color.Violet,
            z: EngineConfigs.BackgroundZIndex,
        })
        bg.graphics.use(
            new Sprite({
                image: Resources.image.introductionRoom,
            })
        )
        this.add(bg)

        // Add exit door
        const door = new DoorActor(new Vector(8, 7), true)
        this.add(door)

        // Add dialog
        this.dialog = new DialogActor(
            new DialogData({
                text: '...\n...\n...\nWhy am I here?\n...\n...\nI need to find a way out!',
            })
        )
        this.dialog.completion$.subscribe(() => this.player.enable())
        this.add(this.dialog)

        // Animate player introduction
        this.player.disable()
        this.player.actions
            .callMethod(async () => {
                await this.player.animateIntroduction()
            })
            .delay(2000)
            .callMethod(() => {
                this.dialog.next()
            })
    }
}
