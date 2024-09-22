import { Actor, Engine, Scene, Vector } from 'excalibur'
import { LightPoint, MyLightPP } from '../9_postprocessors/light.postprocessor'

export type LightType = 'player.candle' | 'castle.candle' | 'castle.lantern'

export class LightActor extends Actor {
    private type: LightType
    private lightPoint: LightPoint

    constructor(pos: Vector, type: LightType) {
        super({
            name: 'light',
            pos: pos,
            width: 4,
            height: 4,
        })

        this.type = type
        this.lightPoint = MyLightPP.NewLightPoint(
            this.pos,
            type === 'castle.candle' ? 20 : 40
        )
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Update light position
        this.lightPoint.pos = engine.worldToScreenCoordinates(
            this.getGlobalPos()
        )
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        console.log('LightActor.onPreKill', this.type)
        MyLightPP.RemoveLightPoint(this.lightPoint)
    }
}
