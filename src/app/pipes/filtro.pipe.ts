import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if(arg.length < 3) return value
    const resultBusqueda = [];
    for(const item of value) {
      if(item.cuenta.toLowerCase().indexOf(arg.toLowerCase()) > -1 || item.propietario.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || item.direccion.toLowerCase().indexOf(arg.toLowerCase()) > -1
      ) {
        resultBusqueda.push(item)
      }
    }

    return resultBusqueda;

  }

}
