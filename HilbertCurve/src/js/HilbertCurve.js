import Curve from './Curve';
export default class HilbertCurve extends Curve {
  constructor () {
    super();
  }

  createData (recLevel) {
    this.points = [];
    this.recLevel = recLevel;
    if(recLevel <= 0) return;
    // maxSize is used for rescaling point coordinates to [0,1]
    this.maxSize = (1 << recLevel) - 1;	// 2^recLevel - 1 will be the max coordinate of the data.
    this.createDataRecursive(0, 0, 1 << recLevel, 0, 0);
    return this.points;
  }

  createDataRecursive (x, y, width, i1, i2) {
    if (width === 1) {
      this.points.push([x / this.maxSize, 1 - (y / this.maxSize)]);	// 1-y, because svg's y coordinate grows from top to bottom
    } else {
      width >>= 1;
      this.createDataRecursive(x + i1 * width, y + i1 * width, width, i1, 1 - i2);
      this.createDataRecursive(x + i2 * width, y + (1 - i2) * width, width, i1, i2);
      this.createDataRecursive(x + (1 - i1) * width, y + (1 - i1) * width, width, i1, i2);
      this.createDataRecursive(x + (1 - i2) * width, y + i2 * width, width, 1 - i1, i2);
    }
  }
};
