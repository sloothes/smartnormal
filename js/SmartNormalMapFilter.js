/**
 * @author Jan Frischmuth http://www.smart-page.net/blog
 */

/**
 * A Smart Normal Map Filter.
 * 
 * @class SmartNormalMapFilter
 * @extends AbstractFilter
 * @constructor
 */
PIXI.SmartNormalMapFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        bias: {type: '1f', value: 50.0},
        invertR: {type: '1f', value: 0.1},
        invertG: {type: '1f', value: 0.1},
        dimensions: {type: '4fv', value: [0, 0, 0, 0]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',
        'uniform vec2 u_textureSize;',
        'uniform float bias;',
        'uniform float invertR;',
        'uniform float invertG;',
		
		'void main(void) {',
		'   vec2 step = vec2(1.0, 1.0) / dimensions.xy;',
		'	float d0 = abs(texture2D(uSampler, vTextureCoord.xy + vec2(0.0, 0.0)).r);', 
		'	float d1 = abs(texture2D(uSampler, vTextureCoord.xy + vec2(step.x, 0.0)).r);',
		'	float d2 = abs(texture2D(uSampler, vTextureCoord.xy + vec2(-step.x, 0.0)).r);',	
		'	float d3 = abs(texture2D(uSampler, vTextureCoord.xy + vec2(0.0, step.y)).r);',
		'	float d4 = abs(texture2D(uSampler, vTextureCoord.xy + vec2(0.0, -step.y)).r);',
		'	float dx = ((d2 - d0) + (d0 - d1)) * 0.5;',
		'	float dy = ((d4 - d0) + (d0 - d3)) * 0.5;',
		
		'	vec4 normal = vec4(normalize(vec3(dx * invertR, dy * invertG, 1.0 - ((bias - 0.1) / 100.0))), 1.0);',
	
		'	gl_FragColor = vec4(normal.xyz * 0.5 + 0.5, 1.0);',
		'}'

    ];
};

PIXI.SmartNormalMapFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SmartNormalMapFilter.prototype.constructor = PIXI.SmartNormalMapFilter;

/**
 * The filter's bias.
 *
 * @property bias
 * @type Number
 * @default 1
 */
Object.defineProperty(PIXI.SmartNormalMapFilter.prototype, 'bias', {
    get: function() {
        return this.uniforms.bias.value;
    },
    set: function(value) {
        this.uniforms.bias.value = value;
    }
});

/**
 * Inverts the red channel.
 *
 * @property invertR
 * @type Number
 * @default 1
 */
Object.defineProperty(PIXI.SmartNormalMapFilter.prototype, 'invertR', {
    get: function() {
        return this.uniforms.invertR.value;
    },
    set: function(value) {
        this.uniforms.invertR.value = value;
    }
});

/**
 * Inverts the green channel.
 *
 * @property invertG
 * @type Number
 * @default 1
 */
Object.defineProperty(PIXI.SmartNormalMapFilter.prototype, 'invertG', {
    get: function() {
        return this.uniforms.invertG.value;
    },
    set: function(value) {
        this.uniforms.invertG.value = value;
    }
});