const _diamondFragmentShader = `uniform float rotateX;
uniform float rotateY;
uniform float rotateZ;

// Function to create a diamond pattern
float diamondPattern(vec2 coord, float size) {
  // Translate the coordinates to the tile center
  coord = fract(coord / size) - 0.5;
  
  // Rotate the coordinates by 45 degrees around the tile center
  float angle = 3.14159265 / 4.0; // 45 degrees in radians
  mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  coord = rotationMatrix * coord;

  // Scale and translate the coordinates back
  coord = coord * sqrt(2.0);

  // Calculate the diamond pattern
  return 1.0 - max(abs(coord.x), abs(coord.y));
}

void main() {
  // Scale down the rotation values
  float scaledRotateX = rotateX * 0.1;
  float scaledRotateY = rotateY * 0.1;
  float scaledRotateZ = rotateZ * 0.1;

  // Generate the rotated diamond pattern
  float pattern = diamondPattern(gl_FragCoord.xy, 120.0);

  // Adjust the color calculations based on the pattern
  float r = clamp(0.25 * cos(scaledRotateX + pattern * 3.14), 0.0, 1.0);
  float g = clamp(0.25 * cos(scaledRotateY + pattern * 3.14), 0.0, 1.0);
  float b = clamp(0.25 * cos(scaledRotateZ + pattern * 3.14), 0.0, 1.0);

  // Set the final color with low opacity
  gl_FragColor = vec4(r, g, b, 0.05);
}`;
