use crate::light::Light;
use crate::ray::Ray;
use crate::shape::Shape;
use crate::AMBIENT;
use nalgebra::Vector3;

pub trait Material {
    fn diffuse(&self) -> f32;
    fn calc_diffuse(
        &self,
        light: &Light,
        obj: &dyn Shape,
        ray: &Ray,
        normal: &Vector3<f32>,
    ) -> Vector3<f32>;
    fn calc_specular(
        &self,
        light: &Light,
        obj: &dyn Shape,
        ray: &Ray,
        incoming: &Ray,
    ) -> Vector3<f32>;
    fn specular(&self) -> f32;
    fn ambient(&self) -> f32;
    fn exponent(&self) -> f32;

    fn clone(&self) -> Box<dyn Material>;
}

pub struct Phong {
    pub(crate) diffuse: f32,
    pub(crate) specular: f32,
    pub(crate) ambient: f32,
    pub(crate) exponent: f32,
}

impl Material for Phong {
    fn diffuse(&self) -> f32 {
        self.diffuse
    }

    fn calc_diffuse(
        &self,
        light: &Light,
        obj: &dyn Shape,
        ray: &Ray,
        normal: &Vector3<f32>,
    ) -> Vector3<f32> {
        let obj_ambient = obj.ambient_color();
        let light_color = light.color;
        // println!("light Color: {} obj ambient:  {} ray dir: {} normal: {}", light.color, obj_ambient, ray.direction, normal);
        light_color.component_mul(&obj_ambient) * ray.direction.normalize().dot(&normal)
    }

    fn calc_specular(
        &self,
        light: &Light,
        obj: &dyn Shape,
        ray: &Ray,
        incoming: &Ray,
    ) -> Vector3<f32> {
        let obj_specular = obj.specular_color();
        let light_color = light.color;
        let direction = ray.direction.normalize().dot(&incoming.direction.normalize()).powf(self.exponent);
        light_color.component_mul(&obj_specular) * direction
    }

    fn specular(&self) -> f32 {
        self.specular
    }

    fn ambient(&self) -> f32 {
        self.ambient
    }

    fn exponent(&self) -> f32 {
        self.exponent
    }

    fn clone(&self) -> Box<dyn Material> {
        Box::new(Phong {
            ambient: self.ambient.clone(),
            diffuse: self.diffuse.clone(),
            specular: self.specular.clone(),
            exponent: self.exponent.clone(),
        })
    }
}

impl Phong {
    pub fn new(ambient: f32, diffuse: f32, specular: f32, exponent: f32) -> Phong {
        Phong {
            ambient,
            diffuse,
            specular,
            exponent,
        }
    }
}

// fn illuminate_dispatch<T: Material> ()
