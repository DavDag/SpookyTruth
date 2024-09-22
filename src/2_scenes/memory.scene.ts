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
import { MyStorage } from '../1_utils/storage'
import { MyLightPP } from '../9_postprocessors/light.postprocessor'

export type MemoryType = 'accident' | 'finale'

export interface MemorySceneActivationCtx {
    backScene: string
    memory: MemoryType
    unlockPiece?: number
}

export class MemoryScene extends Scene {
    private backScene: string
    private memory: MemoryType = 'accident'
    private memoryPieces = new Map<MemoryType, Set<number>>()
    private isAnimating: boolean = false

    private texts = new Map<MemoryType, MyLabel[]>()
    private layers = new Map<MemoryType, Actor[]>()
    private animatingPiece?: Actor

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Layer (accident)
        const accident1 = new Actor({
            name: 'memory.accident1',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 80,
            height: 72,
            color: Color.Red,
        })
        accident1.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 0,
                    y: 0,
                    width: 80,
                    height: 72,
                },
            })
        )
        const accident2 = accident1.clone()
        accident2.name = 'memory.accident2'
        accident2.pos = new Vector(80, 0)
        accident2.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 80,
                    y: 0,
                    width: 80,
                    height: 72,
                },
            })
        )
        const accident3 = accident1.clone()
        accident3.name = 'memory.accident3'
        accident3.pos = new Vector(0, 72)
        accident3.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 0,
                    y: 72,
                    width: 80,
                    height: 72,
                },
            })
        )
        const accident4 = accident1.clone()
        accident4.name = 'memory.accident4'
        accident4.pos = new Vector(80, 72)
        accident4.graphics.use(
            new Sprite({
                image: Resources.image.accident,
                sourceView: {
                    x: 80,
                    y: 72,
                    width: 80,
                    height: 72,
                },
            })
        )
        this.layers.set('accident', [
            accident1,
            accident2,
            accident3,
            accident4,
        ])

        // Layer (finale)
        const finale1 = new Actor({
            name: 'memory.finale',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 80,
            height: 72,
            color: Color.Blue,
        })
        finale1.graphics.use(
            new Sprite({
                image: Resources.image.finale,
                sourceView: {
                    x: 0,
                    y: 0,
                    width: 80,
                    height: 72,
                },
            })
        )
        const finale2 = finale1.clone()
        finale2.name = 'memory.finale2'
        finale2.pos = new Vector(80, 0)
        finale2.graphics.use(
            new Sprite({
                image: Resources.image.finale,
                sourceView: {
                    x: 80,
                    y: 0,
                    width: 80,
                    height: 72,
                },
            })
        )
        const finale3 = finale1.clone()
        finale3.name = 'memory.finale3'
        finale3.pos = new Vector(0, 72)
        finale3.graphics.use(
            new Sprite({
                image: Resources.image.finale,
                sourceView: {
                    x: 0,
                    y: 72,
                    width: 80,
                    height: 72,
                },
            })
        )
        const finale4 = finale1.clone()
        finale4.name = 'memory.finale4'
        finale4.pos = new Vector(80, 72)
        finale4.graphics.use(
            new Sprite({
                image: Resources.image.finale,
                sourceView: {
                    x: 80,
                    y: 72,
                    width: 80,
                    height: 72,
                },
            })
        )
        this.layers.set('finale', [finale1, finale2, finale3, finale4])
        this.layers.forEach((l) => l.forEach(this.add.bind(this)))

        // Texts
        const accidentText1 = new MyLabel({ pos: new Vector(40, 36) }, '1.A')
        const accidentText2 = new MyLabel({ pos: new Vector(120, 36) }, '1.B')
        const accidentText3 = new MyLabel({ pos: new Vector(40, 108) }, '1.C')
        const accidentText4 = new MyLabel({ pos: new Vector(120, 108) }, '1.D')
        this.texts.set('accident', [
            accidentText1,
            accidentText2,
            accidentText3,
            accidentText4,
        ])
        const finaleText1 = new MyLabel({ pos: new Vector(40, 36) }, '2.A')
        const finaleText2 = new MyLabel({ pos: new Vector(120, 36) }, '2.B')
        const finaleText3 = new MyLabel({ pos: new Vector(40, 108) }, '2.C')
        const finaleText4 = new MyLabel({ pos: new Vector(120, 108) }, '2.D')
        this.texts.set('finale', [
            finaleText1,
            finaleText2,
            finaleText3,
            finaleText4,
        ])
        this.texts.forEach((t) => t.forEach(this.add.bind(this)))

        // Set everything to invisible
        this.layers.forEach((l) =>
            l.forEach((a) => (a.graphics.visible = false))
        )
    }

    onActivate(context: SceneActivationContext<MemorySceneActivationCtx>) {
        super.onActivate(context)
        MyLightPP.Disable()

        // Update back scene
        this.backScene = context.data?.backScene ?? this.backScene

        // Update memory
        this.memory = context.data?.memory ?? this.memory
        this.memoryPieces.set(
            'accident',
            new Set(MyStorage.Retrieve(`accident.pieces`) ?? [])
        )
        this.memoryPieces.set(
            'finale',
            new Set(MyStorage.Retrieve(`finale.pieces`) ?? [])
        )
        this.displayMemory()

        // If unlock piece
        if (
            context.data?.unlockPiece !== undefined &&
            this.memoryPieces
                .get(this.memory)
                ?.has(context.data.unlockPiece) === false
        ) {
            // Update memory level
            this.memoryPieces.get(this.memory)?.add(context.data.unlockPiece)
            MyStorage.Store(
                `${this.memory}.pieces`,
                Array.from(this.memoryPieces.get(this.memory))
            )

            // Animate unlock
            this.animateUnlock(this.memory, context.data.unlockPiece)
        }
    }

    onPreUpdate(engine: Engine, delta: number) {
        super.onPreUpdate(engine, delta)

        // Handle button B
        if (MyInputs.IsButtonBPressed(engine)) {
            if (this.isAnimating) {
                // Complete animation early
                this.exitAnimationEarly()
            } else {
                // Go back to the previous scene
                void engine.goToScene(this.backScene)
            }
        }

        // Handle button A
        if (MyInputs.IsButtonAPressed(engine)) {
            if (this.isAnimating) {
                // Complete animation early
                this.exitAnimationEarly()
            } else {
                // Switch memory
                this.memory = this.memory === 'accident' ? 'finale' : 'accident'
                this.displayMemory()
            }
        }
    }

    private displayMemory() {
        // console.log(
        //     'Displaying memory:',
        //     this.memory,
        //     this.memoryPieces.get(this.memory)
        // )
        switch (this.memory) {
            case 'accident':
                // Set accident layer to front
                this.layers.forEach((l) =>
                    l.forEach((a) => {
                        a.z = 0
                        a.graphics.visible = false
                    })
                )
                this.texts.forEach((t) => t.forEach((a) => a.hide()))
                this.layers.get('accident').forEach((a, i) => (a.z = 1))
                this.texts.get('accident').forEach((a, i) => a.show())

                // Display unlocked pieces
                this.layers.get('accident').forEach((a, i) => {
                    a.graphics.visible = this.memoryPieces
                        .get('accident')
                        .has(i)
                })
                break
            case 'finale':
                // Set finale layer to front
                this.layers.forEach((l) =>
                    l.forEach((a) => {
                        a.z = 0
                        a.graphics.visible = false
                    })
                )
                this.texts.forEach((t) => t.forEach((a) => a.hide()))
                this.layers.get('finale').forEach((a, i) => (a.z = 1))
                this.texts.get('finale').forEach((a, i) => a.show())

                // Display unlocked pieces
                this.layers.get('finale').forEach((a, i) => {
                    a.graphics.visible = this.memoryPieces.get('finale').has(i)
                })
                break
        }
    }

    private animateUnlock(type: MemoryType, level: number) {
        this.isAnimating = true
        this.animatingPiece = this.layers.get(type)?.[level] ?? undefined
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
