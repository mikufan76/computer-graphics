// main.rs
mod light;
mod shapes;
mod texture;

use crate::shapes::Shape;
use image::{self, GenericImageView, RgbImage};
use nalgebra::{Vector2, Vector3};

const WIDTH: usize = 500;
const HEIGHT: usize = 300;
const FOCAL_LENGTH: f32 = 100.0;
const ORIGIN: Vector3<f32> = Vector3::new(1.0, 0.0, 0.0);
const BG: image::Rgb<u8> = image::Rgb([62, 144, 235]);
const MAX_RECURSION_DEPTH: u32 = 3;

// Helper function to reflect a vector
fn reflect(v: Vector3<f32>, n: Vector3<f32>) -> Vector3<f32> {
    v - n * 2.0 * v.dot(&n)
}

fn main() {
    // Load texture (with a fallback to create a generated texture if file isn't found)
    let texture = match texture::load_texture("eee.png") {
        Ok(tex) => tex,
        Err(_) => texture::create_checkerboard_texture(1900, 1900),
    };

    // Create floor triangles with texture coordinates
    let tri_1 = shapes::create_textured_triangle(
        Vector3::new(50.0, 20.0, 10.0), // bottom right
        Vector3::new(-30.0, 20.0, 10.0), // bottom left
        Vector3::new(-50.0, 20.0, 60.0), //top
        Vector2::new(1.0, 0.0),  // UV coords for v0
        Vector2::new(0.0, 0.0),  // UV coords for v1
        Vector2::new(0.0, 1.0),  // UV coords for v2
        Vector3::new(20.0, 20.0, 20.0),
        Vector3::new(200.0, 200.0, 200.0),
        Vector3::new(180.0, 180.0, 180.0),
        0.2,  // Add reflectivity
    );

    let tri_2 = shapes::create_textured_triangle(
        Vector3::new(50.0, 20.0, 10.0), // bottom right

        Vector3::new(50.0, 20.0, 60.0), // bottom right
        Vector3::new(-50.0, 20.0, 60.0), //


        Vector2::new(1.0, 0.0),  // UV coords for v0
        Vector2::new(0.0, 0.0),  // UV coords for v1
        Vector2::new(0.0, 1.0),  // UV coords for v2
        Vector3::new(20.0, 20.0, 20.0),
        Vector3::new(200.0, 200.0, 200.0),
        Vector3::new(180.0, 180.0, 180.0),
        0.2,  // Add reflectivity
    );



    let sphere_1 = shapes::create_sphere(
        Vector3::new(0.0, -5.0, 20.0),
        12.0,
        Vector3::new(5.0, 5.0, 5.0),       // Lower ambient for more contrast
        Vector3::new(59.0, 90.0, 111.0),   // Keep diffuse the same
        Vector3::new(230.0, 230.0, 230.0), // Increase specular for stronger highlights
        0.3,  // Reflectivity
    );

    let sphere_2 = shapes::create_sphere(
        Vector3::new(15.0, 4.0, 25.0),
        12.0,
        Vector3::new(5.0, 5.0, 5.0),       // Lower ambient
        Vector3::new(0.0, 100.0, 100.0),   // Keep diffuse
        Vector3::new(230.0, 230.0, 230.0), // Higher specular
        0.5,  // Reflectivity
    );

    // let sphere_1 = shapes::create_sphere(
    //     Vector3::new(0.0, -5.0, 20.0),
    //     12.0,
    //     Vector3::new(10.0, 10.0, 10.0),
    //     Vector3::new(59.0, 90.0, 111.0),
    //     Vector3::new(200.0, 200.0, 200.0),
    //     0.3,  // Add reflectivity
    // );
    //
    // let sphere_2 = shapes::create_sphere(
    //     Vector3::new(15.0, 4.0, 25.0),
    //     12.0,
    //     Vector3::new(10.0, 10.0, 10.0),
    //     Vector3::new(0.0, 208.0, 248.0),
    //     Vector3::new(200.0, 200.0, 200.0),
    //     0.5,  // Add reflectivity
    // );

    // Create multiple light sources
    let lights = vec![
        light::Light::new(
            Vector3::new(60.0, 30.0, 0.0),  // Position
            Vector3::new(255.0, 255.0, 255.0),  // Color
            1.0,  // Intensity
        ),
        // light::Light::new(
        //     Vector3::new(-20.0, 20.0, 0.0),  // Position
        //     Vector3::new(255.0, 220.0, 180.0),  // Warm light
        //     0.7,  // Intensity
        // ),
    ];

    let tris = vec![tri_1, tri_2];
    let spheres = vec![sphere_1, sphere_2];

    let mut imgbuf = image::ImageBuffer::new(WIDTH as u32, HEIGHT as u32);

    let width = WIDTH as f32;
    let height = HEIGHT as f32;

    // Iterate over the coordinates and pixels of the image
    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let x1 = x as f32 - width / 2.0;
        let y1 = y as f32 - height / 2.0;
        let direction: Vector3<f32> = Vector3::new(x1, y1, FOCAL_LENGTH).normalize();

        // Cast primary ray
        let color = trace_ray(
            ORIGIN,
            direction,
            &tris,
            &spheres,
            &lights,
            &texture,
            0
        );

        *pixel = image::Rgb([
            color.x.min(255.0).max(0.0) as u8,
            color.y.min(255.0).max(0.0) as u8,
            color.z.min(255.0).max(0.0) as u8
        ]);
    }

    imgbuf.save("trace.png").unwrap();
}

