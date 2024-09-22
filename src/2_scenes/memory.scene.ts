import {
    Actor,
    Color,
    Engine,
    Scene,
    SceneActivationContext,
    Sprite,
    Vector,
} from 'excalibur'
import { Resources } from '../0_assets/resources'
import { MyLabel } from '../1_utils/font_handling'
import { MyInputs } from '../1_utils/input_handling'
import { MySounds } from '../1_utils/sound_handling'
import { MyStorage } from '../1_utils/storage'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'

export function UnlockMemoryPiece(
    engine: Engine,
    currentScene: string,
    level: number
) {
    return engine.goToScene('memory', {
        sceneActivationData: {
            backScene: currentScene,
            unlockPiece: level,
        },
    })
}

export interface MemorySceneActivationCtx {
    backScene: string
    unlockPiece?: number
}

export class MemoryScene extends Scene {
    private backScene: string
    private memoryPieces = new Set<number>()
    private isAnimating: boolean = false
    private texts: MyLabel[] = []
    private pieces: Actor[] = []
    private animatingPiece?: Actor

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Texts
        const text1 = new MyLabel({ pos: new Vector(40, 36) }, '1.A')
        const text2 = new MyLabel({ pos: new Vector(120, 36) }, '1.B')
        const text3 = new MyLabel({ pos: new Vector(40, 108) }, '1.C')
        const text4 = new MyLabel({ pos: new Vector(120, 108) }, '1.D')
        this.texts = [text1, text2, text3, text4]
        this.texts.forEach(this.add.bind(this))

        // Pieces
        const piece1 = new Actor({
            name: 'memory.accident1',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 60,
            height: 48,
            color: Color.Red,
            z: 1,
        })
        piece1.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 0,
                    y: 0,
                    width: 60,
                    height: 48,
                },
            })
        )
        const piece2 = piece1.clone()
        piece2.name = 'memory.accident2'
        piece2.pos = new Vector(60, 0)
        piece2.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 60,
                    y: 0,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece3 = piece1.clone()
        piece3.name = 'memory.accident3'
        piece3.pos = new Vector(110, 0)
        piece3.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 110,
                    y: 0,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece4 = piece1.clone()
        piece4.name = 'memory.accident4'
        piece4.pos = new Vector(0, 48)
        piece4.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 0,
                    y: 48,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece5 = piece1.clone()
        piece5.name = 'memory.accident5'
        piece5.pos = new Vector(50, 48)
        piece5.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 50,
                    y: 48,
                    width: 60,
                    height: 48,
                },
            })
        )
        const piece6 = piece1.clone()
        piece6.name = 'memory.accident6'
        piece6.pos = new Vector(110, 48)
        piece6.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 110,
                    y: 48,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece7 = piece1.clone()
        piece7.name = 'memory.accident7'
        piece7.pos = new Vector(0, 96)
        piece7.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 0,
                    y: 96,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece8 = piece1.clone()
        piece8.name = 'memory.accident8'
        piece8.pos = new Vector(50, 96)
        piece8.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 50,
                    y: 96,
                    width: 50,
                    height: 48,
                },
            })
        )
        const piece9 = piece1.clone()
        piece9.name = 'memory.accident9'
        piece9.pos = new Vector(100, 96)
        piece9.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 100,
                    y: 96,
                    width: 60,
                    height: 48,
                },
            })
        )
        this.pieces = [
            piece3,
            piece1,
            piece4,
            piece2,
            piece6,
            piece5,
            piece9,
            piece8,
            piece7,
        ]
        this.pieces.forEach(this.add.bind(this))

        // Set everything to invisible
        this.pieces.forEach((a) => (a.graphics.visible = false))
    }

    onActivate(context: SceneActivationContext<MemorySceneActivationCtx>) {
        super.onActivate(context)
        MyLightPP.Disable()

        // Update back scene
        this.backScene = context.data?.backScene ?? this.backScene

        // Update memory
        this.memoryPieces = new Set(MyStorage.Retrieve(`memory.pieces`) ?? [])
        this.displayMemory()

        // If unlock piece
        if (context.data?.unlockPiece !== undefined) {
            // Update memory level
            this.memoryPieces.add(context.data.unlockPiece)
            MyStorage.Store(`memory.pieces`, Array.from(this.memoryPieces))

            // Animate unlock
            this.animateUnlock(context.data.unlockPiece)
        }
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Handle button B
        if (MyInputs.IsButtonBPressed(engine)) {
            if (this.isAnimating) {
                // Complete animation early
                this.exitAnimationEarly()

                // Play sound
                MySounds.PlayMenuInteraction()
            } else {
                // Go back to the previous scene
                void engine.goToScene(this.backScene)

                // Play sound
                MySounds.PlayMenuInteraction()
            }
        }

        // Handle button A
        if (MyInputs.IsButtonAPressed(engine)) {
            if (this.isAnimating) {
                // Complete animation early
                this.exitAnimationEarly()

                // Play sound
                MySounds.PlayMenuInteraction()
            }
        }
    }

    private displayMemory() {
        // console.log('Displaying memory:', this.memoryPieces)

        // Display unlocked pieces
        this.pieces.forEach((a, i) => {
            a.graphics.visible = this.memoryPieces.has(i)
            // a.graphics.visible = true
        })
    }

    private animateUnlock(level: number) {
        this.isAnimating = true
        this.animatingPiece = this.pieces[level] ?? undefined
        if (this.animatingPiece) {
            this.animatingPiece.graphics.visible = true
            this.animatingPiece.graphics.opacity = 0
            this.animatingPiece.actions.fade(1, 2000).callMethod(() => {
                this.isAnimating = false
                this.animatingPiece = undefined
            })
        }
    }

    private exitAnimationEarly() {
        if (this.animatingPiece) {
            this.animatingPiece.actions.clearActions()
            this.animatingPiece.graphics.opacity = 1
            this.isAnimating = false
            this.animatingPiece = undefined
        }
    }
}
