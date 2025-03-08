shader_type spatial;
uniform sampler2D noise;
uniform float height : hint_range(0.0, 1.0) = 1;
uniform float x_scrunch : hint_range(0.0, 1.0) = 1;
uniform float y_scrunch : hint_range(0.0, 1.0) = 1;
uniform float z_scrunch : hint_range(0.0, 1.0) = 1;
uniform sampler2D normalmap;
varying vec2 tex_position;
varying vec2 crumples;
uniform float x_offset: hint_range(0.0, 1.0) = 0.2;
uniform float bump_strength: hint_range(0.0, 4.0) = 0.01;
uniform int x_folds: hint_range(0, 20) = 2;


float random (vec2 uv) {
    return fract(sin(dot(uv.xy,
        vec2(12.9898,78.233))) * 43758.5453123);
}


void vertex() {
	float h = texture(noise, UV).x;
	int pos_x = int(ceil((UV.x * 100.0)/float(x_folds)));
	int pos_y = int(UV.y * 100.0);
	float noise_text = texture(noise, tex_position).y;
	//VERTEX.y += noise_text * bump_strength;
	//VERTEX.y += sin(VERTEX.x);
	if (pos_x % x_folds == 0 && x_folds != 0) {
		VERTEX.y += height;
		VERTEX.x += cos(UV.y)*x_offset; 
	
		//VERTEX.x -= cos(VERTEX.y);
	}
	
	//if (sin(VERTEX.y) == crumple)
	//{
		//VERTEX.y -= clamp(texture(noise, VERTEX.xz).x, 0 ,height);
	//}
	//VERTEX.y= -h;
	VERTEX.x *= x_scrunch;
	VERTEX.y *= y_scrunch;
	VERTEX.z *= z_scrunch;
	tex_position = VERTEX.yx / 2.0 + 0.5;
	

	
	
	//VERTEX.y += clamp(disp, 0, height);

}

void fragment() {
	
	NORMAL_MAP = texture(normalmap, tex_position).xyz;;
	ALBEDO = COLOR.xyz;
	// Called for every pixel the material is visible on.
}

//void light() {
	// Called for every pixel for every light affecting the material.
	// Uncomment to replace the default light processing function with this one.
//}
