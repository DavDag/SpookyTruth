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

    static DoorZIndex: number = 21
    static PlayerZIndex: number = 22
    static DialogZIndex: number = 23
    static InteractionsZIndex: number = 24

    static ButtonA: Keys[] = [Keys.J, Keys.Z]
    static ButtonB: Keys[] = [Keys.X, Keys.K]
    static ButtonStart: Keys[] = [Keys.Enter]
    static ButtonSelect: Keys[] = [Keys.Backspace]
    static PadUp: Keys[] = [Keys.ArrowUp, Keys.W]
    static PadDown: Keys[] = [Keys.ArrowDown, Keys.S]
    static PadLeft: Keys[] = [Keys.ArrowLeft, Keys.A]
    static PadRight: Keys[] = [Keys.ArrowRight, Keys.D]
}
