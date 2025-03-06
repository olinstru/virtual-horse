uniform float intensity;
uniform float range;
uniform float steps;
uniform float threshold;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

	outputColor = inputColor;

    for (float i = -range; i < range; i += steps) {
    
        float falloff = 1.0 - abs(i / range);
    
        vec4 blur = texture(inputBuffer, uv + i);
        if (blur.r + blur.g + blur.b > threshold * 3.0) {
            outputColor += blur * falloff * steps * intensity;
        }
        
        blur = texture(inputBuffer, uv + vec2(i, -i));
        if (blur.r + blur.g + blur.b > threshold * 3.0) {
            outputColor += blur * falloff * steps * intensity;
        }
    }
}