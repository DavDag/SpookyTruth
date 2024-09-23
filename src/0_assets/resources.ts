import { TiledResource } from '@excaliburjs/plugin-tiled' // @ts-ignore
import { TiledResourceOptions } from '@excaliburjs/plugin-tiled/dist/src/resource/tiled-resource' // @ts-ignore
import { Color, FontSource, ImageSource, Sound } from 'excalibur' // @ts-ignore
import YataghanFont from './font/Yataghan-qZ5d.ttf' // @ts-ignore
import AccidentImage from './image/accident.png' // @ts-ignore
import AlphabetImage from './image/alphabet.png' // @ts-ignore
import CastleTilesetImage from './image/castle.png' // @ts-ignore
import CharacterImage from './image/character.png' // @ts-ignore
import DialogImage from './image/dialog.png' // @ts-ignore
import DoorImage from './image/door.png' // @ts-ignore
import FinaleImage from './image/finale.png' // @ts-ignore
import GhostImage from './image/ghost.png' // @ts-ignore
import InteractionsImage from './image/interactions.png' // @ts-ignore
import IntroductionRoomImage from './image/introduction_room.png' // @ts-ignore
import DungeonTsx from './levels/dungeon.tsx' // @ts-ignore
import EndingTmx from './levels/ending.tmx' // @ts-ignore
import IntroductionTmx from './levels/introduction.tmx' // @ts-ignore
import Level1Tmx from './levels/level1.tmx' // @ts-ignore
import PreEndingTmx from './levels/pre-ending.tmx' // @ts-ignore
import MusicTheme1Sound from './music/music_theme1.mp3' // @ts-ignore
import MusicTheme3Sound from './music/music_theme3.mp3' // @ts-ignore
import MenuInteractionSound from './sfx/menu_interaction.wav'

const TiledArgs: (name: string, path: string) => TiledResourceOptions = (
    name: string,
    path: string
) => {
    return {
        useTilemapCameraStrategy: true,
        pathMap: [
            {
                path: name,
                output: path,
            },
            {
                path: 'castle.png',
                output: CastleTilesetImage,
            },
            {
                path: 'dungeon.tsx',
                output: DungeonTsx,
            },
        ],
    }
}

export const Resources = {
    image: {
        alphabet: new ImageSource(AlphabetImage),
        introductionRoom: new ImageSource(IntroductionRoomImage),
        player: new ImageSource(CharacterImage),
        ghost: new ImageSource(GhostImage),
        door: new ImageSource(DoorImage),
        dialog: new ImageSource(DialogImage),
        interactions: new ImageSource(InteractionsImage),
        tileset: new ImageSource(CastleTilesetImage),
        accident: new ImageSource(AccidentImage),
        finale: new ImageSource(FinaleImage),
    },
    music: {
        musicTheme1: new Sound(MusicTheme1Sound),
        musicTheme3: new Sound(MusicTheme3Sound),
    },
    sfx: {
        menuInteraction: new Sound(MenuInteractionSound),
    },
    font: {
        main: new FontSource(YataghanFont, 'yataghan', {
            size: 16,
            color: Color.White,
        }),
    },
    levels: {
        introduction: new TiledResource(
            IntroductionTmx,
            TiledArgs('introduction.tmx', IntroductionTmx)
        ),
        level1: new TiledResource(
            Level1Tmx,
            TiledArgs('level1.tmx', Level1Tmx)
        ),
        pre_ending: new TiledResource(
            PreEndingTmx,
            TiledArgs('pre-ending.tmx', PreEndingTmx)
        ),
        ending: new TiledResource(
            EndingTmx,
            TiledArgs('ending.tmx', EndingTmx)
        ),
    },
}
