export default {
  baseNum: 8,
  layout() {
    return {
      margin1: this.baseNum * 16,
      margin2: this.baseNum * 8,
      margin3: this.baseNum * 4,
      margin4: this.baseNum * 2,
      margin5: this.baseNum,
      padding0: this.baseNum * 16,
      padding1: this.baseNum * 8,
      padding2: this.baseNum * 4,
      padding3: this.baseNum * 3,
      padding4: this.baseNum * 2,
      padding5: this.baseNum,
    };
  },
  easingFn: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
  color: {
    white: '#FFFFFF',
    blue1: '#0167BB',
    blue2: '#003672',
  },
  font: {
    family: {
      body: 'Lato',
    },
    weight: {
      regular: 400,
      bold: 700,
      black: 900,
      light: 300,
    },
    size: {
      title: 40,
      subtitle: 32,
      headerBold: 24,
      header: 22,
      body: 18,
      button: 22,
      input: 14,
    },
  },
};
