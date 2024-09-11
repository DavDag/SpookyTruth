import { Color, Engine, Font, Label, Scene, TextAlign, Vector } from 'excalibur'

export class PauseScene extends Scene {
    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        const resume = new Label({
            pos: new Vector(engine.halfDrawWidth, engine.halfDrawHeight),
            color: Color.White,
            text: 'Press ESC to resume game',
            font: new Font({
                family: 'Arial',
                size: 20,
                textAlign: TextAlign.Center,
            }),
        })
        this.add(resume)
    }
}
