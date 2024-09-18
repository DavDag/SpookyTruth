import {
    Engine,
    Label,
    Scene,
    SceneActivationContext,
    TextAlign,
    Vector,
} from 'excalibur'
import { Resources } from '../assets/resources'
import { MyInputs } from '../utils/input_handling'

export class CreditsScene extends Scene {
    private text: Label

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        this.text = new Label({
            text:
                'Programming by\n\nDavide Risaliti\n\n\n' +
                'Art by\n\nDavide Risaliti\nIrene Costagli\n\n\n' +
                'Music by\n\nIrene Costagli\n\n\n' +
                '\n' +
                'Thanks for\nplaying!',
            pos: Vector.Zero,
            font: Resources.font.main.toFont({
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        this.add(this.text)
    }

    onActivate(context: SceneActivationContext<unknown>) {
        super.onActivate(context)

        this.text.actions.clearActions()
        this.text.pos = new Vector(80, 140)
        this.text.actions.moveBy(0, -480, 25)
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        if (MyInputs.IsButtonBPressed(engine)) {
            void this.engine.goToScene('menu')
        }
    }
}
