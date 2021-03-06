/*********************************************************/
/* POINTS                                               */
/*********************************************************/
/**
 * Generate a point object
 * @param {Number} x position x of the point
 * @param {Number} y position y of the point
 */
function Point(x = 0, y = 0) {
    return { x, y };
}

/**
 * Generate a point object
 * @param {Number} x position x of the point
 * @param {Number} y position y of the point
 */
function Vector2(x = 0, y = 0) {
    return { x, y };
}

/**
 * Distance between to point
 * @param {Number} a first point
 * @param {Number} b second point
 * @return { float }
 */
function distance(a, b) {
    return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
}

function floorPoint(point){
  point.x=Math.floor(point.x);
  point.y=Math.floor(point.y);
  return point;
}

function roundPoint(point){
  point.x=Math.round(point.x);
  point.y=Math.round(point.y);
  return point;
}

function roundFloatPoint(point){
  point.x=roundFloat(point.x);
  point.y=roundFloat(point.y);
  return point;
}

function roundFloat(x, nbDecimal = 10){
  return Math.round(x*Math.pow(10,nbDecimal))/Math.pow(10,nbDecimal);
}

function addFloat(...x){
  let total = 0;
  for(let i =0 ; i < x.length; i++){
    total += x[i] ;
    total = roundFloat(total);
  }
  return  total;
}

/**
 * Calculate extremum points
 */
class MinMaxVector2 {
    constructor() {
        this.minPos = new Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        this.maxPos = new Vector2(0, 0);
    }

    addValue(vec2) {
        if (vec2.x < this.minPos.x) this.minPos.x = vec2.x;
        if (vec2.y < this.minPos.y) this.minPos.y = vec2.y;

        if (vec2.x > this.maxPos.x) this.maxPos.x = vec2.x;
        if (vec2.y > this.maxPos.y) this.maxPos.y = vec2.y;
    }
}

/**
* Convert degrees to radians
*/
function degrees_to_radians(degrees)
{
  let pi = Math.PI;
  return (degrees * pi)/180;
}
/*********************************************************/
/* MATRIXS                                               */
/*********************************************************/

/**
 * Represent a matrix 2x2
 * [ a b ]
 * [ c d ]
 * a = matrix[0][0]
 * b = matrix[0][1]
 * c = matrix[1][0]
 * d = matrix[1][1]
 */
/**
 * Matrix3 create a 3x3 Matrix
 * @param {Number} a row 1 column 1
 * @param {Number} b row 1 column 1
 * @param {Number} c row 1 column 1
 */
function Matrix3(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0, g = 0, h = 0, i = 0) {
    return [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ];
}

const Matrix = {
    scalar(matrix, scalar) {
        let _a = matrix[0][0] * scalar;
        let _b = matrix[0][1] * scalar;
        let _c = matrix[0][2] * scalar;
        let _d = matrix[1][0] * scalar;
        let _e = matrix[1][1] * scalar;
        let _f = matrix[1][2] * scalar;
        let _g = matrix[2][0] * scalar;
        let _h = matrix[2][1] * scalar;
        let _i = matrix[2][2] * scalar;
        return Matrix3(_a, _b, _c, _d, _e, _f, _g, _h, _i);
    },
    mult(a, b, ...other) {
        let _a = parseFloat((a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0]).toFixed(5));
        let _b = parseFloat((a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1]).toFixed(5));
        let _c = parseFloat((a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]).toFixed(5));
        let _d = parseFloat((a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0]).toFixed(5));
        let _e = parseFloat((a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1]).toFixed(5));
        let _f = parseFloat((a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]).toFixed(5));
        let _g = parseFloat((a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0]).toFixed(5));
        let _h = parseFloat((a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1]).toFixed(5));
        let _i = parseFloat((a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]).toFixed(5));
        let matrix3 = Matrix3(_a, _b, _c, _d, _e, _f, _g, _h, _i);
        if (other.length == 0) return matrix3;
        return Matrix.mult(matrix3, ...other);
    },
    copy(matrixReference, matrixPaste) {
        matrixPaste[0][0] = matrixReference[0][0];
        matrixPaste[0][1] = matrixReference[0][1];
        matrixPaste[0][2] = matrixReference[0][2];
        matrixPaste[1][0] = matrixReference[1][0];
        matrixPaste[1][1] = matrixReference[1][1];
        matrixPaste[1][2] = matrixReference[1][2];
        matrixPaste[2][0] = matrixReference[2][0];
        matrixPaste[2][1] = matrixReference[2][1];
        matrixPaste[2][2] = matrixReference[2][2];
    },
    invert(M) {
        if (M.length !== M[0].length) { return; }

        let i = 0,
            ii = 0,
            j = 0,
            dim = M.length,
            e = 0,
            t = 0;
        let I = [],
            C = [];
        for (i = 0; i < dim; i += 1) {

            I[I.length] = [];
            C[C.length] = [];
            for (j = 0; j < dim; j += 1) {
                if (i == j) { I[i][j] = 1; } else { I[i][j] = 0; }
                C[i][j] = M[i][j];
            }
        }

        for (i = 0; i < dim; i += 1) {
            e = C[i][i];

            if (e == 0) {
                for (ii = i + 1; ii < dim; ii += 1) {
                    if (C[ii][i] != 0) {
                        for (j = 0; j < dim; j++) {
                            e = C[i][j]; //temp store i'th row
                            C[i][j] = C[ii][j]; //replace i'th row by ii'th
                            C[ii][j] = e; //repace ii'th by temp
                            e = I[i][j]; //temp store i'th row
                            I[i][j] = I[ii][j]; //replace i'th row by ii'th
                            I[ii][j] = e; //repace ii'th by temp
                        }
                        break;
                    }
                }
                e = C[i][i];
                if (e == 0) { return }
            }

            for (j = 0; j < dim; j++) {
                C[i][j] = C[i][j] / e; //apply to original matrix
                I[i][j] = I[i][j] / e; //apply to identity
            }

            for (ii = 0; ii < dim; ii++) {
                if (ii == i) { continue; }
                e = C[ii][i];
                for (j = 0; j < dim; j++) {
                    C[ii][j] -= e * C[i][j]; //apply to original matrix
                    I[ii][j] -= e * I[i][j]; //apply to identity
                }
            }
        }
        for(let i; i < I.length; i++){
          for(let j; j < I.length; j++){
            I[i][j] = (I[i][j]);
          }
        }
        return I;
    }
}

function matrixRotation(angle) {
    return Matrix3(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
}

function matrixScale(scale) {
    return Matrix3(scale, 0, 0, 0, scale, 0, 0, 0, 1);
}

function matrixTranslate(vec2) {
    return Matrix3(1, 0, vec2.x, 0, 1, vec2.y, 0, 0, 1);
}

/*********************************************************/
/* TRANSFORMATIONS                                       */
/*********************************************************/

/**
 * Linear transformation
 * take a Vector2 and a Matrix2
 * return a new Vector2
 */
function linearTransformationPoint(point, matrix3) {
  return Point(point.x * matrix3[0][0] + point.y * matrix3[0][1] + matrix3[0][2], point.x * matrix3[1][0] + point.y * matrix3[1][1] + matrix3[1][2]);
  //return Point(roundFloat(point.x * matrix3[0][0] + point.y * matrix3[0][1] + matrix3[0][2]), roundFloat(point.x * matrix3[1][0] + point.y * matrix3[1][1] + matrix3[1][2]));
}
