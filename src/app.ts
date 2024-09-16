import { Engine, ImageFiltering, Keys, Loader } from 'excalibur'
import { Resources } from './assets/resources'
import { EngineConfigs } from './configs'
import { GameBoyPostProcessor, Palette } from './postprocessors/gameboy_pp'
import { CreditsScene } from './scenes/credits.scene'
import { GameScene } from './scenes/game.scene'
import { GameOverScene } from './scenes/gameover.scene'
import { MenuScene } from './scenes/menu.scene'
import { OptionsScene } from './scenes/options.scene'
import { PauseScene } from './scenes/pause.scene'

class App {
    private loader: Loader
    private engine: Engine

    private pausedScene?: string
    private gbpp: GameBoyPostProcessor

    public Initialize() {
        this.AddResources()
        this.CreateEngine()
        this.AddScenes()
        this.AddListeners()
        this.AddPostProcessors()
    }

    public Start() {
        void this.engine
            .start(this.loader)
            .then(() => this.engine.goToScene('menu'))
    }

    public Resize(w: number, h: number) {
        this.engine.screen.viewport = { width: w, height: h }
        this.engine.screen.applyResolutionAndViewport()
    }

    public StartGame() {
        void this.engine.goToScene('game')
    }

    public Credits() {
        void this.engine.goToScene('credits')
    }

    public Options() {
        void this.engine.goToScene('options')
    }

    public Pause() {
        if ((this.engine.currentScene as any)?.pauseable === true) {
            this.pausedScene = this.engine.currentSceneName
            void this.engine.goToScene('pause')
        }
    }

    public Resume() {
        void this.engine.goToScene(this.pausedScene)
        this.pausedScene = undefined
    }

    public GameOver() {
        this.engine.goToScene('gameover').then(() => {
            // Remove & Re-Add the game scene to reset it
            this.engine.removeScene('game')
            this.engine.add('game', new GameScene())
        })
    }

    public RestartGame() {
        void this.engine.goToScene('game')
    }

    public BackToMenu() {
        void this.engine.goToScene('menu')
    }

    public SetPalette(p: Palette) {
        this.gbpp.setPalette(p)
    }

    private AddResources() {
        this.loader = new Loader()
        Object.values(Resources.image).forEach(
            this.loader.addResource.bind(this.loader)
        )
        Object.values(Resources.music).forEach(
            this.loader.addResource.bind(this.loader)
        )
    }

    private CreateEngine() {
        this.engine = new Engine({
            canvasElementId: 'game',
            viewport: EngineConfigs.GameViewport,
            resolution: EngineConfigs.GameResolution,
            displayMode: EngineConfigs.DisplayMode,
            backgroundColor: EngineConfigs.BackgroundColor,
            fixedUpdateFps: EngineConfigs.FixedUpdateFps,
            antialiasing: {
                nativeContextAntialiasing: false,
                pixelArtSampler: false,
                filtering: ImageFiltering.Pixel,
                multiSampleAntialiasing: false,
                canvasImageRendering: 'pixelated',
            },
        })
    }

    private AddScenes() {
        this.engine.add('menu', new MenuScene())
        this.engine.add('game', new GameScene())
        this.engine.add('credits', new CreditsScene())
        this.engine.add('options', new OptionsScene())
        this.engine.add('pause', new PauseScene())
        this.engine.add('gameover', new GameOverScene())
    }

    private AddListeners() {
        // Keyboard listeners
        this.engine.input.keyboard.on('down', (evt: any) => {
            // Escape to pause the game
            if (evt.key === Keys.Escape) {
                if (this.pausedScene) {
                    this.Resume()
                } else {
                    this.Pause()
                }
            }

            // P to toggle debug mode
            if (evt.key === Keys.P) {
                this.engine.toggleDebug()
            }
        })
    }

    private AddPostProcessors() {
        this.gbpp = new GameBoyPostProcessor()
        this.engine.graphicsContext.addPostProcessor(this.gbpp)
    }
}

export const MyApp = new App()
