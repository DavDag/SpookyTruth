import {Engine, Keys, Loader} from "excalibur";
import {Resources} from "./assets/resources";
import {EngineConfigs} from "./configs";
import {MenuScene} from "./scenes/menu.scene";
import {GameOverScene} from "./scenes/gameover.scene";
import {PauseScene} from "./scenes/pause.scene";
import {GameScene} from "./scenes/game.scene";

class App {

    private loader: Loader;
    private engine: Engine;

    private pausedScene?: string;

    public Initialize() {
        this.AddResources();
        this.CreateEngine();
        this.AddScenes();
        this.AddListeners();
    }

    public Start() {
        this.engine
            .start(this.loader)
            .then(() => this.engine.goToScene("menu"));
    }

    public Resize(w: number, h: number) {
        this.engine.screen.viewport = {width: w, height: h};
        this.engine.screen.applyResolutionAndViewport();
    }

    public Pause() {
        if ((this.engine.currentScene as any)?.pauseable === true) {
            this.pausedScene = this.engine.currentSceneName;
            void this.engine.goToScene("pause");
        }
    }

    public Resume() {
        void this.engine.goToScene(this.pausedScene);
        this.pausedScene = undefined;
    }

    public GoToGameScene() {
        void this.engine.goToScene("game");
    }

    private AddResources() {
        this.loader = new Loader();
        Object.values(Resources.image).forEach(this.loader.addResource.bind(this.loader));
        Object.values(Resources.music).forEach(this.loader.addResource.bind(this.loader));
    }

    private CreateEngine() {
        this.engine = new Engine({
            canvasElementId: 'game',
            resolution: EngineConfigs.GameResolution,
            displayMode: EngineConfigs.DisplayMode,
            backgroundColor: EngineConfigs.BackgroundColor,
            fixedUpdateFps: EngineConfigs.FixedUpdateFps,
            pixelArt: EngineConfigs.PixelArt,
        });
    }

    private AddScenes() {
        this.engine.add("menu", new MenuScene());
        this.engine.add("pause", new PauseScene());
        this.engine.add("gameover", new GameOverScene());
        this.engine.add("game", new GameScene());
    }

    private AddListeners() {
        // Keyboard listeners
        this.engine.input.keyboard.on('down', (evt: any) => {
            // Escape to pause the game
            if (evt.key === Keys.Escape) {
                if (this.pausedScene) {
                    this.Resume();
                } else {
                    this.Pause();
                }
            }

            // P to toggle debug mode
            if (evt.key === Keys.P) {
                this.engine.toggleDebug();
            }
        });
    }
}

export const MyApp = new App();
