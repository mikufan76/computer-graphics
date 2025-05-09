use crate::material::Material;
use crate::ray::Ray;
use crate::shape::Shape;
use nalgebra::{Matrix4, Vector3};
use crate::ID;

pub struct Sphere {
    pub(crate) center: Vector3<f32>,
    pub(crate) radius: f32,
    pub(crate) material: Box<dyn Material>,
    pub(crate) ambient: Vector3<f32>,
    pub(crate) specular: Vector3<f32>,
    id: u32,
}

impl Sphere {
    pub unsafe fn new(
        center: Vector3<f32>,
        radius: f32,
        material: Box<dyn Material>,
        ambient: Vector3<f32>,
        specular: Vector3<f32>,
    ) -> Self {
        let id = ID;
        ID += 1;
        return Sphere {
            center,
            radius,
            material,
            ambient,
            specular,
            id: 0,
        };
    }
}

impl Shape for Sphere {
    fn id(&self) -> u32 {
        self.id
    }

    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>) {
        let ray_to_sphere = self.center - ray.origin;
        let dist_ray_to_sphere = ray_to_sphere.magnitude();
        let dist_closest_point_on_ray = ray_to_sphere.dot(&ray.direction);
        let radius_squared = self.radius.powf(2.0);

        // Calculate distance from closest point on ray to sphere center
        let dist_closest_point_to_sphere_squared =
            dist_ray_to_sphere.powf(2.0) - dist_closest_point_on_ray.powf(2.0);

        // If this distance is greater than the radius, we miss the sphere
        if (dist_closest_point_to_sphere_squared > radius_squared)
            || dist_closest_point_to_sphere_squared < 0.0
        {
            return (f32::INFINITY, Vector3::zeros(), ray_to_sphere);
        }

        // Calculate distance from closest point to intersection points
        let dist_to_intersection = dist_closest_point_on_ray
            - (radius_squared - dist_closest_point_to_sphere_squared).sqrt();
        let point = ray.origin + ray.direction * dist_to_intersection;
        let normal = (point - self.center).normalize();
        return (dist_to_intersection, point, normal);
    }

    fn material(&self) -> Box<dyn Material> {
        self.material.clone()
    }

    fn position(&self) -> Vector3<f32> {
        self.center
    }

    fn ambient_color(&self) -> Vector3<f32> {
        self.ambient
    }

    fn specular_color(&self) -> Vector3<f32> {
        self.specular
    }
}
