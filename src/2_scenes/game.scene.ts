import { Engine, Scene, SceneActivationContext } from 'excalibur'
import { MySounds } from '../1_utils/sound_handling'
import { MyStorage } from '../1_utils/storage'
import { IntroductionLevelScene } from './levels/introduction.level.scene'

export class GameScene extends Scene {
    private level: number = 0

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        // Load the level
        this.level = MyStorage.Retrieve<number>('level', 0)
        this.openLevel()

        // Start the music
        MySounds.PlayMusicTheme()
    }

    private openLevel() {
        switch (this.level) {
            case 0:
                this.engine.addScene('level', new IntroductionLevelScene())
                void this.engine.goToScene('level')
                break
        }
    }
}
