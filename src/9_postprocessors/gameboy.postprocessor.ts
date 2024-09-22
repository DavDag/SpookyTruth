import {
    Color,
    PostProcessor,
    ScreenShader,
    Shader,
    VertexLayout,
} from 'excalibur'
import { MyStorage } from '../1_utils/storage'

// https://lospec.com/palette-list
const PALETTES = {
    kirokaze: [
        Color.fromHex('#332c50'),
        Color.fromHex('#46878f'),
        Color.fromHex('#94e344'),
        Color.fromHex('#e2f3e4'),
    ],
    icecream: [
        Color.fromHex('#7c3f58'),
        Color.fromHex('#eb6b6f'),
        Color.fromHex('#f9a875'),
        Color.fromHex('#fff6d3'),
    ],
    '2bit_demichrome': [
        Color.fromHex('#211e20'),
        Color.fromHex('#555568'),
        Color.fromHex('#a0a08b'),
        Color.fromHex('#e9efec'),
    ],
    lava: [
        Color.fromHex('#051f39'),
        Color.fromHex('#4a2480'),
        Color.fromHex('#c53a9d'),
        Color.fromHex('#ffb6de'),
    ],
    asdasd: [
        Color.fromHex('#2a1c3c'),
        Color.fromHex('#7550e8'),
        Color.fromHex('#608fcf'),
        Color.fromHex('#8be5ff'),
    ],
}

export type PaletteName = keyof typeof PALETTES

export class GameBoyPostProcessor implements PostProcessor {
    private _shader: ScreenShader
    private _isShaderDirty: boolean = true
    private _palette: PaletteName = 'kirokaze'
    private _isDebugModeOn: boolean = false

    constructor() {
        this._palette = MyStorage.Retrieve<PaletteName>('palette', 'kirokaze')
    }

    initialize(gl: WebGL2RenderingContext) {
        this._shader = new ScreenShader(
            gl,
            `#version 300 es
precision mediump float;
uniform sampler2D u_image; // image
uniform vec2 u_resolution; // screen resolution
uniform float u_time_ms; // total playback time
uniform float u_elapsed_ms; // elapsed time (since last frame)
uniform vec3 u_palette[4]; // color palette
uniform bool u_bDebugModeOn; // debug mode
in vec2 v_texcoord; // text coords
out vec4 fragColor; // final color
void main() {
    vec4 tex = texture(u_image, v_texcoord);
    if (u_bDebugModeOn) {
        fragColor = tex;
        return;
    }
    float avg = 0.2126 * tex.r + 0.7152 * tex.g + 0.0722 * tex.b;
    int index = (avg < 0.25) ? 0 : (avg < 0.5) ? 1 : (avg < 0.75) ? 2 : 3;
    fragColor = vec4(u_palette[index], 1.0);
}`
        )
    }

    onUpdate(delta: number) {
        if (this._isShaderDirty) {
            this._isShaderDirty = false

            // Use the shader
            this._shader.getShader().use()

            // Update debug mode
            this._shader
                .getShader()
                .setUniformBoolean('u_bDebugModeOn', this._isDebugModeOn)

            // Update palette
            const p = PALETTES[this._palette]
            this._shader
                .getShader()
                .setUniform('uniform3fv', 'u_palette', [
                    p[0].r / 255.0,
                    p[0].g / 255.0,
                    p[0].b / 255.0,
                    p[1].r / 255.0,
                    p[1].g / 255.0,
                    p[1].b / 255.0,
                    p[2].r / 255.0,
                    p[2].g / 255.0,
                    p[2].b / 255.0,
                    p[3].r / 255.0,
                    p[3].g / 255.0,
                    p[3].b / 255.0,
                ])
        }
    }

    getLayout(): VertexLayout {
        return this._shader.getLayout()
    }

    getShader(): Shader {
        return this._shader.getShader()
    }

    public get palette() {
        return `#${Object.keys(PALETTES).indexOf(this._palette)}`
    }

    public toggleDebugMode() {
        this._isShaderDirty = true
        this._isDebugModeOn = !this._isDebugModeOn
    }

    public setPalette(palette: PaletteName) {
        this._isShaderDirty = true
        this._palette = palette
    }

    public nextPalette() {
        const keys = Object.keys(PALETTES)
        const index = keys.indexOf(this._palette)
        const next = (index + 1) % keys.length
        this.setPalette(keys[next] as PaletteName)
        MyStorage.Store('palette', this._palette)
    }

    public prevPalette() {
        const keys = Object.keys(PALETTES)
        const index = keys.indexOf(this._palette)
        const prev = (index - 1 + keys.length) % keys.length
        this.setPalette(keys[prev] as PaletteName)
        MyStorage.Store('palette', this._palette)
    }
}

export const MyGameBoyPP = new GameBoyPostProcessor()
