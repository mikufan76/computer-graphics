use crate::material::Material;
use crate::{LINE_DEPTH, LINE_HEIGHT, LINE_WIDTH, ORIGIN};
use nalgebra::{abs, point, ComplexField, Vector3};
use std::ops::{Add, Div, Sub};

pub(crate) struct Ray {
    origin: Vector3<f32>,
    direction: Vector3<f32>,
}

impl Ray {
    pub fn new(origin: Vector3<f32>, direction: Vector3<f32>) -> Ray {
        Ray { origin, direction }
    }

    pub fn copy(&self) -> Ray {
        Ray::new(self.origin, self.direction)
    }

    pub fn point_at(&self, t: f32) -> Vector3<f32> {
        self.origin + t * self.direction
    }

    // pub fn reflect(&self, hit_point: Vector3<f32>) -> Vector3<f32> {
    //     // todo
    // }
}

pub trait Shape {
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>);

    fn position(&self) -> Vector3<f32>;

    fn color(&self) -> Vector3<f32>;

    fn illuminate(&self) -> Vector3<f32>;

    fn debug(&self, point: Vector3<f32>) -> Vector3<f32> {
        let mut color = self.illuminate();
        let origin = self.position();
        let x_dist = (origin.x - point.x).abs();
        let y_dist = (origin.y - point.y).abs();
        let z_dist = (origin.z - point.z).abs();

        let x_width = x_dist < LINE_WIDTH;
        let y_width = y_dist < LINE_WIDTH;

        let mut hit = false;

        // z found
        if (x_dist < LINE_HEIGHT && y_width) {
            hit = true;
            color = Vector3::new(220.0, 0.0, 0.0);
        }

        // y found
        if (x_width && y_dist < LINE_HEIGHT) {
            hit = true;
            color = Vector3::new(0.0, 220.0, 0.0);
        }

        // z found
        if(z_dist < LINE_WIDTH) {
            hit = true;
            color = Vector3::new(0.0, 0.0, 255.0);
        }

        let origin_size = 0.3;
        // origin found
        if (x_dist < origin_size && y_dist < origin_size && z_dist < origin_size) {
            hit = true;
            return Vector3::new(255.0, 255.0, 255.0);
        }

        if !hit {
            println!("{}", x_dist)
        }
        return color;
    }
}

pub struct Sphere {
    pub(crate) center: Vector3<f32>,
    pub(crate) radius: f32,
    pub(crate) material: Box<dyn Material>,
}

impl Shape for Sphere {
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
        (dist_to_intersection, point, ray.direction)
    }

    fn position(&self) -> Vector3<f32> {
        self.center
    }

    fn color(&self) -> Vector3<f32> {
        self.material.diffuse()
    }

    fn illuminate(&self) -> Vector3<f32> {
        self.material.illuminate()
    }
}

pub struct Polygon {
    vertices: [Vector3<f32>; 4],
    normal: Vector3<f32>,
    triangles: [Triangle; 2],
    mean: Vector3<f32>,
}
fn find_centroid(vertices: [Vector3<f32>; 4]) -> Vector3<f32> {
    let mut mean: Vector3<f32> = Vector3::zeros();
    let length = vertices.len() as f32;

    for vertex in &vertices {
        mean += vertex;
        println!("mean wip {:?}", mean);
    }
    mean.x /= length;
    mean.y /= length;
    mean.z /= length;

    mean
}

fn order_polygon(mut vertices: [Vector3<f32>; 4], mean: Vector3<f32>) -> [Vector3<f32>; 4] {
    vertices.sort_by(|a, b| {
        let a_1 = a - mean;
        let b_1 = b - mean;
        let a_r = (a_1.x.atan2(a_1.y).to_degrees() + 360.0) % 360.0;
        let b_r = (b_1.x.atan2(b_1.y).to_degrees() + 360.0) % 360.0;
        return a_r.partial_cmp(&b_r).unwrap();
    });
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

    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>) {
        let tri_1 = self.triangles[0].intersect(ray);
        let tri_2 = self.triangles[1].intersect(ray);

        if tri_1.0 > tri_2.0 {
            return tri_2;
        }
        return tri_1;
    }

    fn position(&self) -> Vector3<f32> {
        self.mean
    }

    fn color(&self) -> Vector3<f32> {
        return self.triangles[0].material.diffuse();
    }

    fn illuminate(&self) -> Vector3<f32> {
        return self.normal;
    }
}

pub struct Triangle {
    pub v0: Vector3<f32>,
    pub v1: Vector3<f32>,
    pub v2: Vector3<f32>,
    pub(crate) material: Box<dyn Material>,
    pub normal: Vector3<f32>,
    pub v0v2: Vector3<f32>,
    pub v1v0: Vector3<f32>,
    pub v2v0: Vector3<f32>,
    pub v2v1: Vector3<f32>,
}

impl Polygon {
    pub(crate) fn new(vertices: [Vector3<f32>; 4], material_ref: Box<dyn Material>) -> Polygon {
        let material = material_ref;
        println!("{:?}", vertices);
        let mean = find_centroid(vertices);
        println!("mean: {:?}", mean);
        let verts = order_polygon(vertices, mean);
        let triangle_1 = Triangle::new(verts[0], verts[1], verts[2], (*material).clone());
        let triangle_2 = Triangle::new(verts[1], verts[3], verts[2], material);
        Polygon {
            vertices: verts,
            normal: Vector3::zeros(),
            triangles: [triangle_1, triangle_2],
            mean,
        }
    }
}

impl Shape for Triangle {
    fn intersect(&self, ray: &Ray) -> (f32, Vector3<f32>, Vector3<f32>) {
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

        if c1 && c2 && c3 {
            let new_norm = point - self.position();

            return (dist_to_surface, point, new_norm);
        }
        return (f32::INFINITY, point, point);
    }

    fn position(&self) -> Vector3<f32> {
        // todo!
        return Vector3::zeros();
    }

    fn color(&self) -> Vector3<f32> {
        // todo!
        return Vector3::zeros();
    }

    fn illuminate(&self) -> Vector3<f32> {
        self.material.illuminate()
    }
}

impl Triangle {
    fn new(
        v0: Vector3<f32>,
        v1: Vector3<f32>,
        v2: Vector3<f32>,
        material: Box<dyn Material>,
    ) -> Triangle {
        // let edge1 = v1 - v0;
        // let edge2 = v2 - v0;
        // let normal = edge1.cross(&edge2).normalize();
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
            material,
        };
    }
}
