import { FontSource, ImageSource } from 'excalibur' // @ts-ignore
import YataghanFont from './font/Yataghan-qZ5d.ttf' // @ts-ignore
import CheckboardImage from './image/checkboard.png' // @ts-ignore
import GameBoyImage from './image/gameboy.png' // @ts-ignore

export const Resources = {
    image: {
        gameboy: new ImageSource(GameBoyImage),
        checkboard: new ImageSource(CheckboardImage),
    },
    music: {},
    font: {
        main: new FontSource(YataghanFont, 'yataghan', {
            size: 12,
        }),
    },
}
