// shapes.rs
use nalgebra::{Vector2, Vector3};

pub trait Shape {
    fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> (f32, Vector3<f32>);
}

pub struct Sphere {
    pub position: Vector3<f32>,
    pub radius: f32,
    pub ambient: Vector3<f32>,
    pub diffuse: Vector3<f32>,
    pub specular: Vector3<f32>,
    pub reflectivity: f32,
}

pub fn create_sphere(
    position: Vector3<f32>,
    radius: f32,
    ambient: Vector3<f32>,
    diffuse: Vector3<f32>,
    specular: Vector3<f32>,
    reflectivity: f32,
) -> Sphere {
    Sphere {
        position,
        radius,
        ambient,
        diffuse,
        specular,
        reflectivity,
    }
}

impl Sphere {
    pub fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> (f32, Vector3<f32>) {
        let ray_to_sphere = self.position - origin;
        let dist_ray_to_sphere = ray_to_sphere.magnitude();
        let dist_closest_point_on_ray = ray_to_sphere.dot(&direction);

        // Calculate distance from closest point on ray to sphere center
        let dist_closest_point_to_sphere_squared =
            dist_ray_to_sphere * dist_ray_to_sphere - dist_closest_point_on_ray * dist_closest_point_on_ray;

        // If this distance is greater than the radius, we miss the sphere
        if dist_closest_point_to_sphere_squared > self.radius * self.radius {
            return (f32::INFINITY, Vector3::zeros());
        }

        // Calculate distance from closest point to intersection points
        let dist_to_intersection = dist_closest_point_on_ray -
            (self.radius * self.radius - dist_closest_point_to_sphere_squared).sqrt();

        // If intersection is behind the ray origin
        if dist_to_intersection < 0.0 {
            return (f32::INFINITY, Vector3::zeros());
        }

        let point = origin + direction * dist_to_intersection;
        (dist_to_intersection, point)
    }
}

pub struct Triangle {
    pub v0: Vector3<f32>,
    pub v1: Vector3<f32>,
    pub v2: Vector3<f32>,
    pub uv0: Vector2<f32>,
    pub uv1: Vector2<f32>,
    pub uv2: Vector2<f32>,
    pub ambient: Vector3<f32>,
    pub diffuse: Vector3<f32>,
    pub specular: Vector3<f32>,
    pub normal: Vector3<f32>,
    pub reflectivity: f32,
    pub is_textured: bool,
    // Edge vectors for barycentric coordinates
    pub edge1: Vector3<f32>,
    pub edge2: Vector3<f32>,
}

pub fn create_textured_triangle(
    v0: Vector3<f32>,
    v1: Vector3<f32>,
    v2: Vector3<f32>,
    uv0: Vector2<f32>,
    uv1: Vector2<f32>,
    uv2: Vector2<f32>,
    ambient: Vector3<f32>,
    diffuse: Vector3<f32>,
    specular: Vector3<f32>,
    reflectivity: f32,
) -> Triangle {
    let edge1 = v1 - v0;
    let edge2 = v2 - v0;
    let normal = edge1.cross(&edge2).normalize();

    Triangle {
        v0, v1, v2,
        uv0, uv1, uv2,
        ambient, diffuse, specular,
        normal,
        reflectivity,
        is_textured: true,
        edge1, edge2,
    }
}

pub fn create_triangle(
    v0: Vector3<f32>,
    v1: Vector3<f32>,
    v2: Vector3<f32>,
    ambient: Vector3<f32>,
    diffuse: Vector3<f32>,
    specular: Vector3<f32>,
    reflectivity: f32,
) -> Triangle {
    let edge1 = v1 - v0;
    let edge2 = v2 - v0;
    let normal = edge1.cross(&edge2).normalize();

    // Default UV coordinates (not used if not textured)
    let uv0 = Vector2::new(0.0, 0.0);
    let uv1 = Vector2::new(1.0, 0.0);
    let uv2 = Vector2::new(0.0, 1.0);

    Triangle {
        v0, v1, v2,
        uv0, uv1, uv2,
        ambient, diffuse, specular,
        normal,
        reflectivity,
        is_textured: false,
        edge1, edge2,
    }
}

impl Triangle {
    // Returns (distance, hit point, UV coordinates)
    pub fn collide(&self, origin: Vector3<f32>, direction: Vector3<f32>) -> (f32, Vector3<f32>, Vector2<f32>) {
        // Möller–Trumbore intersection algorithm
        let h = direction.cross(&self.edge2);
        let a = self.edge1.dot(&h);

        // If ray is parallel to triangle
        if a.abs() < 0.00001 {
            return (f32::INFINITY, Vector3::zeros(), Vector2::zeros());
        }

        let f = 1.0 / a;
        let s = origin - self.v0;
        let u = f * s.dot(&h);

        // Check if hit point is outside the triangle
        if u < 0.0 || u > 1.0 {
            return (f32::INFINITY, Vector3::zeros(), Vector2::zeros());
        }

        let q = s.cross(&self.edge1);
        let v = f * direction.dot(&q);

        // Check if hit point is outside the triangle
        if v < 0.0 || u + v > 1.0 {
            return (f32::INFINITY, Vector3::zeros(), Vector2::zeros());
        }

        // Calculate distance
        let t = f * self.edge2.dot(&q);

        if t > 0.00001 {
            let hit_point = origin + direction * t;

            // Calculate barycentric coordinates
            let w = 1.0 - u - v;

            // Interpolate UV coordinates using barycentric coordinates
            let uv = self.uv0 * w + self.uv1 * u + self.uv2 * v;

            return (t, hit_point, uv);
        }

        (f32::INFINITY, Vector3::zeros(), Vector2::zeros())
    }
}