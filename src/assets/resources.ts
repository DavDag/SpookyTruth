import { Color, FontSource, ImageSource } from 'excalibur' // @ts-ignore
// import PenakutFont from './font/PenakutNormal-rm37.ttf' // @ts-ignore
// import SpiritsFont from './font/SpiritsRegular-OEKo.ttf' // @ts-ignore
import YataghanFont from './font/Yataghan-qZ5d.ttf' // @ts-ignore
import CheckboardImage from './image/checkboard.png' // @ts-ignore
import GameBoyImage from './image/gameboy.png' // @ts-ignore
import PlayerImage from './image/player.png' // @ts-ignore
import IntroductionRoomImage from './image/introduction_room.png' // @ts-ignore

export const Resources = {
    image: {
        gameboy: new ImageSource(GameBoyImage),
        checkboard: new ImageSource(CheckboardImage),
        player: new ImageSource(PlayerImage),
        introductionRoom: new ImageSource(IntroductionRoomImage),
    },
    music: {},
    font: {
        main: new FontSource(YataghanFont, 'yataghan', {
            size: 16,
            color: Color.White,
        }),
        // main1: new FontSource(PenakutFont, 'penakut', {
        //     size: 16,
        // }),
        // main2: new FontSource(SpiritsFont, 'spirits', {
        //     size: 16,
        // }),
    },
}
