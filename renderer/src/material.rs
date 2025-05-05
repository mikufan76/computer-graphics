use nalgebra::Vector3;
use crate::light::Light;

pub trait Material {
    fn illuminate(&self) -> Vector3<f32>;
    fn diffuse(&self) -> Vector3<f32>;
    fn specular(&self) -> Vector3<f32>;
    fn ambient(&self) -> Vector3<f32>;

    fn clone(&self) -> Box<dyn Material>;
}

pub struct Phong {
    pub(crate) diffuse: Vector3<f32>,
    pub(crate) specular: Vector3<f32>,
    pub(crate) ambient: Vector3<f32>,
}

impl Material for Phong {
    fn illuminate(&self) -> Vector3<f32> {
        self.ambient
    }

    fn diffuse(&self) -> Vector3<f32> {
        self.diffuse
    }

    fn specular(&self) -> Vector3<f32> {
        self.specular
    }

    fn ambient(&self) -> Vector3<f32> {
        self.ambient
    }

    fn clone(&self) -> Box<dyn Material> {
        Box::new(Phong {ambient:self.ambient.clone(), diffuse:self.diffuse.clone(), specular:self.specular.clone()})
    }

}

impl Phong {
    pub fn new(ambient: Vector3<f32>, diffuse: Vector3<f32>, specular: Vector3<f32>) -> Phong {
        Phong {ambient, diffuse, specular}
    }
}

// fn illuminate_dispatch<T: Material> ()