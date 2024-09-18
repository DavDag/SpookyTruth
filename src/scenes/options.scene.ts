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

export class OptionsScene extends Scene {
    private selected = 0
    private selector: Actor
    private menuItems: Label[] = []
    private menuItemsValues: Label[] = []

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Menu items
        const sfx = new Label({
            text: 'sfx:',
            pos: new Vector(20, 20),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Start,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(sfx)
        this.menuItems.push(sfx)
        const sfxV = new Label({
            text: `${(MySounds.SfxVolume * 100).toFixed(0)}%`,
            pos: new Vector(140, 20),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.End,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(sfxV)
        this.menuItemsValues.push(sfxV)
        const music = new Label({
            text: 'music:',
            pos: new Vector(20, 40),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Start,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(music)
        this.menuItems.push(music)
        const musicV = new Label({
            text: `${(MySounds.MusicVolume * 100).toFixed(0)}%`,
            pos: new Vector(140, 40),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.End,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(musicV)
        this.menuItemsValues.push(musicV)
        const palette = new Label({
            text: 'palette:',
            pos: new Vector(20, 60),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Start,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(palette)
        this.menuItems.push(palette)
        const paletteV = new Label({
            text: MyApp.Palette,
            pos: new Vector(140, 60),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.End,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(paletteV)
        this.menuItemsValues.push(paletteV)
        const back = new Label({
            text: 'back',
            pos: new Vector(20, 124),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Start,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(back)
        this.menuItems.push(back)

        // Selector
        this.selector = new Label({
            text: '>',
            pos: Vector.Zero,
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
            offset: new Vector(-10, 0),
        })
        this.add(this.selector)
        this.selector.z = 10

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
        if (MyInputs.IsPadDownPressed(engine)) {
            newSelected = (newSelected + 1) % this.menuItems.length
        }
        if (MyInputs.IsPadUpPressed(engine)) {
            newSelected =
                (newSelected - 1 + this.menuItems.length) %
                this.menuItems.length
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
            MySounds.PlayMenuInteraction()
        }

        // Handle selection
        if (MyInputs.IsButtonAPressed(engine)) {
            if (this.selected === 0) {
                MySounds.IncreaseSfxVolume()
                this.menuItemsValues[this.selected].text =
                    `${(MySounds.SfxVolume * 100).toFixed(0)}%`
                MySounds.PlayMenuInteraction()
            }
            if (this.selected === 1) {
                MySounds.IncreaseMusicVolume()
                this.menuItemsValues[this.selected].text =
                    `${(MySounds.MusicVolume * 100).toFixed(0)}%`
                MySounds.PlayMenuInteraction()
            }
            if (this.selected === 2) {
                MyApp.NextPalette()
                this.menuItemsValues[this.selected].text = MyApp.Palette
                MySounds.PlayMenuInteraction()
            }
            if (this.selected === 3) {
                MySounds.PlayMenuInteraction()
                void this.engine.goToScene('menu')
            }
        }
        if (MyInputs.IsButtonBPressed(engine)) {
            MySounds.PlayMenuInteraction()
            void this.engine.goToScene('menu')
        }
    }
}
