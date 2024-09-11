import {Color, Engine, Font, ImageFiltering, Label, Scene, Vector} from "excalibur";

export class PauseScene extends Scene {

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        const label = new Label({
            pos: Vector.Zero,
            color: Color.White,
            text: "Press ESC to resume game",
            font: new Font({
                family: "Arial",
                size: 20,
                filtering: ImageFiltering.Blended,
                smoothing: true,
                quality: 2,
            }),
        });
        this.add(label);
    }

}
