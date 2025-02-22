mod shapes;

use crate::shapes::{Shape, generic_collide, generic_diffuse};
use minifb::KeyRepeat::No;
use minifb::{Key, Scale, ScaleMode, Window, WindowOptions};
use nalgebra::Vector3;
use std::ptr::null;

const WIDTH: usize = 500;
const HEIGHT: usize = 300;
const FOCAL_LENGTH: f32 = 100.0;
const ORIGIN: Vector3<f32> = Vector3::new(1.0, 0.0, 0.0);

fn main() {
    let mut buffer = vec![0u32; WIDTH * HEIGHT];

    let mut window = Window::new(
        "Ray tracer",
        WIDTH,
        HEIGHT,
        WindowOptions {
            resize: true,
            scale: Scale::X4,
            scale_mode: ScaleMode::AspectRatioStretch,
            ..WindowOptions::default()
        },
    )
    .expect("Unable to create the window");

    window.set_target_fps(60);

    let tri_1 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(-30.0, 20.0, 10.0),
        Vector3::new(-50.0, 20.0, 60.0),
        Vector3::new(203, 0, 0),
        Vector3::new(0, 0, 0),
    );
    let tri_2 = shapes::create_triangle(
        Vector3::new(50.0, 20.0, 10.0),
        Vector3::new(80.0, 20.0, 60.0),
        Vector3::new(-50.0, 20.0, 60.0),
        Vector3::new(203, 0, 0),
        Vector3::new(0, 0, 0),
    );

    let shapes = vec![tri_1, tri_2];

    window.set_background_color(0, 0, 20);
    let mut diffuse: Vector3<u32> = Vector3::new(0, 0, 0);

    while window.is_open() && !window.is_key_down(Key::Escape) {
        for (i, pixel) in buffer.iter_mut().enumerate() {
            let x = (i % WIDTH) as f32;
            let y = (i / WIDTH) as f32;
            let direction = Vector3::new(x, y, FOCAL_LENGTH);

            let mut closest_dist = f32::INFINITY;
            let mut collided = false;
            for tri in shapes.iter() {
                let dist = tri.collide(ORIGIN, direction);

                if (dist < closest_dist) {
                    closest_dist = dist;
                    diffuse = tri.diffuse;
                    collided = true;
                }
            }

            if (collided) {
                *pixel = diffuse[0] | diffuse[1] | diffuse[2];
            }
        }
        window.update_with_buffer(&buffer, WIDTH, HEIGHT).unwrap();
    }
}
