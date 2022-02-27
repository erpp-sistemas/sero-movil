import { EmpleadoPipe } from './empleado.pipe';

describe('EmpleadoPipe', () => {
  it('create an instance', () => {
    const pipe = new EmpleadoPipe();
    expect(pipe).toBeTruthy();
  });
});
