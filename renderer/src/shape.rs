use crate::material::Material;
use crate::{LINE_HEIGHT, LINE_WIDTH};
use nalgebra::{ComplexField, Vector3};
use crate::ray::Ray;

pub trait Shape {

    fn id(&self) -> u32;
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>);
    fn material(&self) -> Box<dyn Material>;
    fn position(&self) -> Vector3<f32>;

    fn ambient_color(&self) -> Vector3<f32>;
    fn specular_color(&self) -> Vector3<f32>;

    fn debug(&self, point: Vector3<f32>) -> Vector3<f32> {
        let mut color = Vector3::zeros();
        let origin = self.position();
        let x_dist = (origin.x - point.x).abs();
        let y_dist = (origin.y - point.y).abs();
        let z_dist = (origin.z - point.z).abs();

        let x_width = x_dist < LINE_WIDTH;
        let y_width = y_dist < LINE_WIDTH;

        let mut hit = false;

        // z found
        if (x_dist < LINE_HEIGHT && y_width) {
            hit = true;
            color = Vector3::new(220.0, 0.0, 0.0);
        }

        // y found
        if (x_width && y_dist < LINE_HEIGHT) {
            hit = true;
            color = Vector3::new(0.0, 220.0, 0.0);
        }

        // z found
        if(z_dist < LINE_WIDTH) {
            hit = true;
            color = Vector3::new(0.0, 0.0, 255.0);
        }

        let origin_size = 0.3;
        // origin found
        if (x_dist < origin_size && y_dist < origin_size && z_dist < origin_size) {
            hit = true;
            return Vector3::new(255.0, 255.0, 255.0);
        }
        return color;
    }
}
