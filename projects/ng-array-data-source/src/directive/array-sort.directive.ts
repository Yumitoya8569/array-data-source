import { Directive, Input, HostListener } from '@angular/core';
import { ArrayDataSource } from '../core/array-data-soruce';
import { Utils } from '../core/utils';


export type SortDirection = 'none' | 'asc' | 'desc';

@Directive({
    selector: '[arrSort]',
    exportAs: 'arrSort'
})
export class ArraySortDirective {

    @Input() arrSort!: string;
    @Input() dataSource!: ArrayDataSource<any>;
    @Input() multi = false;
    private isEnter = false;
    private sortDirection: SortDirection = 'none';

    constructor() {
    }

    get sortedAsc() {
        return this.sortDirection === 'asc' && this.dataSource.hasSort(this.arrSort)
    }

    get sortedDesc() {
        return this.sortDirection === 'desc' && this.dataSource.hasSort(this.arrSort)
    }

    get showAscArrow() {
        return this.sortedAsc || (this.isEnter && this.sortDirection === 'none');
    }

    get showDescArrow() {
        return this.sortedDesc;
    }

    @HostListener('mouseenter', ['$event'])
    onHostMouseEnter(event: MouseEvent) {
        this.isEnter = true;
    }

    @HostListener('mouseleave', ['$event'])
    onHostMouseLeave(event: MouseEvent) {
        this.isEnter = false;
    }

    @HostListener('click', ['$event'])
    onHostClick(event: MouseEvent) {
        const newSortType = this.sortedAsc ? 'desc' : this.sortedDesc ? 'none' : 'asc';
        this.sortDirection = newSortType;
        this.isEnter = false;

        this.doSort(this.sortDirection);
    }

    doSort(sortDirection: SortDirection) {
        if (!this.dataSource) { return; }

        if (!this.multi) {
            this.dataSource.clearSort();
        }

        if (sortDirection === 'none') {
            if (this.multi) {
                this.dataSource.deleteSort(this.arrSort);
            }
        } else {
            this.dataSource.setSort(this.arrSort, Utils.sortFunc(this.arrSort, sortDirection));
        }
    }
}
