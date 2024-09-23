import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class Level2LevelScene extends BaseLevelScene {
    constructor() {
        super({
            name: 'level2',
            tiledRes: Resources.levels.level2,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }
}
