import { Actor, Color, Engine, Sprite, Vector } from 'excalibur'
import { DoorActor } from '../../actors/door.actor'
import { Resources } from '../../assets/resources'
import { EngineConfigs } from '../../configs'
import { BaseLevelScene } from './base.level.scene'

export class IntroductionLevelScene extends BaseLevelScene {
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

        // Animate player introduction
        this.player.actions.clearActions()
        this.player.actions.callMethod(() => {
            this.player.animateIntroduction().then(() => {
                // TODO: Dialog
            })
        })
    }
}
