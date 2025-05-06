shader_type spatial;
uniform sampler2D normalmap;
varying vec2 tex_position;

uniform float x_scale = 1.0;
uniform float y_scale = 1.0;
uniform float z_scale = 1.0;

void vertex() {
	tex_position = VERTEX.yx / 2.0 + 0.5;
	vec4 tex =  texture(normalmap, UV);
	VERTEX.x *= cos(tex.r) * x_scale;
	VERTEX.z *= cos(tex.x) * y_scale;
	VERTEX.y *= cos(tex.y) *z_scale;
	//VERTEX.y += y_scale;
}

void fragment() {
	NORMAL_MAP = texture(normalmap, tex_position).xyz;;
	// Called for every pixel the material is visible on.
}

//void light() {
	// Called for every pixel for every light affecting the material.
	// Uncomment to replace the default light processing function with this one.
//}
