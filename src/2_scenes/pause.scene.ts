import {
    Actor,
    BaseAlign,
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
import { MyStorage } from '../1_utils/storage'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'
import { MyApp } from '../app'

export interface PauseSceneActivationCtx {
    backScene: string
}

export class PauseScene extends Scene {
    private backScene: string

    private selected = 0
    private selector: Actor
    private menuItems: Label[] = []

    private level = 0
    private levelName: Label

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Title
        const title = new Label({
            text: 'game paused',
            pos: new Vector(80, 20),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(title)

        // Level name
        this.levelName = new Label({
            // templated string
            text: `level: ${this.level}`,
            pos: new Vector(2, 142),
            font: Resources.font.main.toFont({
                size: 12,
                textAlign: TextAlign.Left,
                baseAlign: BaseAlign.Bottom,
            }),
        })
        this.add(this.levelName)

        // Menu items
        const resume = new Label({
            text: 'resume',
            pos: new Vector(80, 60),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(resume)
        this.menuItems.push(resume)
        const memory = new Label({
            text: 'memory',
            pos: new Vector(80, 80),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(memory)
        this.menuItems.push(memory)
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
        const quit = new Label({
            text: 'quit',
            pos: new Vector(80, 120),
            font: Resources.font.main.toFont({
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle,
            }),
        })
        this.add(quit)
        this.menuItems.push(quit)

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
        this.selector.pos = this.menuItems[this.selected].pos.clone()
        this.menuItems[this.selected].actions.repeatForever((ctx) => {
            ctx.scaleTo(1.2, 1.2, 1, 1).scaleTo(1, 1, 1, 1)
        })
    }

    onActivate(context: SceneActivationContext<PauseSceneActivationCtx>) {
        super.onActivate(context)
        MyLightPP.Disable()

        // Update back scene
        this.backScene = context.data?.backScene ?? this.backScene

        // Update level
        this.level = MyStorage.Retrieve<number>('level', 0)
        this.levelName.text = `level: ${this.level}`
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Handle input
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
                // Resume
                case 0:
                    void engine.goToScene(this.backScene)
                    break

                // Memory
                case 1:
                    void engine.goToScene('memory', {
                        sceneActivationData: {
                            backScene: 'pause',
                        },
                    })
                    break

                // Options
                case 2:
                    MyApp.OpenOptions()
                    break

                // Quit
                case 3:
                    engine.removeScene('level')
                    MyStorage.Store('lastLevelName', '')
                    void engine.goToScene('menu').then(() => {
                        this.resetSelector()
                    })
                    MySounds.StopMusicTheme()
                    break
            }

            // Play sound
            MySounds.PlayMenuInteraction()
        }

        // Back to game
        if (MyInputs.IsButtonBPressed(engine)) {
            void engine.goToScene(this.backScene).then(() => {
                this.resetSelector()
            })

            // Play sound
            MySounds.PlayMenuInteraction()
        }
    }

    private resetSelector() {
        // Reset previous selection
        this.menuItems[this.selected].scale.setTo(1, 1)
        this.menuItems[this.selected].actions.clearActions()

        // Update selection
        this.selected = 0

        // Update selector position
        this.selector.pos = this.menuItems[this.selected].pos.clone()
        this.menuItems[this.selected].actions.repeatForever((ctx) => {
            ctx.scaleTo(1.2, 1.2, 1, 1).scaleTo(1, 1, 1, 1)
        })
    }
}
