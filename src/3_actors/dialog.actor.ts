import { Actor, Color, Scene, Vector } from 'excalibur'
import { Subject, takeUntil } from 'rxjs'

export interface DialogData {
    text: string
}

export class DialogActor extends Actor {
    private dieSub = new Subject<void>()
    private completionSub = new Subject<void>()

    public completion$ = this.completionSub.pipe(takeUntil(this.dieSub))

    constructor(data: DialogData) {
        super({
            name: 'dialog',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            width: 160,
            height: 60,
            color: Color.Violet,
        })
    }

    onPreKill(scene: Scene) {
        super.onPreKill(scene)
        this.dieSub.next()
    }

    public next() {}
}
