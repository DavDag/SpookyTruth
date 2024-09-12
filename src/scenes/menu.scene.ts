import {
    ActionSequence,
    Actor,
    Engine,
    Keys,
    ParallelActions,
    RotationType,
    Scene,
    Sprite,
    Vector,
} from 'excalibur'
import { MyApp } from '../app'
import { Resources } from '../assets/resources'
import { Palette, PALETTES } from '../postprocessors/gameboy_pp'

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
                height: 72,
            },
        })
        this._gb.graphics.use(gbSprite)
        this.add(this._gb)

        this._gb.pos = new Vector(engine.drawWidth, 0)
        this._gb.actions.runAction(
            new ParallelActions([
                new ActionSequence(this._gb, (ctx) => {
                    ctx.rotateBy(Math.PI, Math.PI, RotationType.Clockwise)
                    ctx.rotateBy(Math.PI, Math.PI, RotationType.Clockwise)
                }),
                new ActionSequence(this._gb, (ctx) => {
                    ctx.moveTo(
                        new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
                        100
                    )
                }),
                new ActionSequence(this._gb, (ctx) => {
                    ctx.scaleTo(Vector.One.scale(0.5), Vector.One.scale(0.5))
                    ctx.scaleTo(Vector.One, Vector.One.scale(0.5))
                }),
            ])
        )
    }

    private paletteSubIndex = 0
    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        if (engine.input.keyboard.wasPressed(Keys.NumpadAdd)) {
            this.paletteSubIndex += 4

            const indexBy4 = Math.floor(this.paletteSubIndex / 4)
            const p: Palette = [
                PALETTES[
                    Object.keys(PALETTES)[
                        Math.floor((this.paletteSubIndex + 0) / 4) %
                            Object.keys(PALETTES).length
                    ]
                ][(this.paletteSubIndex + 0) % 4],
                PALETTES[
                    Object.keys(PALETTES)[
                        Math.floor((this.paletteSubIndex + 1) / 4) %
                            Object.keys(PALETTES).length
                    ]
                ][(this.paletteSubIndex + 1) % 4],
                PALETTES[
                    Object.keys(PALETTES)[
                        Math.floor((this.paletteSubIndex + 2) / 4) %
                            Object.keys(PALETTES).length
                    ]
                ][(this.paletteSubIndex + 2) % 4],
                PALETTES[
                    Object.keys(PALETTES)[
                        Math.floor((this.paletteSubIndex + 3) / 4) %
                            Object.keys(PALETTES).length
                    ]
                ][(this.paletteSubIndex + 3) % 4],
            ]

            MyApp.SetPalette(p)
        }
    }
}
