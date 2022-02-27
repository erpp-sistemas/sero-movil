import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empleado'
})
export class EmpleadoPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if(arg.length < 3) return value
    const resultBusqueda = [];
    for(const item of value) {
      if(item.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1 || item.apellido_paterno.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultBusqueda.push(item)
      }
    }

    return resultBusqueda;

  }

}
