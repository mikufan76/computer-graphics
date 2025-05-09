use nalgebra::Vector3;

pub(crate) struct Ray {
    pub(crate) origin: Vector3<f32>,
    pub(crate) direction: Vector3<f32>,
}

impl Ray {
    /// Create a new vector
    /// [`origin`]: origin
    /// [`direction`]: direction
    pub fn new(origin: Vector3<f32>, direction: Vector3<f32>) -> Ray {
        Ray { origin, direction }
    }

    // return a new copy of ray
    pub fn copy(&self) -> Ray {
        Ray::new(self.origin, self.direction.clone())
    }

    pub fn point_at(&self, t: f32) -> Vector3<f32> {
        self.origin + t * self.direction
    }

    /// Reflect ray perfectly
    /// [`point`]: intersection point
    /// [`ray`]: incoming ray
    /// [`normal`]: normal between incoming ray and the point
    pub fn reflect(&self, point: Vector3<f32>, normal: Vector3<f32>) -> Ray {
        // reflect = s - 2*dot(s,n)*n`
        let ray_dir = self.direction.normalize();
        let scaled = 2.0 * ray_dir.dot(&normal) / normal.magnitude().powf(2.0) * normal;
        let new_dir = ray_dir - scaled;
        // println!("pt: {} incoming ray: {}, outgoing ray: {}", point, ray.direction, new_dir);
        return Ray::new(point, new_dir.normalize());
    }

    // pub fn reflect(&self, hit_point: Vector3<f32>) -> Vector3<f32> {
    //     // todo
    // }
}
