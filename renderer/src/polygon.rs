use crate::helper::{find_centroid, order_coordinates};
use crate::material::Material;
use crate::ray::Ray;
use crate::shape::Shape;
use crate::triangle::Triangle;
use nalgebra::Vector3;
use crate::ID;

pub struct Polygon {
    vertices: [Vector3<f32>; 4],
    normal: Vector3<f32>,
    triangles: [Triangle; 2],
    mean: Vector3<f32>,
    ambient: Vector3<f32>,
    specular: Vector3<f32>,
    pub(crate) material: Box<dyn Material>,
    id: u32,
}

impl Shape for Polygon {
    fn id(&self) -> u32 {
        self.id
    }
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

    fn material(&self) -> Box<dyn Material> {
        self.material.clone()
    }

    fn position(&self) -> Vector3<f32> {
        self.mean
    }

    fn ambient_color(&self) -> Vector3<f32> {
        self.ambient.clone()
    }

    fn specular_color(&self) -> Vector3<f32> {
        self.specular
    }
}

impl Polygon {
    pub(crate) unsafe fn new(
        vertices: [Vector3<f32>; 4],
        material_ref: Box<dyn Material>,
        ambient: Vector3<f32>,
        specular: Vector3<f32>,
    ) -> Polygon {
        let material = material_ref;
        let mean = find_centroid(vertices);
        let verts = order_coordinates(vertices, mean);
        let triangle_1 = Triangle::new(verts[0], verts[1], verts[2], (*material).clone());
        let triangle_2 = Triangle::new(verts[1], verts[3], verts[2], material.clone());
        let id = ID;
        ID +=1;
        Polygon {
            vertices: verts,
            normal: Vector3::zeros(),
            triangles: [triangle_1, triangle_2],
            mean,
            ambient,
            specular,
            material: material.clone(),
            id,
        }
    }
}
