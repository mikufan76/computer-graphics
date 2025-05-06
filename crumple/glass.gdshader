shader_type spatial;
uniform int row_count: hint_range(0, 10) = 0;
uniform int col_count: hint_range(0, 10) = 0;
uniform float smoothness: hint_range(0.0, 10.0) = .02;
uniform float height_scale: hint_range(0.0, 10.0) = 1.0;
uniform float max_height: hint_range(0.0, 5.0) = 2.0;
varying vec2 tex_position;
varying float height;
varying float current_max;
uniform float x_offset: hint_range(1.0, 10.0) = 2.0;
uniform float x_scrunch : hint_range(0.0, 1.0) = 1;
uniform float z_scrunch : hint_range(0.0, 1.0) = 1;
uniform float pinch_start : hint_range(0.0, 1.0) = 0.0;
uniform float pinch_end : hint_range(0.0, 1.0) = 0.0;



vec2 random(vec2 uv) {
	return vec2(fract(sin(dot(uv.xy,
		vec2(12.9898,78.233))) * 43758.5453123));
}

float perlin_noise(vec2 uv) {
    vec2 uv_index = floor(uv);
    vec2 uv_fract = fract(uv);

    vec2 blur = smoothstep(0.0, 1.0, uv_fract);

    return mix( mix( dot( random(uv_index + vec2(0.0,0.0) ), uv_fract - vec2(0.0,0.0) ),
                     dot( random(uv_index + vec2(1.0,0.0) ), uv_fract - vec2(1.0,0.0) ), blur.x),
                mix( dot( random(uv_index + vec2(0.0,1.0) ), uv_fract - vec2(0.0,1.0) ),
                     dot( random(uv_index + vec2(1.0,1.0) ), uv_fract - vec2(1.0,1.0) ), blur.x), blur.y) + 0.5;
}

vec2 voronoi(vec2 uv, float columns, float rows) {
	
	vec2 index_uv = floor(vec2(uv.x * columns, uv.y * rows));
	vec2 fract_uv = fract(vec2(uv.x * columns, uv.y * rows));
	
	
	float minimum_dist = smoothness;  
	vec2 minimum_point;
	
	for (int y= -1; y <= 1; y++) {
		for (int x= -1; x <= 1; x++) {
			vec2 neighbor = vec2(float(x),float(y));
			vec2 point = random(index_uv + neighbor);

			vec2 diff = neighbor + point - fract_uv;
			float dist = length(diff);
			
			if(dist < minimum_dist) {
				minimum_dist = dist;
				minimum_point = point;
			}
		}
	}
	return minimum_point;
}



void vertex() {

// center_texture
 tex_position = VERTEX.xz / 2.0 + 0.5;
height = (voronoi(tex_position, float(col_count), float(row_count))).r;
height = height*height_scale;
VERTEX.x *= x_scrunch;
VERTEX.z *= z_scrunch;

float y_change = height/(z_scrunch+x_scrunch);
if (y_change > max_height) {
	float new_y = clamp(y_change, 0.0, max_height);
	VERTEX.z += new_y;

}

height = y_change;

if (tex_position.x > pinch_start && tex_position.x < pinch_end)  {
	VERTEX.z /= x_offset;
}

height = clamp(height, 0.0, max_height);
VERTEX.y = height;

}

void fragment() {
  float perlin_a = perlin_noise(tex_position);
  float perlin_b = perlin_noise(tex_position*2.0);
  NORMAL = vec3(height, height, height);
  ALBEDO = COLOR.xyz;
}