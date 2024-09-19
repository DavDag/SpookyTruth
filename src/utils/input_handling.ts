import { Engine } from 'excalibur'
import { EngineConfigs } from '../configs'

class InputHandling {
    public IsButtonAPressed(engine: Engine): boolean {
        return EngineConfigs.ButtonA.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsButtonBPressed(engine: Engine): boolean {
        return EngineConfigs.ButtonB.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsButtonStartPressed(engine: Engine): boolean {
        return EngineConfigs.ButtonStart.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsButtonSelectPressed(engine: Engine): boolean {
        return EngineConfigs.ButtonSelect.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsPadUpPressed(engine: Engine): boolean {
        return EngineConfigs.PadUp.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsPadDownPressed(engine: Engine): boolean {
        return EngineConfigs.PadDown.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsPadLeftPressed(engine: Engine): boolean {
        return EngineConfigs.PadLeft.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsPadRightPressed(engine: Engine): boolean {
        return EngineConfigs.PadRight.some(
            engine.input.keyboard.wasPressed.bind(engine.input.keyboard)
        )
    }

    public IsPadUpHeld(engine: Engine): boolean {
        return EngineConfigs.PadUp.some(
            engine.input.keyboard.isHeld.bind(engine.input.keyboard)
        )
    }

    public IsPadDownHeld(engine: Engine): boolean {
        return EngineConfigs.PadDown.some(
            engine.input.keyboard.isHeld.bind(engine.input.keyboard)
        )
    }

    public IsPadLeftHeld(engine: Engine): boolean {
        return EngineConfigs.PadLeft.some(
            engine.input.keyboard.isHeld.bind(engine.input.keyboard)
        )
    }

    public IsPadRightHeld(engine: Engine): boolean {
        return EngineConfigs.PadRight.some(
            engine.input.keyboard.isHeld.bind(engine.input.keyboard)
        )
    }
}

export const MyInputs = new InputHandling()
