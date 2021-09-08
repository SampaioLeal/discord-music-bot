interface GenericType {
  A: string;
  B: number;
}

const object: GenericType = {
  A: 'foo',
  B: 2,
};

console.log(object);
console.log('Start developing your NodeTS application');
console.log(false ?? 'Test');
console.log(undefined ?? 'Test');
console.log(null ?? 'Test');
console.log(NaN ?? 'Test');
