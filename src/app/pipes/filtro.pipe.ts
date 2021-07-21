import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], text: string): any[] {
    console.log(text)
    if (text === '') {
      return array;
    }
    text = text.toLowerCase();

    return array.filter(item => {
      return item.full.toLowerCase().includes(text);
    })


  }

}
