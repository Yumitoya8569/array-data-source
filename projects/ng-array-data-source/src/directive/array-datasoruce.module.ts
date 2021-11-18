import { NgModule } from '@angular/core';
import { ArrayFilterDirective } from './array-filter.directive';
import { ArraySortDirective } from './array-sort.directive';

@NgModule({
  declarations: [
    ArrayFilterDirective,
    ArraySortDirective
  ],
  exports: [
    ArrayFilterDirective,
    ArraySortDirective
  ]
})
export class ArrayDataSourceModule {}
 