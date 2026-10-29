export const NODE_COUNT = 12

export const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObj;
  void main() {
    vUv = uv;
    vObj = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

// Lights live in view space, so the surface rotates under fixed lighting.
export const earthFragment = /* glsl */ `
  #define NODE_COUNT ${NODE_COUNT}
  uniform sampler2D uMask;
  uniform vec2 uTexel;
  uniform float uTime;
  uniform vec3 uNodes[NODE_COUNT];
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObj;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);

    float m = texture2D(uMask, vUv).r;
    float land = smoothstep(0.4, 0.6, m);
    // blurred mask: below 1 near coasts (inside land), above 0 in coastal water
    vec2 o = uTexel * 3.0;
    float blur = (texture2D(uMask, vUv + vec2(o.x, 0.0)).r + texture2D(uMask, vUv - vec2(o.x, 0.0)).r
                + texture2D(uMask, vUv + vec2(0.0, o.y)).r + texture2D(uMask, vUv - vec2(0.0, o.y)).r) * 0.25;
    float coast = land * (1.0 - blur);
    float shelf = (1.0 - land) * blur;

    // key light from upper right, wrapped so the dark side keeps some form
    float key = smoothstep(-0.15, 0.95, dot(n, normalize(vec3(0.75, 0.55, 0.55))));

    vec3 ocean = mix(vec3(0.004, 0.012, 0.050), vec3(0.018, 0.090, 0.320), key);
    vec3 ground = mix(vec3(0.040, 0.140, 0.400), vec3(0.260, 0.640, 1.000), key);
    // land drifts toward violet near the poles for variety
    ground = mix(ground, vec3(0.42, 0.36, 0.95), 0.28 * smoothstep(0.55, 1.0, abs(vObj.y)));
    vec3 color = mix(ocean, ground, land);

    // defined coastlines + shallow-water halo
    color += vec3(0.25, 0.72, 1.0) * coast * (0.35 + 0.65 * key) * 0.9;
    color += vec3(0.05, 0.28, 0.70) * shelf * (0.3 + key) * 0.9;

    // gentle pulsing glow around network node locations, mostly on land
    float glow = 0.0;
    for (int i = 0; i < NODE_COUNT; i++) {
      float d = acos(clamp(dot(normalize(vObj), uNodes[i]), -1.0, 1.0));
      float pulse = 0.65 + 0.35 * sin(uTime * 0.9 + float(i) * 1.7);
      glow += smoothstep(0.17, 0.0, d) * pulse;
    }
    color += mix(vec3(0.25, 0.75, 1.0), vec3(0.6, 0.45, 1.0), 0.3) * glow * (0.35 + 0.65 * land) * 0.55;

    // faint graticule
    vec2 g = abs(fract(vUv * vec2(24.0, 12.0) + 0.5) - 0.5);
    color += vec3(0.25, 0.55, 1.0) * (1.0 - smoothstep(0.0, 0.02, min(g.x, g.y))) * 0.06;

    // electric-blue rim, plus a restrained violet rim light from the lower left
    float fres = pow(1.0 - max(dot(n, v), 0.0), 2.6);
    float violetSide = smoothstep(-0.1, 0.8, dot(n, normalize(vec3(-0.9, -0.35, 0.25))));
    color += vec3(0.20, 0.55, 1.0) * fres * (0.45 + 0.55 * key);
    color += vec3(0.52, 0.30, 1.0) * fres * violetSide * 0.85;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const atmosphereFragment = /* glsl */ `
  uniform float uRange;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    float i = pow(max(uRange - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.5);
    // blue overall, violet toward the lower-left edge
    float violet = smoothstep(0.1, 0.9, dot(vNormal.xy, normalize(vec2(-0.8, -0.5))));
    vec3 col = mix(vec3(0.20, 0.58, 1.0), vec3(0.55, 0.34, 0.98), violet * 0.8);
    gl_FragColor = vec4(col * i * uStrength, i * 0.7);
    #include <colorspace_fragment>
  }
`
