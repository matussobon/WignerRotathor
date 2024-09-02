function calculatePrincipalPoints(lens_index, distance, theta1, theta2) {}

function calculateRparameter(lens_index, distance, theta) {
  let R_parameters = [];

  for (lens_index; lens_index < 3; lens_index++) {
    R_parameters[lens_index] =
      Math.pow(-1, lens_index + 1) *
      (distance[lens_index] / Math.sin(theta[lens_index] / 4)) *
      Math.cos(theta[lens_index] / 4);

    R_parameters[lens_index + 1] =
      (Math.pow(-1, lens_index + 1) * distance[lens_index]) /
      Math.sin(theta[lens_index] / 4);

    R_parameters[lens_index + 2] =
      (Math.pow(-1, lens_index + 1) *
        (distance[lens_index] / Math.sin(theta[lens_index] / 4)) *
        Math.cos((3 * theta[lens_index]) / 4)) /
      Math.cos(theta[lens_index]);
  }
}
