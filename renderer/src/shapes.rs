use nalgebra::{ComplexField, Vector3};

pub trait Shape {
    fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> f32;
    fn get_diffuse(&self)-> Vector3<u32>;
    fn get_specular(&self)-> Vector3<u32>;


}

pub fn generic_collide(s: &dyn Shape, origin: Vector3<f32>, direction: Vector3<f32>) -> f32 {
    s.collide(origin, direction)
}
pub fn generic_diffuse(s: &dyn Shape) -> Vector3<u32> {
    s.get_diffuse()
}
pub struct Sphere {
    position: Vector3<f32>,
    radius: f32,
    diffuse: Vector3<f32>,
    specular: Vector3<f32>,
}

// impl Sphere {
//     fn collision(&self, origin: &Vector3<f32>, direction: &Vector3<f32>) -> Vector3<f32> {
//         let v0v1 =  Vector3::new()
//     }
// }

pub fn create_triangle(
    v0: Vector3<f32>,
    v1: Vector3<f32>,
    v2: Vector3<f32>,
    diffuse: Vector3<u32>,
    specular: Vector3<u32>,
) -> Triangle {
    let v0v2 = v0 - v2;
    let v1v0 = v1 - v0;
    let v2v0 = v2 - v0;
    let v2v1 = v2 - v1;
    let normal = v1v0.cross(&v0v2).normalize();

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
    pub diffuse: Vector3<u32>,
    pub specular: Vector3<u32>,
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

        let c1 = self.v1v0.cross(&(point - self.v0)).dot(&self.normal) >= 0.0;
        let c2 = self.v2v1.cross(&(point - self.v1)).dot(&self.normal) >= 0.0;
        let c3 = self.v0v2.cross(&(point - self.v2)).dot(&self.normal) >= 0.0;

        if (c1 && c2 && c3) {
            return dist_to_surface;
        }
        return f32::INFINITY;
    }

    fn get_diffuse(&self) -> Vector3<u32> {
        self.diffuse
    }

    fn get_specular(&self) -> Vector3<u32> {
        self.specular
    }
}
