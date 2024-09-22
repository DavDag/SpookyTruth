import { Color, DisplayMode, Keys, Resolution } from 'excalibur'

export class EngineConfigs {
    static GameViewport: Resolution = { width: 160 * 4, height: 144 * 4 }
    static GameResolution: Resolution = { width: 160, height: 144 }
    static DisplayMode: DisplayMode = DisplayMode.Fixed
    static BackgroundColor: Color = Color.Black
    static FixedUpdateFps: number = 60

    static TiledBackgroundLayerZIndex: number = 0
    static TiledWallLayerZIndex: number = 10
    static TiledDecorationsLayerZIndex: number = 20
    static TiledDecorations2LayerZIndex: number = 30

    static DoorZIndex: number = 21
    static PostItZIndex: number = 21
    static MirrorZIndex: number = 21
    static GhostZIndex: number = 22
    static PlayerZIndex: number = 23
    static DialogZIndex: number = 31
    static InteractionsZIndex: number = 32

    static ButtonA: Keys[] = [Keys.J, Keys.Z]
    static ButtonB: Keys[] = [Keys.X, Keys.K]
    static ButtonStart: Keys[] = [Keys.Enter]
    static ButtonSelect: Keys[] = [Keys.Backspace]
    static PadUp: Keys[] = [Keys.ArrowUp, Keys.W]
    static PadDown: Keys[] = [Keys.ArrowDown, Keys.S]
    static PadLeft: Keys[] = [Keys.ArrowLeft, Keys.A]
    static PadRight: Keys[] = [Keys.ArrowRight, Keys.D]
}
