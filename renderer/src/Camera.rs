use crate::light::Light;
use crate::shape::{Ray, Shape};
use crate::DEBUG_MODE;
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

    fn trace_ray(
        &self,
        direction: Vector3<f32>,
        shapes: &[&dyn Shape],
        light: &[Light; 1],
    ) -> Vector3<f32> {
        let mut closest_dist = f32::INFINITY;
        let mut collided = false;
        let origin = self.position;
        let mut hit_shape: Option<&dyn Shape> = None;
        let mut hit_point: Vector3<f32> = origin;
        let ray = Ray::new(origin, direction);

        for shape_ref in shapes.iter() {
            let shape = *shape_ref;
            let (dist, pt, norm) = shape.intersect(&ray);

            if dist < closest_dist {
                closest_dist = dist;
                hit_point = pt;
                // This is correct, but let's ensure it's normalized
                collided = true;
                hit_shape = Some(shape);
            }
        }

        if !collided {
            return Vector3::new(BG[0] as f32, BG[1] as f32, BG[2] as f32);
        }

        if hit_shape.is_some() {
            if (DEBUG_MODE) {
                return hit_shape.unwrap().debug(hit_point)
            }

            let shape = hit_shape.unwrap();
            let illuminate = shape.illuminate();
            return  illuminate
        }

        return Vector3::new(0.0, 0.0, 0.0);
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
