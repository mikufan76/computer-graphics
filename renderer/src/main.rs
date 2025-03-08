mod light;
mod shapes;

use crate::shapes::Shape;
use image;
use nalgebra::{DimMul, Vector3, distance, max, point};

const WIDTH: usize = 500;
const HEIGHT: usize = 300;
const FOCAL_LENGTH: f32 = 100.0;
const ORIGIN: Vector3<f32> = Vector3::new(1.0, 0.0, 0.0);
// const ORIGIN: Vector3<f32> = Vector3::new(1.0, -10.0, -19.0);
const BG: image::Rgb<u8> = image::Rgb([62, 144, 235]);

fn reflect(s: Vector3<f32>, normal: Vector3<f32>) -> Vector3<f32> {
    let normal_mag = normal.magnitude();
    let s_n = s.dot(&normal);
    return s - 2.0 * s_n  * normal;
}

fn main() {
    let mut buffer = vec![0u32; WIDTH * HEIGHT];

    let tri_1 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(-30.0, 20.0, 10.0),
        Vector3::new(-50.0, 20.0, 60.0),
        Vector3::new(0.5, 0.5, 0.5),
        Vector3::new(203.0, 0.0, 0.0),
        Vector3::new(203.0, 0.0, 0.0),
    );
    let tri_2 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(80.0, 20.0, 60.0),
        Vector3::new(-50.0, 20.0, 60.0),
        Vector3::new(0.5, 0.5, 0.5),
        Vector3::new(203.0, 0.0, 0.0),
        Vector3::new(203.0, 0.0, 0.0),
    );

    let sphere_1 = shapes::create_sphere(
        Vector3::new(0.0, -5.0, 20.0),
        12.0,
        Vector3::new(0.5, 0.5, 0.5),
        Vector3::new(59.0, 90.0, 111.0),
        Vector3::new(59.0, 90.0, 111.0),
    );

    let sphere_2 = shapes::create_sphere(
        Vector3::new(15.0, 4.0, 25.0),
        12.0,
        Vector3::new(0.5, 0.5, 0.5),
        Vector3::new(0.0, 208.0, 248.0),
        Vector3::new(0.0, 100.0, 248.0),
    );

    let light_color: Vector3<f32> = Vector3::new(255.0, 255.0, 255.0);
    let light_source: Vector3<f32> = Vector3::new(0.0, 20.0, 0.0);

    let tris = vec![tri_1, tri_2];
    let spheres = vec![sphere_1, sphere_2];

    let mut imgbuf = image::ImageBuffer::new(WIDTH as u32, HEIGHT as u32);

    let mut ambient: Vector3<f32> = Vector3::zeros();
    let mut diffuse: Vector3<f32> = Vector3::zeros();
    let mut specular: Vector3<f32> = Vector3::zeros();

    let width = WIDTH as f32;
    let height = HEIGHT as f32;

    // Iterate over the coordinates and pixels of the image
    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let r = (0.3 * x as f32) as u8;
        let b = (0.3 * y as f32) as u8;
        *pixel = image::Rgb([r, 0, b]);
        let x1 = x as f32 - width / 2.0;
        let y1 = y as f32 - height / 2.0;
        let direction: Vector3<f32> = Vector3::new(x1, y1, FOCAL_LENGTH).normalize();

        let mut closest_dist = f32::INFINITY;
        let mut collided = false;
        let mut normal = Vector3::zeros();
        let mut point: Vector3<f32> = Vector3::zeros();
        for tri in tris.iter() {
            let dist = tri.collide(ORIGIN, direction).0;
            let pt = tri.collide(ORIGIN, direction).1;

            if dist < closest_dist {
                closest_dist = dist;
                normal = tri.normal;
                point = pt;
                diffuse = tri.diffuse;
                ambient = tri.ambient;
                specular = tri.specular;
                collided = true;
            }
        }

        for sphere in spheres.iter() {
            let result = sphere.collide(ORIGIN, direction);
            let dist = result.0;
            let pt = result.1;
            if dist < closest_dist {
                closest_dist = dist;
                normal = (pt - sphere.position).normalize();
                ambient = sphere.ambient;
                diffuse = sphere.diffuse;
                specular = sphere.specular;
                point = pt;
                collided = true;
            }
        }

        let diffuse_strength = f32::max(0.0, light_source.dot(&normal));
        let diffuse = diffuse_strength * light_color;

        let view_src = ORIGIN.normalize();
        let reflect_source = reflect(-light_source, normal).normalize();

        let specular_strength = f32::max(0.0, view_src.dot(&reflect_source)).powf(256.0);
        let specular: Vector3<f32> = specular_strength * light_color;

        let result = ambient * 0.0 + diffuse * 0.6 + specular * 0.5;

        if collided {
            let r = result[0] as u8;
            let g = result[1] as u8;
            let b = result[2] as u8;
            *pixel = image::Rgb([r, g, b]);
        } else {
            *pixel = BG;
        }
    }

    imgbuf.save("trace.png").unwrap();
}
