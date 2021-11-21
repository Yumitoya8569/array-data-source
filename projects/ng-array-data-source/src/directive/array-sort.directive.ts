import { Directive, Input, HostListener } from '@angular/core';
import { ArrayDataSource } from '../core/array-data-soruce';
import { SortDirection, Utils } from '../core/utils';

@Directive({
    selector: '[arrSort]',
    exportAs: 'arrSort'
})
export class ArraySortDirective {

    @Input('arrSort') fieldPath!: string;
    @Input() dataSource!: ArrayDataSource<any>;
    @Input() multi = false;
    private isMouseEnter = false;
    private sortDirection = SortDirection.None;

    constructor() {
    }

    get sortedAsc() {
        return this.sortDirection === SortDirection.Asc && this.dataSource.hasSort(this.fieldPath)
    }

    get sortedDesc() {
        return this.sortDirection === SortDirection.Desc && this.dataSource.hasSort(this.fieldPath)
    }

    get showAscArrow() {
        return this.sortedAsc || (this.isMouseEnter && this.sortDirection === SortDirection.None);
    }

    get showDescArrow() {
        return this.sortedDesc;
    }

    @HostListener('mouseenter', ['$event'])
    onHostMouseEnter(event: MouseEvent) {
        this.isMouseEnter = true;
    }

    @HostListener('mouseleave', ['$event'])
    onHostMouseLeave(event: MouseEvent) {
        this.isMouseEnter = false;
    }

    @HostListener('click', ['$event'])
    onHostClick(event: MouseEvent) {
        this.isMouseEnter = false;
        this.sortDirection = this.sortedAsc ? SortDirection.Desc : this.sortedDesc ? SortDirection.None : SortDirection.Asc;
        this.doSort(this.sortDirection);
    }

    doSort(sortDirection: SortDirection) {
        if (!this.multi) {
            this.dataSource.clearSort();
        }

        if (sortDirection === SortDirection.None) {
            this.dataSource.deleteSort(this.fieldPath);
        } else {
            this.dataSource.setSort(this.fieldPath, Utils.sortFunc(this.fieldPath, sortDirection));
        }
    }
}
