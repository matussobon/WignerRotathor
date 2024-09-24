import * as THREE from "three";

export function calculatePhi(theta) {
  let sinPhi =
    -Math.sin(theta[0]) /
    Math.sqrt(
      Math.pow(Math.sin(theta[0]), 2) + Math.pow(Math.tan(theta[1]), 2)
    );
  let cosPhi =
    -Math.tan(theta[1]) /
    Math.sqrt(
      Math.pow(Math.sin(theta[0]), 2) + Math.pow(Math.tan(theta[1]), 2)
    );
  return Math.atan2(sinPhi, cosPhi);
}

export function calculateDeltaThree(theta) {
  let sinDelta3 = -Math.sqrt(
    1 - Math.pow(Math.cos(theta[0]), 2) * Math.pow(Math.cos(theta[1]), 2)
  );
  let cosDelta3 = Math.cos(theta[0]) * Math.cos(theta[1]);
  theta[2] = Math.atan2(sinDelta3, cosDelta3); //theta.push caused 4 elements in the array
  return theta;
}

export function calculateFocalLength(lens_index, distance, theta) {
  let focalLengths = [];
  let i;
  let j = 0;
  for (i = 0; i < lens_index; i++) {
    focalLengths[i + j] = distance[i] / 2;
    focalLengths[i + 1 + j] = distance[i] / (4 * Math.cos(theta[i] / 4));
    focalLengths[i + 2 + j] = distance[i] / 2;
    j = j + 2;
  }

  return focalLengths;
}

export function calculatePrincipalPoints(lens_index, distance, theta) {
  let R_parameters = calculateRparameter(lens_index, distance, theta);
  let principalPoints = [];
  let xP,
    yP = 0;

  let p11 = new THREE.Vector3(0, 0, 0).addVectors(
    new THREE.Vector3(xP, yP, 0),
    new THREE.Vector3(0, 1, 0).multiplyScalar(R_parameters[0])
  );

  let p21 = new THREE.Vector3(0, 0, 0).addVectors(
    new THREE.Vector3(xP, yP, 0),
    new THREE.Vector3(1, 0, 0).multiplyScalar(R_parameters[3])
  );

  let p31 = new THREE.Vector3(0, 0, 0).addVectors(
    new THREE.Vector3(xP, yP, 0),
    new THREE.Vector3(1, 0, 0).multiplyScalar(R_parameters[3])
  );

  principalPoints[0] = p11;
  principalPoints[3] = p21;
  principalPoints[6] = p31;

  // I could've done this just by manually calculating the principal points
  // but this probably saved us few lines
  // we need two additional index variables j,k
  // to skip indeces 0,3,6
  let i;
  let j = 1;
  let k;
  for (i = 1; i < 9; i++) {
    if (i % 3 == 0) {
      j++;
    } else {
      k = i - j;
      principalPoints[i] = new THREE.Vector3(0, 0, 0).addVectors(
        new THREE.Vector3(xP, yP, 0),
        new THREE.Vector3(
          0,
          Math.cos(theta[k]) / 4,
          -Math.sin(theta[k] / 4)
        ).multiplyScalar(R_parameters[k])
      );
      j++;
    }
  }

  // console.log(principalPoints);
  return principalPoints;
}
function calculateRparameter(lens_index, distance, theta) {
  let R_parameters = [];
  let i;
  for (i = 0; i < lens_index; i++) {
    R_parameters[i] =
      Math.pow(-1, i + 1) *
      (distance[i] / Math.sin(theta[i] / 4)) *
      Math.cos(theta[i] / 4);

    R_parameters[i + 3] =
      (Math.pow(-1, i + 1) * distance[i]) / Math.sin(theta[i] / 4);

    R_parameters[i + 6] =
      (Math.pow(-1, i + 1) *
        (distance[i] / Math.sin(theta[i] / 4)) *
        Math.cos((3 * theta[i]) / 4)) /
      Math.cos(theta[i]);
  }

  return R_parameters;
}

export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}
