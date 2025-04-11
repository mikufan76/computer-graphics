use crate::material::{Material, Phong};
use nalgebra::{Vector2, Vector3};
use std::ops::{Add, Div};

pub(crate) struct Ray {
    origin: Vector3<f32>,
    direction: Vector3<f32>,
}

impl Ray {
    pub fn new(origin: Vector3<f32>, direction: Vector3<f32>) -> Ray {
        Ray { origin, direction }
    }
}

pub trait Shape {
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>);

    fn position(&self) -> Vector3<f32>;

    fn color(&self) -> Vector3<f32>;

    // -Start by finding the mean of the points.
    // -From there, calculate the dot products of vectors and sort the opposite direction (max dot product)
    // -Next, sort the points based on the angle
    // -If any angles are duplicates, sort based on the distance to the mean point.
    // o this, but replace "angle between vectors" with "dot product of vectors" and sort the opposite direction
    // (follow points of maximum dot product). This achieves the same thing more efficiently because it avoids
    // unnecessary trig functions.A
}

fn intersect_dispatch<T: Shape>(t: T, ray: &Ray) -> (f32, Vector3<f32>) {
    t.intersect(ray)
}

pub struct Sphere {
    pub(crate) center: Vector3<f32>,
    pub(crate) radius: f32,
    pub(crate) material: Phong,
}

impl Shape for Sphere {
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>) {
        let ray_to_sphere = self.center - ray.origin;
        let dist_ray_to_sphere = ray_to_sphere.magnitude();
        let dist_closest_point_on_ray = ray_to_sphere.dot(&ray.direction);

        // Calculate distance from closest point on ray to sphere center
        let dist_closest_point_to_sphere_squared = dist_ray_to_sphere * dist_ray_to_sphere
            - dist_closest_point_on_ray * dist_closest_point_on_ray;

        // If this distance is greater than the radius, we miss the sphere
        if dist_closest_point_to_sphere_squared > self.radius * self.radius {
            return (f32::INFINITY, Vector3::zeros());
        }

        // Calculate distance from closest point to intersection points
        let dist_to_intersection = dist_closest_point_on_ray
            - (self.radius * self.radius - dist_closest_point_to_sphere_squared).sqrt();

        // If intersection is behind the ray origin
        if dist_to_intersection < 0.0 {
            return (f32::INFINITY, Vector3::zeros());
        }

        let point = ray.origin + ray.direction * dist_to_intersection;
        (dist_to_intersection, point)
    }

    fn color(&self) -> Vector3<f32> {
        self.material.diffuse()
    }

    fn position(&self) -> Vector3<f32> {
        self.center
    }

}

pub struct Polygon {
    vertices: [Vector3<f32>; 4],
    normal: Vector3<f32>,
    triangles: [Triangle; 2],
}

fn order_polygon(mut vertices: [Vector3<f32>; 4]) -> [Vector3<f32>; 4] {
    let mut mean: Vector3<f32> = Vector3::zeros();
    let length = vertices.len() as f32;
    for vertex in &vertices {
        mean.add(vertex);
    }

    mean = mean.div(length);
    vertices.sort_by(|a, b| a.dot(&mean).partial_cmp(&b.dot(&mean)).unwrap());
    vertices
}
impl Shape for Polygon {
    // -Start by finding the mean of the points.
    // -From there, calculate the dot products of vectors and sort the opposite direction (max dot product)
    // -Next, sort the points based on the angle
    // -If any angles are duplicates, sort based on the distance to the mean point.
    // o this, but replace "angle between vectors" with "dot product of vectors" and sort the opposite direction
    // (follow points of maximum dot product). This achieves the same thing more efficiently because it avoids
    // unnecessary trig functions.A

    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>) {
        let tri_1 = self.triangles[0].intersect(ray);
        let tri_2 = self.triangles[1].intersect(ray);

        if tri_1.0 > tri_2.0 {
            return tri_2
        }
        return tri_1

    }

    fn position(&self) -> Vector3<f32> {
        todo!()
    }

    fn color(&self) -> Vector3<f32> {
        return self.triangles[0].material.diffuse();
    }
}

pub struct Triangle {
    pub v0: Vector3<f32>,
    pub v1: Vector3<f32>,
    pub v2: Vector3<f32>,
    pub(crate) material: Phong,
    pub normal: Vector3<f32>,
    pub v0v2: Vector3<f32>,
    pub v1v0: Vector3<f32>,
    pub v2v0: Vector3<f32>,
    pub v2v1: Vector3<f32>,

}

impl Polygon {
    pub(crate) fn new(vertices: [Vector3<f32>; 4], material: Phong) -> Polygon {
        let verts = order_polygon(vertices);
        let triangle_1 = Triangle::new(verts[0], verts[1], verts[2], material.clone());
        let triangle_2 = Triangle::new(verts[0], verts[2], verts[3], material);
        Polygon {
            vertices: verts,
            normal: Vector3::zeros(),
            triangles: [triangle_1, triangle_2],
        }
    }
}

impl Shape for Triangle {
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>) {
        let normal = self.normal;
        let plane_offset = normal.dot(&self.v0);
        let dist_to_surface = (plane_offset - normal.dot(&ray.origin)) / normal.dot(&ray.direction);
        let point = ray.direction.scale(dist_to_surface) + ray.origin;

        let v0p = point - self.v0;
        let c1 = self.v1v0.cross(&v0p).dot(&normal) >= 0.0;


        let v1p = point - self.v1;
        let c2 = self.v2v1.cross(&v1p).dot(&normal) > 0.0;

        let v2p = point - self.v2;
        let c3 = self.v0v2.cross(&v2p).dot(&normal) >= 0.0;

        if (c1 && c2 && c3) {

            return (dist_to_surface, point);
        }
        return (f32::INFINITY, point);
    }

    fn position(&self) -> Vector3<f32> {
        todo!()
    }

    fn color(&self) -> Vector3<f32> {
        todo!()
    }
}

impl Triangle {
    fn new(v0: Vector3<f32>, v1: Vector3<f32>, v2: Vector3<f32>, material: Phong) -> Triangle {
        let edge1 = v1 - v0;
        let edge2 = v2 - v0;
        let normal = edge1.cross(&edge2).normalize();
        let v0v2 = v0 - v2;
        let v1v0 = v1 - v0;
        let v2v0 = v2 - v0;
        let v2v1 = v2 - v1;
        let normal = v1v0.cross(&v2v0).normalize();
        return Triangle {
            v0,
            v1,
            v2,
            v0v2,
            v1v0,
            v2v0,
            v2v1,
            normal,
            material
        };
    }
}
