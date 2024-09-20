import { Engine, Keys, Loader } from 'excalibur'
import { Resources } from './0_assets/resources'
import { CreditsScene } from './2_scenes/credits.scene'
import { GameScene } from './2_scenes/game.scene'
import { MenuScene } from './2_scenes/menu.scene'
import {
    OptionsScene,
    OptionsSceneActivationCtx,
} from './2_scenes/options.scene'
import { PauseScene, PauseSceneActivationCtx } from './2_scenes/pause.scene'
import { GameBoyPostProcessor } from './9_postprocessors/gameboy_pp'
import { EngineConfigs } from './configs'

class App {
    private loader: Loader
    private engine: Engine
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
            .then(() => this.engine.goToScene('game'))
    }

    public OpenPause() {
        void this.engine.goToScene<PauseSceneActivationCtx>('pause', {
            sceneActivationData: {
                backScene: this.engine.currentSceneName,
            },
        })
    }

    public OpenOptions() {
        void this.engine.goToScene<OptionsSceneActivationCtx>('options', {
            sceneActivationData: {
                backScene: this.engine.currentSceneName,
            },
        })
    }

    public get Palette() {
        return this.gbpp.getPalette()
    }

    public NextPalette() {
        this.gbpp.nextPalette()
    }

    public PrevPalette() {
        this.gbpp.prevPalette()
    }

    private AddResources() {
        this.loader = new Loader()
        Object.values(Resources.image).forEach(
            this.loader.addResource.bind(this.loader)
        )
        Object.values(Resources.music).forEach(
            this.loader.addResource.bind(this.loader)
        )
        Object.values(Resources.sfx).forEach(
            this.loader.addResource.bind(this.loader)
        )
        Object.values(Resources.font).forEach(
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
            antialiasing: false,
            pixelRatio: 1,
            suppressHiDPIScaling: true,
        })

        this.engine.on('start', () => {
            this.engine.screen.pixelRatioOverride = 1
            this.engine.screen.applyResolutionAndViewport()
        })
    }

    private AddScenes() {
        this.engine.add('menu', new MenuScene())
        this.engine.add('game', new GameScene())
        this.engine.add('credits', new CreditsScene())
        this.engine.add('options', new OptionsScene())
        this.engine.add('pause', new PauseScene())
    }

    private AddListeners() {
        // Keyboard listeners
        this.engine.input.keyboard.on('down', (evt: any) => {
            // P to toggle debug mode
            if (evt.key === Keys.P) {
                this.engine.toggleDebug()
                this.gbpp.toggleDebugPalette()
            }
        })
    }

    private AddPostProcessors() {
        this.gbpp = new GameBoyPostProcessor()
        this.engine.graphicsContext.addPostProcessor(this.gbpp)
    }
}

export const MyApp = new App()
