import { Engine, Scene, SceneActivationContext } from 'excalibur'
import { MySounds } from '../1_utils/sound_handling'
import { MyStorage } from '../1_utils/storage'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'
import { EndingLevelScene } from './levels/ending.level.scene'
import { IntroductionLevelScene } from './levels/introduction.level.scene'
import { Level1LevelScene } from './levels/level1.level.scene'
import { Level2LevelScene } from './levels/level2.level.scene'
import { PreEndingLevelScene } from './levels/preending.level.scene'

export interface GameSceneActivationCtx {
    level?: string
}

export class GameScene extends Scene {
    private level: string = 'introduction'

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }

    onActivate(context: SceneActivationContext<GameSceneActivationCtx>) {
        super.onActivate(context)
        MyLightPP.ClearLightPoints()
        MyLightPP.Disable()
        MyLightPP.SetShowingDialog(false)

        // Load the level
        this.level =
            context?.data?.level ?? MyStorage.Retrieve('level', 'introduction')
        MyStorage.Store('level', this.level)
        this.openLevel()

        // Start the music
        MySounds.PlayMusicTheme()
    }

    private openLevel() {
        this.engine.removeScene('level')
        switch (this.level) {
            case 'introduction':
                this.engine.addScene('level', new IntroductionLevelScene())
                break
            case 'level1':
                this.engine.addScene('level', new Level1LevelScene())
                break
            case 'level2':
                this.engine.addScene('level', new Level2LevelScene())
                break
            case 'pre-ending':
                this.engine.addScene('level', new PreEndingLevelScene())
                break
            case 'ending':
                this.engine.addScene('level', new EndingLevelScene())
                break
            default:
                console.warn('Unknown level:', this.level)
                void this.engine.goToScene('menu')
                return
        }
        void this.engine.goToScene('level')
    }
}
