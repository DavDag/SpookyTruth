import {
    Actor,
    BaseAlign,
    Engine,
    Label,
    Scene,
    TextAlign,
    Vector,
} from 'excalibur'
import { MyApp } from '../app'
import { Resources } from '../assets/resources'
import { MyInputs } from '../utils/input_handling'
import { MySounds } from '../utils/sound_handling'

export class MenuScene extends Scene {
    private selected = 0
    private selector: Actor
    private menuItems: Label[] = []

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Title
        const title = new Label({
            text: 'Spooky Truth',
            pos: new Vector(80, 30),
            font: Resources.font.main.toFont({
                size: 24,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(title)

        // Menu items
        const play = new Label({
            text: 'play',
            pos: new Vector(80, 80),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(play)
        this.menuItems.push(play)
        const options = new Label({
            text: 'options',
            pos: new Vector(80, 100),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(options)
        this.menuItems.push(options)
        const credits = new Label({
            text: 'credits',
            pos: new Vector(80, 120),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(credits)
        this.menuItems.push(credits)

        // Selector
        this.selector = new Label({
            text: '>',
            pos: Vector.Zero,
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
            offset: new Vector(-40, 0),
        })
        this.add(this.selector)

        // Update selector position
        this.selector.pos = this.menuItems[this.selected].pos.clone()
        this.menuItems[this.selected].actions.repeatForever((ctx) => {
            ctx.scaleTo(1.2, 1.2, 1, 1).scaleTo(1, 1, 1, 1)
        })
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Move the selection up and down
        let newSelected = this.selected
        if (MyInputs.IsPadUpPressed(engine)) {
            newSelected =
                (this.selected - 1 + this.menuItems.length) %
                this.menuItems.length
        }
        if (MyInputs.IsPadDownPressed(engine)) {
            newSelected = (this.selected + 1) % this.menuItems.length
        }
        if (newSelected !== this.selected) {
            // Reset previous selection
            this.menuItems[this.selected].scale.setTo(1, 1)
            this.menuItems[this.selected].actions.clearActions()

            // Update selection
            this.selected = newSelected
            this.selector.pos = this.menuItems[this.selected].pos.clone()
            this.menuItems[this.selected].actions.repeatForever((ctx) => {
                ctx.scaleTo(1.2, 1.2, 1, 1).scaleTo(1, 1, 1, 1)
            })

            // Play sound
            // MySounds.PlayMenuInteraction()
        }

        // Handle selection
        if (MyInputs.IsButtonAPressed(engine)) {
            switch (this.selected) {
                // Play
                case 0:
                    void this.engine.goToScene('game')
                    break

                // Options
                case 1:
                    MyApp.OpenOptions()
                    break

                // Credits
                case 2:
                    void this.engine.goToScene('credits')
                    break
            }

            // Play sound
            MySounds.PlayMenuInteraction()
        }
    }
}
