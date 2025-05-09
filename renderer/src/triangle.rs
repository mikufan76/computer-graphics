use nalgebra::Vector3;
use crate::ID;
use crate::material::Material;
use crate::ray::Ray;
use crate::shape::{Shape};

pub struct Triangle {
    pub v0: Vector3<f32>,
    pub v1: Vector3<f32>,
    pub v2: Vector3<f32>,
    pub(crate) material: Box<dyn Material>,
    pub normal: Vector3<f32>,
    pub v0v2: Vector3<f32>,
    pub v1v0: Vector3<f32>,
    pub v2v0: Vector3<f32>,
    pub v2v1: Vector3<f32>,
    id: u32,
}

impl Shape for Triangle {
    fn id(&self) -> u32 {
        return self.id
    }

    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>) {
        let normal = self.normal;
        let plane_offset = normal.dot(&self.v0);
        let dist_to_surface = (plane_offset - normal.dot(&ray.origin)) / normal.dot(&ray.direction);
        let point = ray.direction.scale(dist_to_surface) + ray.origin;

        let v0p = point - self.v0;
        let c1 = self.v1v0.cross(&v0p).dot(&normal) >= 0.0;

        let v1p = point - self.v1;
        let c2 = self.v2v1.cross(&v1p).dot(&normal) > 0.0;

        let v2p = point - self.v2;
        let c3 = self.v0v2.cross(&v2p).dot(&normal) >= 0.0;

        if c1 && c2 && c3 {
            let new_norm = point - self.position();

            return (dist_to_surface, point, new_norm);
        }
        return (f32::INFINITY, point, point);
    }

    fn material(&self) -> Box<dyn Material> {
        self.material.clone()

    }

    fn position(&self) -> Vector3<f32> {
        // todo!
        return Vector3::zeros();
    }

    fn ambient_color(&self) -> Vector3<f32> {

        return Vector3::zeros();
    }

    fn specular_color(&self) -> Vector3<f32> {
        return Vector3::zeros();
    }

}

impl Triangle {
    pub(crate) unsafe fn new(
        v0: Vector3<f32>,
        v1: Vector3<f32>,
        v2: Vector3<f32>,
        material: Box<dyn Material>,
    ) -> Triangle {
        // let edge1 = v1 - v0;
        // let edge2 = v2 - v0;
        // let normal = edge1.cross(&edge2).normalize();
        let v0v2 = v0 - v2;
        let v1v0 = v1 - v0;
        let v2v0 = v2 - v0;
        let v2v1 = v2 - v1;
        let normal = v1v0.cross(&v2v0).normalize();
        let id = ID;
        ID += 1;
        return Triangle {
            v0,
            v1,
            v2,
            v0v2,
            v1v0,
            v2v0,
            v2v1,
            normal,
            material,
            id,
        };
    }
}
