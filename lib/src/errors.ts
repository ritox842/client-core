export class DatoCoreError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function assertString(value, context?) {
  if (typeof value !== 'string') {
    throw new DatoCoreError(`${context} expecting string but got ${typeof value}`);
  }
}
