import Curve from './Curve';
export default class PeanoCurve extends Curve {
  createData (recLevel) {
    this.points = [];
    this.recLevel = recLevel;
    if (recLevel <= 0) return;
    // maxSize is used for rescaling point coordinates to [0,1]
    this.maxSize = Math.pow(3, recLevel) - 1; // 3^recLevel - 1 will be the max coordinate of the data.
    this.createDataRecursive(0, 0, Math.pow(3, recLevel), 0, 0);
    return this.points;
  }

  createDataRecursive (x, y, width, i1, i2) {
    if (width === 1) {
      this.points.push([x / this.maxSize, 1 - (y / this.maxSize)]); // 1-y, because svg's y coordinate grows from top to bottom
    } else {
      width /= 3;
      this.createDataRecursive(x + (2 * i1 * width),        y + (2 * i1 * width), width, i1, i2);
      this.createDataRecursive(x + ((i1 - i2 + 1) * width), y + ((i1 + i2) * width), width, i1, 1 - i2);
      this.createDataRecursive(x + width,                   y + width, width, i1, 1 - i2);
      this.createDataRecursive(x + ((i1 + i2) * width),     y + ((i1 - i2 + 1) * width), width, 1 - i1, 1 - i2);
      this.createDataRecursive(x + (2 * i2 * width),        y + (2 * (1 - i2) * width), width, i1, i2);
      this.createDataRecursive(x + ((1 + i2 - i1) * width), y + ((2 - i1 - i2) * width), width, i1, i2);
      this.createDataRecursive(x + (2 * (1 - i1) * width),  y + (2 * (1 - i1) * width), width, i1, i2);
      this.createDataRecursive(x + ((2 - i1 - i2) * width), y + ((1 + i2 - i1) * width), width, 1 - i1, i2);
      this.createDataRecursive(x + (2 * (1 - i2) * width),  y + (2 * i2 * width), width, 1 - i1, i2);
    }
  }
};
