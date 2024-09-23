import { Actor, Engine, SpriteSheet, Vector } from 'excalibur'
import { Resources } from '../../0_assets/resources'
import { MyStorage } from '../../1_utils/storage'
import { DialogActor, DialogData } from '../../3_actors/dialog.actor'
import { EngineConfigs } from '../../configs'
import { BaseLevelScene } from './base.level.scene'

export class PreEndingLevelScene extends BaseLevelScene {
    private missingPiecesDialog: DialogActor

    constructor() {
        super({
            name: 'pre-ending',
            tiledRes: Resources.levels.pre_ending,
        })
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)

        // Count missing pieces
        const missingPieces = 8 - MyStorage.Retrieve('memory.pieces', []).length

        // Add dialog
        this.missingPiecesDialog = new DialogActor(
            new DialogData({
                text: `I cannot see a door...\nIt's like I'm missing "${missingPieces}" pieces...`,
            })
        )
        this.missingPiecesDialog.completion$.subscribe(() =>
            this.player.enable()
        )
        this.add(this.missingPiecesDialog)

        // Show dialog & hide door if missing pieces
        if (missingPieces > 0) {
            this.player.disable()
            this.missingPiecesDialog.actions.callMethod(() =>
                this.missingPiecesDialog.next()
            )
            const door = this.doors.find((d) => d.dest === 'ending')
            door?.kill()

            // Add tile above the door
            const sheet = SpriteSheet.fromImageSource({
                image: Resources.image.tileset,
                grid: {
                    rows: 10,
                    columns: 10,
                    spriteWidth: 16,
                    spriteHeight: 16,
                },
            })
            const emptyTile = sheet.getSprite(0, 9)
            const emptyTileActor = new Actor({
                name: 'empty-tile',
                pos: door?.pos,
                anchor: Vector.Zero,
                width: 16,
                height: 16,
                z: EngineConfigs.DoorZIndex,
            })
            emptyTileActor.graphics.use(emptyTile)
            this.add(emptyTileActor)
        }
    }
}
