import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(value: any, filter): any {
    if (!filter || filter.toLowerCase() === 'all') {
      return value;
    }

    // TODO decouple the topic from here
    return value.filter(e => {
      return e.topic === filter;
    })
  }
}