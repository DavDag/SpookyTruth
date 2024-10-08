import {
    Engine,
    Label,
    Scene,
    SceneActivationContext,
    TextAlign,
    Vector,
} from 'excalibur'
import { Resources } from '../0_assets/resources'
import { MyInputs } from '../1_utils/input_handling'
import { MySounds } from '../1_utils/sound_handling'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'

export class CreditsScene extends Scene {
    private text: Label

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        this.text = new Label({
            text:
                'Art by\n\nChiara Costagli\nDavide Risaliti\nIrene Costagli\n\n\n' +
                'Music by\n\nIrene Costagli\n\n\n' +
                'Programming by\n\nDavide Risaliti\n\n\n' +
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
        MyLightPP.Disable()

        this.text.actions.clearActions()
        this.text.pos = new Vector(80, 140)
        this.text.actions.moveBy(0, -500, 25)

        // Play theme
        MySounds.PlayCreditsTheme()
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        if (MyInputs.IsButtonBPressed(engine)) {
            void this.engine.goToScene('menu')

            // Play sound
            MySounds.PlayMenuInteraction()

            // Stop theme
            MySounds.StopCreditsTheme()
        }
    }
}
