mod light;
mod material;
mod texture;
mod shape;
mod world;
mod camera;
mod ray;

use nalgebra::Vector3;
use crate::material::Phong;
use crate::shape::{Polygon, Shape, Sphere};
use crate::world::World;
use crate::camera::Camera;

const FOCAL_LENGTH: f32 = 100.0;
const ORIGIN: Vector3<f32> = Vector3::new(1.0, 0.0, 0.0);
const WIDTH: u32 = 500;
const HEIGHT: u32 = 300;


fn main() {
    let sphere_1_material = Phong {
        diffuse: Vector3::new(0.0, 5.0, 5.0),
        specular: Vector3::new(230.0, 230.0, 230.0),
    };

    let polygon_material = sphere_1_material.clone();


    let sphere_1 = Sphere { center: Vector3::new(0.0, -5.0, 20.0), radius: 12.0, material: sphere_1_material };
    let polygon = Polygon::new([Vector3::new(50.0, 20.0, 10.0), Vector3::new(-30.0, 20.0, 10.0), Vector3::new(-50.0, 20.0, 60.0), Vector3::new(50.0, 20.0, 60.0), ], polygon_material);

    let objects: [&dyn Shape; 2] = [&sphere_1, &polygon];
    let cam = Camera::new(ORIGIN, WIDTH, HEIGHT, FOCAL_LENGTH);
    Camera::render(&cam, &objects);


}