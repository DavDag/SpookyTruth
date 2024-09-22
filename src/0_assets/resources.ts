import { TiledResource } from '@excaliburjs/plugin-tiled' // @ts-ignore
import { Color, FontSource, ImageSource, Sound } from 'excalibur' // @ts-ignore
import YataghanFont from './font/Yataghan-qZ5d.ttf' // @ts-ignore
import AlphabetImage from './image/alphabet.png' // @ts-ignore
import CastleTilesetImage from './image/castle.png' // @ts-ignore
import CharacterImage from './image/character.png' // @ts-ignore
import DialogImage from './image/dialog.png' // @ts-ignore
import DoorImage from './image/door.png' // @ts-ignore
import GhostImage from './image/ghost.png' // @ts-ignore
import InteractionsImage from './image/interactions.png' // @ts-ignore
import IntroductionRoomImage from './image/introduction_room.png' // @ts-ignore
import DungeonTsx from './levels/dungeon.tsx' // @ts-ignore
import IntroductionTmx from './levels/introduction.tmx' // @ts-ignore
// import Level1Tmx from './levels/level1.tmx' // @ts-ignore
import MusicTheme1Sound from './music/music_theme1.mp3' // @ts-ignore
import MenuInteractionSound from './sfx/menu_interaction.wav' // @ts-ignore

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
    },
    music: {
        musicTheme1: new Sound(MusicTheme1Sound),
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
        introduction: new TiledResource(IntroductionTmx, {
            pathMap: [
                {
                    path: 'introduction.tmx',
                    output: IntroductionTmx,
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
        }),
    },
}
