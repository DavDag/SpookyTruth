import { EngineConfigs } from '../configs'

class SoundHandling {
    private volume: number

    constructor() {
        this.volume = parseFloat(
            localStorage.getItem('volume') ??
                EngineConfigs.StartingVolume.toString()
        )
    }

    PlayMenuInteraction() {
        // TODO
    }
}

export const MySounds = new SoundHandling()
