// light.rs
use nalgebra::Vector3;

pub struct Light {
    pub position: Vector3<f32>,
    pub color: Vector3<f32>,
    pub intensity: f32,
}

impl Light {
    pub fn new(position: Vector3<f32>, color: Vector3<f32>, intensity: f32) -> Light {
        Light { position, color, intensity }
    }
}