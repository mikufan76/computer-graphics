use nalgebra::Vector3;

pub trait Material {
    fn illuminate(&self) -> Vector3<f32>;
    fn diffuse(&self) -> Vector3<f32>;
    fn specular(&self) -> Vector3<f32>;
}

pub struct Phong {
    pub(crate) diffuse: Vector3<f32>,
    pub(crate) specular: Vector3<f32>,
}

impl Material for Phong {
    fn illuminate(&self) -> Vector3<f32> {
        Vector3::zeros()
    }

    fn diffuse(&self) -> Vector3<f32> {
        self.diffuse
    }

    fn specular(&self) -> Vector3<f32> {
        self.specular
    }
}

impl Phong {
    pub fn clone(&self) -> Phong {
        return Phong {diffuse:self.diffuse, specular:self.specular}
    }
}

// fn illuminate_dispatch<T: Material> ()