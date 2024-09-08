import {DisplayMode, Engine, Keys, Loader} from "excalibur";
import {Resources} from "./assets/resources";
import {GameScene} from "./scenes/gamescene";
import {Configs} from "./configs";

// Resource loader
const loader = new Loader();
Object.values(Resources.image).forEach(loader.addResource.bind(loader));
Object.values(Resources.music).forEach(loader.addResource.bind(loader));

// Game engine
const game = new Engine({
    canvasElementId: 'game',
    width: Configs.WindowWidth,
    height: Configs.WindowHeight,
    fixedUpdateFps: 60,
    backgroundColor: Configs.BackgroundColor,
    displayMode: DisplayMode.Fixed,
    pixelArt: true,
});

// Scenes
game.add("game", new GameScene());

// Listen to global events
game.input.keyboard.on('down', (evt: any) => {
    // Escape to pause the game
    if (evt.key === Keys.Escape) {
        window["PauseGame"]();
    }

    // P to toggle debug mode
    if (evt.key === Keys.P) {
        game.toggleDebug();
    }
});

game.input.pointers.primary.on('wheel', (evt: any) => {
    // Zoom in/out
    if (evt.deltaY > 0) {
        game.currentScene.camera.zoom *= 0.9;
    } else {
        game.currentScene.camera.zoom *= 1.1;
    }
});

// Start the game
game.start(loader).then(() => window["StartGame"]());

window["StartGame"] = () => {
    void game.goToScene("game");
};

window["PauseGame"] = () => {
    game.stop();
};

window["ResumeGame"] = () => {
    void game.start();
};
