import { Color, DisplayMode, Resolution } from 'excalibur'

export class EngineConfigs {
    static GameViewport: Resolution = { width: 160 * 5, height: 144 * 5 }
    static GameResolution: Resolution = { width: 160, height: 144 }
    static DisplayMode: DisplayMode = DisplayMode.Fixed
    static BackgroundColor: Color = Color.White
    static FixedUpdateFps: number = 60
}
