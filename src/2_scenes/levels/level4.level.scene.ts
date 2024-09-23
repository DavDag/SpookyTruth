import { Engine } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { BaseLevelScene } from './base.level.scene'

export class Level4LevelScene extends BaseLevelScene {
    constructor() {
        super({
            name: 'level4',
            tiledRes: Resources.levels.level4,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
    }
}
