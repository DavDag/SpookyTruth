import {Color, Engine, Font, ImageFiltering, Label, Scene, Vector} from "excalibur";
import {MyApp} from "../app";

export class MenuScene extends Scene {

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        const label = new Label({
            pos: Vector.Zero,
            color: Color.White,
            text: "Press Enter to start",
            font: new Font({
                family: "Arial",
                size: 20,
                filtering: ImageFiltering.Blended,
                smoothing: true,
                quality: 2,
            }),
        });
        label.on("pointerup", () => {
            MyApp.GoToGameScene();
        });
        this.add(label);
    }

}
