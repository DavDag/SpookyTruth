import { Engine, Scene, SceneActivationContext } from 'excalibur'
import { MyStorage } from '../utils/storage'
import { IntroductionLevelScene } from './levels/introduction.level.scene'
import { MySounds } from '../utils/sound_handling'

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
