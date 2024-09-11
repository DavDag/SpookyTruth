import { Actor, Color, Engine, Font, Label, Scene, Sprite, TextAlign, Vector } from 'excalibur'
import { MyApp } from '../app'
import { Resources } from '../assets/resources'

export class MenuScene extends Scene {
    private _gb: Actor

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        this._gb = new Actor({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
        })
        const gbSprite = new Sprite({
            image: Resources.image.gameboy,
            sourceView: {
                x: 0,
                y: 0,
                width: Resources.image.gameboy.width,
                height: Resources.image.gameboy.height,
            },
            destSize: {
                width: 44,
                height: 72
            }
        })
        this._gb.graphics.use(gbSprite)
        this.add(this._gb)

        this._gb.actions.clearActions()
        this._gb.actions
            .scaleBy(new Vector(0.5, 0.5), 0.25)
            .rotateBy(Math.PI, (Math.PI / 0.5))
    }
}
