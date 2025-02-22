mod shapes;

use crate::shapes::Shape;
use image;
use nalgebra::Vector3;

const WIDTH: usize = 500;
const HEIGHT: usize = 300;
const FOCAL_LENGTH: f32 = 100.0;
const ORIGIN: Vector3<f32> = Vector3::new(1.0, 0.0, 0.0);
const BG: image::Rgb<u8> = image::Rgb([62, 144, 235]);

fn main() {
    let mut buffer = vec![0u32; WIDTH * HEIGHT];

    let tri_1 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(-30.0, 20.0, 10.0),
        Vector3::new(-50.0, 20.0, 60.0),
        image::Rgb([203, 0, 0]),
        image::Rgb([0, 0, 0]),
    );
    let tri_2 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(80.0, 20.0, 60.0),
        Vector3::new(-50.0, 20.0, 60.0),
        image::Rgb([203, 0, 0]),
        image::Rgb([0, 0, 0]),
    );

    let shapes = vec![tri_1, tri_2];

    let mut imgbuf = image::ImageBuffer::new(WIDTH as u32, HEIGHT as u32);

    let mut diffuse: image::Rgb<u8> = image::Rgb([0, 0, 0]);

    let width = WIDTH as f32;
    let height = HEIGHT as f32;

    // Iterate over the coordinates and pixels of the image
    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let r = (0.3 * x as f32) as u8;
        let b = (0.3 * y as f32) as u8;
        *pixel = image::Rgb([r, 0, b]);
        let x1 = x as f32 - width / 2.0;
        let y1 = y as f32 - height / 2.0;
        let direction: Vector3<f32> = Vector3::new(x1, y1, FOCAL_LENGTH);

        let mut closest_dist = f32::INFINITY;
        let mut collided = false;
        for tri in shapes.iter() {
            let dist = tri.collide(ORIGIN, direction);

            if dist < closest_dist {
                closest_dist = dist;
                diffuse = tri.diffuse;
                collided = true;
            }
        }

        if collided {
            *pixel = diffuse;
        }
        else {
            *pixel = BG;
        }
    }

    imgbuf.save("trace.png").unwrap();
}
