import { Actor, Engine, SpriteFont, SpriteSheet, Text } from 'excalibur'
import { ActorArgs } from 'excalibur/build/dist/Actor'
import { Resources } from '../0_assets/resources'

export class MyLabel extends Actor {
    private _text: string
    private _textObj: Text

    constructor(args: ActorArgs, text: string = '') {
        super(args)
        this._text = text
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Create text object
        this._textObj = new Text({
            text: this._text,
            font: MyFonts.main,
        })
        this.graphics.add(this._textObj)
    }

    public set text(value: string) {
        this._text = value
        this._textObj.text = value
    }

    public get text() {
        return this._text
    }

    public show() {
        this.graphics.visible = true
    }

    public hide() {
        this.graphics.visible = false
    }
}

class FontHandling {
    private _main?: SpriteFont
    get main() {
        if (!this._main) {
            this._main = new SpriteFont({
                alphabet: '0123456789abcdefghijklmnopqrstuvwxyz,!\'&."?-()+ ',
                caseInsensitive: true,
                spriteSheet: SpriteSheet.fromImageSource({
                    image: Resources.image.alphabet,
                    grid: {
                        rows: 3,
                        columns: 16,
                        spriteWidth: 9,
                        spriteHeight: 13,
                    },
                    spacing: {
                        originOffset: {
                            x: 3,
                            y: 3,
                        },
                        margin: {
                            x: 7,
                            y: 3,
                        },
                    },
                }),
            })
        }
        return this._main
    }
}

export const MyFonts = new FontHandling()
