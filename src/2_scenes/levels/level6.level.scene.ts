import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class Level6LevelScene extends BaseLevelScene {
    constructor() {
        super({
            name: 'level6',
            tiledRes: Resources.levels.level6,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }
}
