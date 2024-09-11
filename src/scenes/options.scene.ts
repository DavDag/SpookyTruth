import { Color, Engine, Font, Label, Scene, TextAlign, Vector } from 'excalibur'
import { MyApp } from '../app'

export class OptionsScene extends Scene {
    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const options = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight - 100),
            color: Color.White,
            text: 'Options',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        this.add(options)

        const menu = new Label({
            pos: Vector.Zero,
            color: Color.White,
            text: 'back to menu',
            font: new Font({
                family: 'Arial',
                size: 20,
                quality: 2,
            }),
        })
        menu.on('pointerup', () => MyApp.BackToMenu())
        this.add(menu)
    }
}