// Recursive ray tracing function
fn trace_ray(
    origin: Vector3<f32>,
    direction: Vector3<f32>,
    tris: &Vec<shapes::Triangle>,
    spheres: &Vec<shapes::Sphere>,
    lights: &Vec<light::Light>,
    texture: &RgbImage,
    depth: u32,
) -> Vector3<f32> {
    if depth > MAX_RECURSION_DEPTH {
        return Vector3::new(BG[0] as f32, BG[1] as f32, BG[2] as f32);
    }

    let mut closest_dist = f32::INFINITY;
    let mut collided = false;
    let mut normal = Vector3::zeros();
    let mut hit_point = Vector3::zeros();
    let mut ambient = Vector3::zeros();
    let mut diffuse = Vector3::zeros();
    let mut specular = Vector3::zeros();
    let mut reflectivity = 0.0;
    let mut uv_coords = Vector2::zeros();
    let mut is_textured = false;

    // Check triangle intersections
    for tri in tris.iter() {
        let (dist, pt, hit_uv) = tri.collide(origin, direction);

        if dist < closest_dist && dist > 0.0 {
            closest_dist = dist;
            normal = tri.normal;
            hit_point = pt;
            ambient = tri.ambient;
            diffuse = tri.diffuse;
            specular = tri.specular;
            reflectivity = tri.reflectivity;
            uv_coords = hit_uv;
            is_textured = tri.is_textured;
            collided = true;
        }
    }

    for sphere in spheres.iter() {
        let (dist, pt) = sphere.collide(origin, direction);

        if dist < closest_dist && dist > 0.0 {
            closest_dist = dist;
            // This is correct, but let's ensure it's normalized
            normal = (pt - sphere.position).normalize();
            ambient = sphere.ambient;
            diffuse = sphere.diffuse;
            specular = sphere.specular;
            reflectivity = sphere.reflectivity;
            hit_point = pt;
            is_textured = false;
            collided = true;
        }
    }


    if !collided {
        return Vector3::new(BG[0] as f32, BG[1] as f32, BG[2] as f32);
    }

    // Apply texture if available
    if is_textured {
        // Sample texture at UV coordinates
        let tex_color = texture::sample_texture(texture, uv_coords.x, uv_coords.y);
        diffuse = Vector3::new(tex_color[0] as f32, tex_color[1] as f32, tex_color[2] as f32);
    }

    // In the trace_ray function, modify the lighting calculation part:

    // Initialize final color with ambient component (no division by 255.0 here)
    let mut final_color = ambient.component_mul(&diffuse);

    // For each light source
    for light in lights {
        let light_dir = (light.position - hit_point).normalize();
        let light_distance = (light.position - hit_point).magnitude();

        // Shadow ray - check if point is in shadow
        let shadow_origin = hit_point + normal * 0.001; // Offset to avoid self-intersection
        let mut in_shadow = false;

        for tri in tris.iter() {
            let (dist, _, _) = tri.collide(shadow_origin, light_dir);
            if dist < light_distance && dist > 0.0 {
                in_shadow = true;
                break;
            }
        }

        for sphere in spheres.iter() {
            let (dist, _) = sphere.collide(shadow_origin, light_dir);
            if dist < light_distance && dist > 0.0 {
                in_shadow = true;
                break;
            }
        }

        if !in_shadow {
            // Diffuse component (Lambert's cosine law)
            let diff_factor = normal.dot(&light_dir).max(0.0);
            let diff_color = diffuse * diff_factor;

            // Specular component (Blinn-Phong) - increase shininess for more defined highlights
            let view_dir = (origin - hit_point).normalize();
            let halfway_dir = (light_dir + view_dir).normalize();

            // Increase the exponent for a sharper specular highlight
            // 32.0 might be too low for a nice shiny appearance
            let shininess = 64.0;  // Try higher values like 64, 128, or 256
            let spec_factor = normal.dot(&halfway_dir).max(0.0).powf(shininess);

            // Make specular stronger by multiplying by a factor
            let spec_intensity = 1.0;  // Adjust as needed (1.0 is normal, higher values make it brighter)
            let spec_color = specular * spec_factor * spec_intensity;

            // The rest remains the same...
            let attenuation = 1.0 / (1.0 + 0.01 * light_distance + 0.001 * light_distance * light_distance);
            let light_contribution = (diff_color + spec_color) * attenuation;
            let scaled_contribution = light_contribution.component_mul(&light.color) * light.intensity;
            final_color += scaled_contribution;
        }
    }

    // Calculate reflection color
    let mut reflection_color = Vector3::zeros();
    if reflectivity > 0.0 {
        let reflection_dir = reflect(-direction, normal);
        let reflection_origin = hit_point + normal * 0.001; // Avoid self-intersection

        reflection_color = trace_ray(
            reflection_origin,
            reflection_dir,
            tris,
            spheres,
            lights,
            texture,
            depth + 1
        );
    }

    // Blend direct illumination with reflection
    final_color = final_color * (1.0 - reflectivity) + reflection_color * reflectivity;

    // Now normalize to [0-255] range only once at the end
    final_color
}