import {MATERIAL_FRAMES} from '../../constants/index';

const {floor, ceil, round} = Math;

function VoxelPlaneShader(opts) {
  const {game, textureAtlas} = opts;

  this.game = game;
  this.textureAtlas = textureAtlas;

  const {THREE} = this.game;

  const materialParams = {
    transparent: true,
    side: THREE.FrontSide,
    lights: [], // force lights refresh to setup uniforms, three.js WebGLRenderer line 4323
    fog: true,

    uniforms: THREE.UniformsUtils.merge( [

      THREE.UniformsLib[ "common" ],
      THREE.UniformsLib[ "aomap" ],
      THREE.UniformsLib[ "lightmap" ],
      THREE.UniformsLib[ "emissivemap" ],
      THREE.UniformsLib[ "fog" ],
      THREE.UniformsLib[ "lights" ],

      {
        "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },

        // begin custom
        tileMap: {type: 't', value: null}, // textures not preserved by UniformsUtils.merge(); set below instead
        frame: {type: 'i', value: 0}
        // end custom
      }

    ] ),

    vertexShader: [

      "#define LAMBERT",

      "varying vec3 vLightFront;",

      "#ifdef DOUBLE_SIDED",

      "	varying vec3 vLightBack;",

      "#endif",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "uv_pars_vertex" ],
      THREE.ShaderChunk[ "uv2_pars_vertex" ],
      THREE.ShaderChunk[ "envmap_pars_vertex" ],
      THREE.ShaderChunk[ "bsdfs" ],
      THREE.ShaderChunk[ "lights_pars" ],
      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
      THREE.ShaderChunk[ "skinning_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

      // begin custom
      'uniform int frame;',
      '',
      _range(0, MATERIAL_FRAMES / 2).map(i => 'attribute vec4 frameUv' + i +';').join('\n'),
      '',
      'varying vec2 vTile;',
      '',
      'vec2 getTileFrame() {',
      _range(0, MATERIAL_FRAMES).map(i =>
      '  if (frame == ' + i + ') return frameUv' + floor(i / 2) + '.' + ((i % 2 === 0) ? 'xy' : 'zw') + ';'
      ).join('\n'),
      '  return vec2(0.0, 0.0);',
      '}',
      '',
      // end custom

      "void main() {",

        THREE.ShaderChunk[ "uv_vertex" ],
        THREE.ShaderChunk[ "uv2_vertex" ],
        THREE.ShaderChunk[ "color_vertex" ],

        THREE.ShaderChunk[ "beginnormal_vertex" ],
        THREE.ShaderChunk[ "morphnormal_vertex" ],
        THREE.ShaderChunk[ "skinbase_vertex" ],
        THREE.ShaderChunk[ "skinnormal_vertex" ],
        THREE.ShaderChunk[ "defaultnormal_vertex" ],

        THREE.ShaderChunk[ "begin_vertex" ],
        THREE.ShaderChunk[ "morphtarget_vertex" ],
        THREE.ShaderChunk[ "skinning_vertex" ],
        THREE.ShaderChunk[ "project_vertex" ],
        THREE.ShaderChunk[ "logdepthbuf_vertex" ],

        THREE.ShaderChunk[ "worldpos_vertex" ],
        THREE.ShaderChunk[ "envmap_vertex" ],
        THREE.ShaderChunk[ "lights_lambert_vertex" ],
        THREE.ShaderChunk[ "shadowmap_vertex" ],

        // begin custom
        'vTile = getTileFrame();',
        // end custom

      "}"

    ].join( "\n" ),

    fragmentShader: [

      "uniform vec3 diffuse;",
      "uniform vec3 emissive;",
      "uniform float opacity;",

      "varying vec3 vLightFront;",

      "#ifdef DOUBLE_SIDED",

      "	varying vec3 vLightBack;",

      "#endif",

      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "uv_pars_fragment" ],
      THREE.ShaderChunk[ "uv2_pars_fragment" ],
      THREE.ShaderChunk[ "map_pars_fragment" ],
      THREE.ShaderChunk[ "alphamap_pars_fragment" ],
      THREE.ShaderChunk[ "aomap_pars_fragment" ],
      THREE.ShaderChunk[ "lightmap_pars_fragment" ],
      THREE.ShaderChunk[ "emissivemap_pars_fragment" ],
      THREE.ShaderChunk[ "envmap_pars_fragment" ],
      THREE.ShaderChunk[ "bsdfs" ],
      THREE.ShaderChunk[ "lights_pars" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
      THREE.ShaderChunk[ "shadowmask_pars_fragment" ],
      THREE.ShaderChunk[ "specularmap_pars_fragment" ],
      THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

      // begin custom
      'uniform sampler2D tileMap;',
      '',
      'varying vec2 vTile;',
      '',
      // end custom

      "void main() {",

      "	vec4 diffuseColor = vec4( diffuse, opacity );",
      "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
      "	vec3 totalEmissiveLight = emissive;",

        THREE.ShaderChunk[ "logdepthbuf_fragment" ],

        // begin custom
        // THREE.ShaderChunk[ "map_fragment" ],
        'vec4 texelColor = texture2D(tileMap, vTile);',

        'if (texelColor.a < 0.5) discard;',

        // 'texelColor = mapTexelToLinear(texelColor);',

        'diffuseColor *= texelColor;',
        // end custom

        THREE.ShaderChunk[ "color_fragment" ],
        THREE.ShaderChunk[ "alphamap_fragment" ],
        THREE.ShaderChunk[ "alphatest_fragment" ],
        THREE.ShaderChunk[ "specularmap_fragment" ],
        THREE.ShaderChunk[ "emissivemap_fragment" ],

        // accumulation
      "	reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );",

        THREE.ShaderChunk[ "lightmap_fragment" ],

      "	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );",

      "	#ifdef DOUBLE_SIDED",

      "		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;",

      "	#else",

      "		reflectedLight.directDiffuse = vLightFront;",

      "	#endif",

      "	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();",

        // modulation
        THREE.ShaderChunk[ "aomap_fragment" ],

      "	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveLight;",

        THREE.ShaderChunk[ "envmap_fragment" ],

      "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",

        THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

        THREE.ShaderChunk[ "fog_fragment" ],

      "}"

    ].join( "\n" ),
    // depthWrite: false,
    // depthTest: false,
  };
  materialParams.uniforms.tileMap.value = this.textureAtlas.getTexture();

  this.material = new THREE.ShaderMaterial(materialParams);
}

VoxelPlaneShader.prototype.setFrame = function(frame) {
  frame = frame % MATERIAL_FRAMES;
  this.material.uniforms.frame.value = frame;
}

function _range(a, b) {
  const l = b - a;
  const result = Array(l);
  for (let i = 0; i < l; i++) {
    result[i] = a + i;
  }
  return result;
}

function voxelPlaneShader(opts) {
  return new VoxelPlaneShader(opts);
}

module.exports = voxelPlaneShader;
