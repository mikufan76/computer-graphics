#![allow(warnings)]
mod light;
mod material;
mod texture;
mod shape;
mod camera;

use nalgebra::Vector3;
use crate::material::{Material, Phong};
use crate::shape::{Polygon, Shape, Sphere};
use crate::camera::Camera;
use crate::light::Light;

static ORIGIN: Vector3<f32> = Vector3::new(1.0, 1.0, 1.0);
const WIDTH: u32 = 500;
const HEIGHT: u32 = 500;

static DEBUG_MODE: bool = false;

static LINE_DEPTH: f32 = 10.0;
static LINE_WIDTH: f32 = 0.4;
static LINE_HEIGHT: f32 = 20.0;
const FOCAL_LENGTH: f32 = (40 * WIDTH / 100) as f32;


fn main() {
    let ambient = Vector3::new(35.0, 35.0, 32.0);
    let sphere_1_material = Phong {
        ambient,
        diffuse: Vector3::new(0.0, 100.0, 5.0),
        specular: Vector3::new(230.0, 230.0, 230.0),
    };

    let poly_material = Phong {
        ambient: Vector3::new(0.0, 0.0, 0.0),
        diffuse: Vector3::new(0.0, 100.0, 5.0),
        specular: Vector3::new(230.0, 230.0, 230.0),
    };

    let polygon_material = sphere_1_material.clone();


    let polygon = Polygon::new([Vector3::new(50.0, 20.0, 10.0), Vector3::new(-30.0, 20.0, 10.0), Vector3::new(-50.0, 20.0, 60.0), Vector3::new(50.0, 20.0, 60.0), ], polygon_material);
    let sphere_1 = Sphere { center: Vector3::new(-15.0, 0.0, 27.0), radius: 3.0, material: sphere_1_material.clone() };
    let sphere_2 = Sphere { center: Vector3::new(-20.0, 0.0, 27.0), radius: 3.0, material: poly_material.clone() };

    // let objects: [&dyn Shape; 1] = [&polygon];
    println!("{}", polygon.position());
    let objects: [&dyn Shape; 3] = [&sphere_2, &sphere_1, &polygon];
    let light = Light::new(Vector3::new(0.0, -10.0, 20.0), Vector3::new(1.0, 1.0, 1.0), 0.8);
    let lights = &[light];

    let cam = Camera::new(ORIGIN, WIDTH, HEIGHT, FOCAL_LENGTH);
    Camera::render(&cam, &objects, lights);

}