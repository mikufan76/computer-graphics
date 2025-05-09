use crate::light::Light;
use crate::ray::Ray;
use crate::shape::Shape;
use crate::{AMBIENT, DEBUG_MODE};
use log::debug;
use nalgebra::Vector3;

const BG: image::Rgb<u8> = image::Rgb([62, 144, 235]);

pub(crate) struct Camera {
    position: Vector3<f32>,
    width: u32,
    height: u32,
    focal_length: f32,
}

impl Camera {
    pub fn new(position: Vector3<f32>, width: u32, height: u32, focal_length: f32) -> Camera {
        return Camera {
            position,
            width,
            height,
            focal_length,
        };
    }

    /// Get the closest object
    /// Return: Intersected object (if applicable), collision point, normal, distance
    pub fn get_closest_obj<'a>(
        &self,
        ray: &Ray,
        shapes: &[&'a dyn Shape],
    ) -> (Option<&'a dyn Shape>, Vector3<f32>, Vector3<f32>, f32) {
        let mut closest_distance = f32::INFINITY;
        let mut hit_shape: Option<&dyn Shape> = None;
        let mut hit_point: Vector3<f32> = Vector3::zeros();
        let mut hit_normal = Vector3::zeros();

        for shape in shapes.iter() {
            let (dist, pt, norm) = shape.intersect(ray);

            if dist < closest_distance {
                closest_distance = dist;
                hit_normal = norm;
                hit_point = pt;
                hit_shape = Some(shape.clone());
            }
        }
        (hit_shape, hit_point, hit_normal, closest_distance)
    }

    /// Trace a ray from a speicifed origin to a direction.
    fn trace_ray(
        &self,
        direction: Vector3<f32>,
        shapes: &[&dyn Shape],
        lights: &[Light],
    ) -> Vector3<f32> {
        let mut closest_dist = f32::INFINITY;
        let mut collided = false;
        let origin = self.position;

        let ray = Ray::new(origin, direction);

        let (is_shape, hit_point, normal, distance) = self.get_closest_obj(&ray, shapes);

        if is_shape.is_some() {
            let shape = is_shape.unwrap();
            // let ambient = (shape.ambient_color() as Vector3<f32>) * AMBIENT;
            let mut diffuse = Vector3::zeros();
            let mut specular = Vector3::zeros();
            let material = shape.material();

            for light in lights.iter() {
                let light_direction = (light.position - hit_point).normalize();
                let light_ray = Ray::new(hit_point, light_direction);

                let (dist, lit_point, dir) = shape.intersect(&light_ray);

                if dist != f32::INFINITY {
                    let light_reflection = light_ray.reflect(hit_point, normal);
                    diffuse +=
                        material.calc_diffuse(light, is_shape.unwrap(), &light_ray, &normal);
                    specular += material.calc_specular(light, shape, &light_reflection, &ray);
                } else {
                }
            }

            if (DEBUG_MODE) {
                let debug_color = shape.debug(hit_point);
                return debug_color;
            }

            return AMBIENT + material.diffuse() * diffuse + material.specular() * specular;
        }

        return Vector3::new(BG[0] as f32, BG[1] as f32, BG[2] as f32);
    }

    pub fn render(&self, shapes: &[&dyn Shape], lights: &[Light; 1]) {
        let width = self.width as f32;
        let height = self.height as f32;
        let mut imgbuf = image::ImageBuffer::new(self.width, self.height);

        // Iterate over the coordinates and pixels of the image
        for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
            let x1 = x as f32 - width / 2.0;
            let y1 = y as f32 - height / 2.0;
            let direction: Vector3<f32> = Vector3::new(x1, y1, self.focal_length).normalize();

            // Cast primary ray
            let color = Self::trace_ray(self, direction, shapes, lights);

            *pixel = image::Rgb([
                color.x.min(255.0).max(0.0) as u8,
                color.y.min(255.0).max(0.0) as u8,
                color.z.min(255.0).max(0.0) as u8,
            ]);
        }

        imgbuf.save("trace2.png").unwrap();
    }
}
