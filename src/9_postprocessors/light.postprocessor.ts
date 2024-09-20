import {
    PostProcessor,
    ScreenShader,
    Shader,
    Vector,
    VertexLayout,
} from 'excalibur'

export class LightPoint {
    private _isDirty: boolean
    private _pos: Vector
    private _intensity: number // pixel distance

    constructor(pos: Vector, intensity: number) {
        this._isDirty = true
        this._pos = pos
        this._intensity = intensity
    }

    public get pos() {
        return this._pos
    }

    public set pos(value: Vector) {
        this._isDirty = true
        this._pos = value
    }

    public get intensity() {
        return this._intensity
    }

    public set intensity(value: number) {
        this._isDirty = true
        this._intensity = value
    }

    public isDirty() {
        return this._isDirty
    }
}

// TODO: Think about adding lightning

export class LightPostProcessor implements PostProcessor {
    private _shader: ScreenShader
    private _isShaderDirty: boolean = false
    private _isDisabled: boolean = false
    private _isShowingDialog: boolean = false
    private _isDebugModeOn: boolean = false

    private _lights: LightPoint[] = []

    initialize(gl: WebGL2RenderingContext) {
        this._shader = new ScreenShader(
            gl,
            `#version 300 es
precision mediump float;
uniform sampler2D u_image; // image
uniform vec2 u_resolution; // screen resolution
uniform float u_time_ms; // total playback time
uniform float u_elapsed_ms; // elapsed time (since last frame)
uniform int u_lightCount; // light count
uniform vec2 u_lightPos[4]; // light position
uniform float u_lightIntensity[4]; // light intensity
uniform bool u_bDialogModeOn; // dialog mode
uniform bool u_bDisabledModeOn; // disabled mode
uniform bool u_bDebugModeOn; // debug mode
in vec2 v_texcoord; // text coords
out vec4 fragColor; // final color
void main() {
    vec4 tex = texture(u_image, v_texcoord);
    if (u_bDisabledModeOn || u_bDebugModeOn) {
        fragColor = tex;
        return;
    }
    vec2 px_pos = vec2(v_texcoord.x * u_resolution.x, (1.0 - v_texcoord.y) * u_resolution.y);
    if (u_bDialogModeOn && px_pos.y <= 48.0) {
        fragColor = tex;
        return;
    }
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    for (int i = 0; i < u_lightCount; i++) {
        vec2 lightPos = u_lightPos[i];
        float lightIntensity = u_lightIntensity[i];
        vec2 diff = lightPos - px_pos;
        float dist = length(diff);
        if (dist < lightIntensity) {
            float dOverI = (dist / lightIntensity);
            float intensity = (dOverI > 0.8) ? 0.5 : 1.0;
            fragColor.rgb += tex.rgb * intensity;
        }
    }
}`
        )
    }

    onUpdate(delta: number) {
        if (this._isShaderDirty || this._lights.some((lp) => lp.isDirty())) {
            this._isShaderDirty = false

            // Use the shader
            this._shader.getShader().use()

            // Update debug mode
            this._shader
                .getShader()
                .setUniformBoolean('u_bDebugModeOn', this._isDebugModeOn)

            // Update disabled mode
            this._shader
                .getShader()
                .setUniformBoolean('u_bDisabledModeOn', this._isDisabled)

            // Update dialog mode
            this._shader
                .getShader()
                .setUniformBoolean('u_bDialogModeOn', this._isShowingDialog)

            // Update lights
            this._shader
                .getShader()
                .setUniformInt('u_lightCount', this._lights.length)
            for (let i = 0; i < this._lights.length; i++) {
                const lp = this._lights[i]
                if (lp.isDirty()) {
                    this._shader
                        .getShader()
                        .setUniformFloatVector(`u_lightPos[${i}]`, lp.pos)
                    this._shader
                        .getShader()
                        .setUniformFloat(`u_lightIntensity[${i}]`, lp.intensity)
                }
            }
        }
    }

    getLayout(): VertexLayout {
        return this._shader.getLayout()
    }

    getShader(): Shader {
        return this._shader.getShader()
    }

    public ToggleDebugMode() {
        this._isShaderDirty = true
        this._isDebugModeOn = !this._isDebugModeOn
    }

    public NewLightPoint(pos: Vector, intensity: number) {
        const lp = new LightPoint(pos, intensity)
        this._lights.push(lp)
        this._isShaderDirty = true
        return lp
    }

    public RemoveLightPoint(lp: LightPoint) {
        const idx = this._lights.indexOf(lp)
        if (idx >= 0) {
            this._lights.splice(idx, 1)
            this._isShaderDirty = true
        } else {
            console.warn('LightPoint not found')
        }
    }

    public SetShowingDialog(showing: boolean) {
        this._isShaderDirty = true
        this._isShowingDialog = showing
    }

    public Enable() {
        this._isShaderDirty = true
        this._isDisabled = false
    }

    public Disable() {
        this._isShaderDirty = true
        this._isDisabled = true
    }
}

export const MyLightPP = new LightPostProcessor()
