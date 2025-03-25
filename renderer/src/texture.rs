// texture.rs
use image::{GenericImageView, Rgb, RgbImage};
use std::error::Error;

// Load a texture from a file
pub fn load_texture(path: &str) -> Result<RgbImage, Box<dyn Error>> {
    let img = image::open(path)?;
    Ok(img.to_rgb8())
}

// Create a checkerboard texture as a fallback
pub fn create_checkerboard_texture(width: u32, height: u32) -> RgbImage {
    let mut img = RgbImage::new(width, height);
    let checker_size = 32;

    for (x, y, pixel) in img.enumerate_pixels_mut() {
        let checker_x = (x / checker_size) % 2 == 0;
        let checker_y = (y / checker_size) % 2 == 0;

        if checker_x ^ checker_y {
            *pixel = Rgb([255, 234, 113]);
        } else {
            *pixel = Rgb([218, 57, 78]);
        }
    }
    img

}

// Sample a texture at UV coordinates
pub fn sample_texture(texture: &RgbImage, u: f32, v: f32) -> Rgb<u8> {
    // Ensure UV coordinates are in [0,1] range
    let u_clamped = u.max(0.0).min(1.0);
    let v_clamped = v.max(0.0).min(1.0);

    // Convert to pixel coordinates
    let width = texture.width() as f32;
    let height = texture.height() as f32;

    let x = (u_clamped * (width - 1.0)) as u32;
    let y = (v_clamped * (height - 1.0)) as u32;

    // Get pixel color from texture
    *texture.get_pixel(x, y)
}