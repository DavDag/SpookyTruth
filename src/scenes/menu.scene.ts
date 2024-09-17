import { Actor, Color, Engine, Scene, Sprite, Vector } from 'excalibur'
import { Resources } from '../assets/resources'

export class MenuScene extends Scene {
    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const bg = new Actor({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.Violet,
        })
        bg.graphics.use(Sprite.from(Resources.image.checkboard))
        this.add(bg)

        // const lbl = new Label({
        //     text: 'play game',
        //     x: engine.halfDrawWidth,
        //     y: engine.halfDrawHeight,
        //     font: Resources.font.main.toFont({
        //         textAlign: TextAlign.Center,
        //     }),
        // })
        //
        // this.add(lbl)
    }
}
