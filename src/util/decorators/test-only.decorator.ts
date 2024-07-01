import 'reflect-metadata';

export function TestOnly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (process.env.NODE_ENV === 'production') {
      return originalMethod.apply(this, args);
    } else {
      return null;
    }
  };
}
