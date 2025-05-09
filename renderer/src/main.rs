#![allow(warnings)]
mod camera;
mod helper;
mod light;
mod material;
mod polygon;
mod ray;
mod shape;
mod sphere;
mod texture;
mod triangle;

use crate::camera::Camera;
use crate::light::Light;
use crate::material::{Material, Phong};
use crate::polygon::Polygon;
use crate::shape::Shape;
use crate::sphere::Sphere;
use nalgebra::Vector3;

static ORIGIN: Vector3<f32> = Vector3::new(1.0, 1.0, 1.0);
static AMBIENT: Vector3<f32> = Vector3::new(0.0, 0.0, 139.0);
static mut ID: u32 = 0;
const WIDTH: u32 = 500;
const HEIGHT: u32 = 500;

static DEBUG_MODE: bool = false;
static LINE_DEPTH: f32 = 10.0;
static LINE_WIDTH: f32 = 0.4;
static LINE_HEIGHT: f32 = 20.0;
const FOCAL_LENGTH: f32 = (40 * WIDTH / 100) as f32;

fn main() {
    let sphere_1_material = Phong {
        ambient: 0.1,
        diffuse: 0.04,
        specular: 0.06,
        exponent: 10.0,
    };
    let polygon_material = sphere_1_material.clone();

    let polygon = unsafe {
        Polygon::new(
            [
                Vector3::new(50.0, 20.0, 10.0),
                Vector3::new(-30.0, 20.0, 10.0),
                Vector3::new(-50.0, 20.0, 60.0),
                Vector3::new(50.0, 20.0, 60.0),
            ],
            polygon_material,
            Vector3::new(0.0, 10.0, 24.0),
            Vector3::new(100.0, 255.0, 100.0),
        )
    };
    let sphere_1 = unsafe {
        Sphere::new(
            Vector3::new(0.0, 0.0, 20.0),
            3.0,
            sphere_1_material.clone(),
            Vector3::new(0.0, 0.0, 100.0),
            Vector3::new(255.0, 255.0, 255.0),
        )
    };

    let sphere_2 = unsafe {
        Sphere::new(
            Vector3::new(0.0, -5.0, 10.0),
            1.0,
            sphere_1_material.clone(),
            Vector3::new(156.0, 100.0, 174.0),
            Vector3::new(2.0, 255.0, 255.0),
        )
    };

    // let objects: [&dyn Shape; 1] = [&polygon];
    // let objects: Vec<&dyn Shape>   = vec![&sphere_2, &sphere_1, &polygon];
    let objects: Vec<&dyn Shape> = vec![&sphere_1, &sphere_2];
    // let objects: Vec<&dyn Shape> = vec![&sphere_1];
    let light = Light::new(
        Vector3::new(0.0, 19.0, 20.0),
        Vector3::new(255.0, 255.0, 255.0),
        0.8,
    );
    let lights = &[light];

    let cam = Camera::new(ORIGIN, WIDTH, HEIGHT, FOCAL_LENGTH);
    Camera::render(&cam, &*objects, lights);
}
