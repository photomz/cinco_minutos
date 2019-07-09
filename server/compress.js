const lzString = require('lz-string');
const fs = require('fs');
const compressJSON = fp => {
  fs.writeFileSync(fp + '.min', lzString.compressToUTF16(JSON.stringify(require(fp))));
};
compressJSON('./static/verbs.json');
compressJSON('./static/quickSearch.json');
compressJSON('./static/popularity.json');
