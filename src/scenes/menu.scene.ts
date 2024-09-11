import { Color, Engine, Font, Label, Scene, TextAlign, Vector } from 'excalibur'
import { MyApp } from '../app'

export class MenuScene extends Scene {
    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const start = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
            color: Color.White,
            text: 'Start game',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        start.on('pointerup', () => MyApp.StartGame())
        this.add(start)

        const options = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight + 20),
            color: Color.White,
            text: 'Options',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        options.on('pointerup', () => MyApp.Options())
        this.add(options)

        const credits = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight + 40),
            color: Color.White,
            text: 'Credits',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        credits.on('pointerup', () => MyApp.Credits())
        this.add(credits)
    }
}
