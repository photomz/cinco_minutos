// eslint-disable-next-line no-unused-vars
import nanoid from 'nanoid/non-secure';

// eslint-disable-next-line no-unused-vars
const recurseNests = obj => {
  if (typeof obj === 'object' && obj !== null) {
    // Is array or object of unknown dimension
    Object.assign(...Object.entries(obj).reduce());
  }
};

const keyIndex = arg => {
  if (typeof arg !== 'object' || arg === null) {
    throw new Error('Argument passed into function is not an object or array.');
  }
};

export default keyIndex;
