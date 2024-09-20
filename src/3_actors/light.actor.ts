import { Actor, Engine, Scene, Vector } from 'excalibur'
import { LightPoint, MyLightPP } from '../9_postprocessors/light.postprocessor'

type LightType = 'player.candle'

export class LightActor extends Actor {
    private type: LightType
    private lightPoint: LightPoint

    constructor(pos: Vector, type: LightType) {
        super({
            name: 'light',
            pos: pos,
        })

        this.type = type
        this.lightPoint = MyLightPP.NewLightPoint(this.pos, 40)
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Update light position
        this.lightPoint.pos = this.getGlobalPos()
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        MyLightPP.RemoveLightPoint(this.lightPoint)
    }
}
