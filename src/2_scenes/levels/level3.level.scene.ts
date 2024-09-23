import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class Level3LevelScene extends BaseLevelScene {
    constructor() {
        super({
            name: 'level3',
            tiledRes: Resources.levels.level3,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }
}
