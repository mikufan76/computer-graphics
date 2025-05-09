use nalgebra::Vector3;

pub fn find_centroid(vertices: [Vector3<f32>; 4]) -> Vector3<f32> {
    let mut mean: Vector3<f32> = Vector3::zeros();
    let length = vertices.len() as f32;

    for vertex in &vertices {
        mean += vertex;
    }
    mean.x /= length;
    mean.y /= length;
    mean.z /= length;

    mean
}

pub fn order_coordinates(mut vertices: [Vector3<f32>; 4], mean: Vector3<f32>) -> [Vector3<f32>; 4] {
    vertices.sort_by(|a, b| {
        let a_1 = a - mean;
        let b_1 = b - mean;
        let a_r = (a_1.x.atan2(a_1.y).to_degrees() + 360.0) % 360.0;
        let b_r = (b_1.x.atan2(b_1.y).to_degrees() + 360.0) % 360.0;
        return a_r.partial_cmp(&b_r).unwrap();
    });
    vertices
}