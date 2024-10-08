import { Actor, Color, Engine, Scene, Sprite, Vector } from 'excalibur'
import { Subject, takeUntil } from 'rxjs'
import { Resources } from '../0_assets/resources'
import { MyLabel } from '../1_utils/font_handling'
import { MyInputs } from '../1_utils/input_handling'
import { MySounds } from '../1_utils/sound_handling'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'
import { EngineConfigs } from '../configs'
import { InteractionsActor } from './interactions.actor'

export interface DialogDataProps {
    text: string
}

export class DialogData {
    private readonly _props: DialogDataProps
    private _line: number
    private _index: number
    private readonly _lines: string[]

    constructor(props: DialogDataProps) {
        this._props = props
        this._line = -1
        this._index = -1
        this._lines = props.text.split('\n')

        // Add manual line break every 16 characters
        this._lines = this._lines.map((line) => {
            if (line.length <= 17) return line
            return line
                .split(' ')
                .reduce(
                    (acc, word) => {
                        if (
                            acc[0].length + word.length < 17 &&
                            acc[1].length == 0
                        ) {
                            acc[0] += word + ' '
                        } else if (
                            acc[1].length + word.length < 17 &&
                            acc[2].length == 0
                        ) {
                            acc[1] += word + ' '
                        } else {
                            acc[2] += word + ' '
                        }
                        return acc
                    },
                    ['', '', '']
                )
                .map((l) => {
                    if (l.length > 17) throw new Error('Line too long: ' + l)
                    return l
                })
                .join('\n')
        })
    }

    public get text() {
        return this._lines[this._line].slice(0, this._index)
    }

    public get length() {
        return this._lines[this._line].length
    }

    public nextLine() {
        this._line++
        this._index = 0
        return this._line == this._lines.length
    }

    public nextChar() {
        this._index++
        return this._index > this._lines[this._line].length
    }

    public complete() {
        this._index = this._lines[this._line].length
    }

    public isComplete() {
        return this._index == this._lines[this._line].length
    }
}

export class DialogActor extends Actor {
    private dieSub = new Subject<void>()
    private completionSub = new Subject<void>()
    public completion$ = this.completionSub.pipe(takeUntil(this.dieSub))

    private data: DialogData
    private text: MyLabel
    private interaction: InteractionsActor

    constructor(data: DialogData) {
        super({
            name: 'dialog',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 160,
            height: 48,
            color: Color.Violet,
            z: EngineConfigs.DialogZIndex,
        })

        this.data = data
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Add dialog background
        const sprite = new Sprite({ image: Resources.image.dialog })
        this.graphics.use(sprite)

        // Add dialog text
        this.text = new MyLabel({
            name: 'dialog.text',
            pos: new Vector(4, 4),
            anchor: Vector.Zero,
            z: EngineConfigs.DialogZIndex,
        })
        this.addChild(this.text)

        // Add interactions
        this.interaction = new InteractionsActor(new Vector(9, 2), 'buttonA')
        this.addChild(this.interaction)

        // Start as invisible
        this.text.hide()
        this.graphics.visible = false
        this.interaction.hide()
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)
        if (!this.graphics.visible) return

        // Update pos to follow camera
        this.pos.x = engine.currentScene.camera.pos.x - 80
        this.pos.y = engine.currentScene.camera.pos.y - 72

        // Check for player input
        if (MyInputs.IsButtonAPressed(engine)) {
            this.text.actions.clearActions()
            if (this.data.isComplete()) {
                this.next()
            } else {
                this.data.complete()
                this.text.text = this.data.text
                this.text.actions
                    .delay(500)
                    .callMethod(() => this.interaction.show())
            }

            // Play sound
            MySounds.PlayMenuInteraction()
        }
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        this.dieSub.next()
    }

    public next() {
        this.interaction.hide()
        this.text.show()
        this.graphics.visible = true
        MyLightPP.SetShowingDialog(true)

        // Last line shown
        if (this.data.nextLine()) {
            this.completionSub.next()
            this.text.hide()
            this.graphics.visible = false
            this.interaction.hide()
            MyLightPP.SetShowingDialog(false)
            return
        }

        // Show text animation
        const l = this.data.length
        this.text.text = this.data.text
        this.text.actions.clearActions()
        this.text.actions
            .repeat((ctx) => {
                ctx.delay(2000 / l).callMethod(() => {
                    this.data.nextChar()
                    this.text.text = this.data.text
                })
            }, l)
            .delay(500)
            .callMethod(() => this.interaction.show())
    }
}
