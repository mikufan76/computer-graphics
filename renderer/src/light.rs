use nalgebra::Vector3;

struct Light {
    position: Vector3<f32>,
    direction: Vector3<f32>,
}

impl Light {
    fn new(position: Vector3<f32>, direction: Vector3<f32>) -> Light {
        return Light{position, direction};
    }

}