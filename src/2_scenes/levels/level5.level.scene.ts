import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class Level5LevelScene extends BaseLevelScene {
    constructor() {
        super({
            name: 'level5',
            tiledRes: Resources.levels.level5,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }
}
