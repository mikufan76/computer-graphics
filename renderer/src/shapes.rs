use image::Rgb;
use nalgebra::{ComplexField, Vector3};
use std::f32;

pub trait Shape {
    fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> f32;
    fn get_diffuse(&self) -> image::Rgb<u8>;
    fn get_specular(&self) -> image::Rgb<u8>;
}

pub fn generic_collide(s: &dyn Shape, origin: Vector3<f32>, direction: Vector3<f32>) -> f32 {
    s.collide(origin, direction)
}
pub fn generic_diffuse(s: &dyn Shape) -> image::Rgb<u8> {
    s.get_diffuse()
}
pub struct Sphere {
    position: Vector3<f32>,
    radius: f32,
    pub(crate) diffuse: image::Rgb<u8>,
    specular: image::Rgb<u8>,
}

pub fn create_sphere(
    position: Vector3<f32>,
    radius: f32,
    diffuse: image::Rgb<u8>,
    specular: image::Rgb<u8>,
) -> Sphere {
    return Sphere {
        position,
        radius,
        diffuse,
        specular,
    };
}

fn distance(x: f32, y: f32) -> f32 {
    (x * x - y * y).sqrt()
}
impl Shape for Sphere {
    fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> f32 {
        // let rayToSphere = math.sub(sphere.position, origin);
        let ray_to_sphere = self.position - origin;
        // let distRayToSphere = math.mag(rayToSphere);
        let dist_ray_to_sphere = ray_to_sphere.magnitude();
        // let distClosestPointOnRay = math.dot(rayToSphere, direction);
        let dist_closest_point_on_ray = ray_to_sphere.dot(&direction);
        // let distClosestPointToSphere = Math.sqrt(distRayToSphere ** 2 - distClosestPointOnRay ** 2);
        let dist_closest_point_to_sphere = distance(dist_ray_to_sphere, dist_closest_point_on_ray);
        // let distToIntersection = distClosestPointOnRay -  Math.sqrt(sphere.radius ** 2 - distClosestPointToSphere ** 2);
        let distance_to_intersection = dist_closest_point_on_ray - distance(self.radius, dist_closest_point_to_sphere);
        if (dist_closest_point_on_ray > 0.0 && dist_closest_point_to_sphere < self.radius) {
            return distance_to_intersection;
        }
        f32::INFINITY
    }

    fn get_diffuse(&self) -> Rgb<u8> {
        self.diffuse
    }

    fn get_specular(&self) -> Rgb<u8> {
        todo!()
    }
}

pub fn create_triangle(
    v0: Vector3<f32>,
    v1: Vector3<f32>,
    v2: Vector3<f32>,
    diffuse: image::Rgb<u8>,
    specular: image::Rgb<u8>,
) -> Triangle {
    let v0v2 = v0 - v2;
    let v1v0 = v1 - v0;
    let v2v0 = v2 - v0;
    let v2v1 = v2 - v1;
    let normal = v1v0.cross(&v2v0).normalize();

    Triangle {
        v0,
        v1,
        v2,
        diffuse,
        specular,
        v0v2,
        v1v0,
        v2v0,
        v2v1,
        normal,
    }
}

pub struct Triangle {
    pub v0: Vector3<f32>,
    pub v1: Vector3<f32>,
    pub v2: Vector3<f32>,
    pub diffuse: image::Rgb<u8>,
    pub specular: image::Rgb<u8>,
    pub normal: Vector3<f32>,
    pub v0v2: Vector3<f32>,
    pub v1v0: Vector3<f32>,
    pub v2v0: Vector3<f32>,
    pub v2v1: Vector3<f32>,
}

impl Shape for Triangle {
    fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> f32 {
        let normal = self.normal;
        let plane_offset = normal.dot(&self.v0);
        let dist_to_surface = (plane_offset - normal.dot(&origin)) / normal.dot(&direction);
        let point = direction.scale(dist_to_surface) + origin;

        let v0p = point - self.v0;
        let c1 = self.v1v0.cross(&v0p).dot(&normal) >= 0.0;

        let v1p = point - self.v1;
        let c2 = self.v2v1.cross(&v1p).dot(&normal) > 0.0;

        let v2p = point - self.v2;
        let c3 = self.v0v2.cross(&v2p).dot(&normal) >= 0.0;

        if (c1 && c2 && c3) {
            return dist_to_surface;
        }
        return f32::INFINITY;

        // let mut ne;
        //
        // let v0p = point - self.v0;
        // ne = self.v1v0.cross(&v0p);
        // if (ne.dot(&normal) >= 0.0) // point is on right side
        // {
        //     return f32::INFINITY;
        // }
        //
        // let v1p = point - self.v1;
        // ne = self.v2v1.cross(&v1p);
        // if (ne.dot(&normal) >= 0.0) // point is on right side
        // {
        //     return f32::INFINITY;
        // }
        //
        // let v2p = point - self.v2;
        // ne = self.v2v0.cross(&v2p);
        // if (ne.dot(&normal) >= 0.0) // point is on right side
        // {
        //     return f32::INFINITY;
        // }
        //
        // dist_to_surface
    }

    fn get_diffuse(&self) -> image::Rgb<u8> {
        self.diffuse
    }

    fn get_specular(&self) -> image::Rgb<u8> {
        self.specular
    }
}
