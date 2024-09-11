import { Color, DisplayMode, Resolution } from 'excalibur'

export class EngineConfigs {
    static GameResolution: Resolution = { width: 800, height: 600 }
    static DisplayMode: DisplayMode = DisplayMode.FitContainer
    static BackgroundColor: Color = Color.ExcaliburBlue
    static PixelArt: boolean = true
    static FixedUpdateFps: number = 60
}
