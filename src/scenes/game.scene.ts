import { Engine, Scene, SceneActivationContext } from 'excalibur'
import { MyStorage } from '../utils/storage'

export class GameScene extends Scene {
    private level: number = 0

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        this.level = MyStorage.Retrieve<number>('level', 0)
        this.openLevel()
    }

    private openLevel() {}
}
