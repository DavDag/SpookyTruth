import {
    Color,
    Engine,
    Font,
    Label,
    Scene,
    TextAlign,
    Timer,
    Vector,
} from 'excalibur'

import { MyApp } from '../app'

export class GameScene extends Scene {
    public pauseable = true

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const game = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
            color: Color.White,
            text: 'Game running: 0/3s',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        this.add(game)

        const timer = new Timer({
            interval: 1000,
            fcn: () => {
                game.text = `Game running: ${timer.timesRepeated + 1}/3s`
                if (timer.timesRepeated + 1 == 3) {
                    MyApp.GameOver()
                }
            },
            repeats: true,
            numberOfRepeats: 3,
        })
        this.add(timer)
        timer.start()
    }
}
