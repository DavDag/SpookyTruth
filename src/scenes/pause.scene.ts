import { BaseAlign, Engine, Label, Scene, TextAlign, Vector } from 'excalibur'
import { MyApp } from '../app'
import { Resources } from '../assets/resources'
import { MyInputs } from '../utils/input_handling'

export class PauseScene extends Scene {
    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const pause = new Label({
            text: 'paused',
            pos: new Vector(80, 72),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(pause)

        // TODO: Add level name
        // TODO: Add last checkpoint
        // TODO: Add buttons guide
        // TODO: Add memory scene
        // TODO: Add option to quit
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        if (MyInputs.IsButtonBPressed(engine)) {
            MyApp.Resume()
        }
    }
}
