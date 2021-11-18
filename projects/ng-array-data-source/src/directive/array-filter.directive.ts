import { Directive, Input, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ArrayDataSource } from '../core/array-data-soruce';
import { Utils } from '../core/utils';

export const FILTER_CHANGE_DUE_TIME = 300;

@Directive({
    selector: '[arrFilter]',
    exportAs: 'arrFilter'
})
export class ArrayFilterDirective implements OnChanges {

    @Input() arrFilter!: string | string[];
    @Input() dataSource!: ArrayDataSource<any>;
    @Input() fuzzy = false;
    @Input() ignoreCase = false;
    private filterChange = new Subject<string>();

    constructor(private elRef: ElementRef<HTMLInputElement | HTMLSelectElement>) {
        this.updateSubscription();
    }

    updateSubscription() {
        this.filterChange
            .pipe(
                distinctUntilChanged(),
                debounceTime(FILTER_CHANGE_DUE_TIME),
            )
            .subscribe(str => {
                this.doFilter(str);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.doFilter(this.elRef.nativeElement.value);
    }

    @HostListener('input', ['$event'])
    onHostInput(event: InputEvent) {
        this.filterChange.next(this.elRef.nativeElement.value)
    }

    // for select
    @HostListener('change', ['$event'])
    onHostChange(event: Event) {
        this.filterChange.next(this.elRef.nativeElement.value)
    }

    doFilter(filterStr: string) {
        if (!this.arrFilter || !this.dataSource) { return; }

        if (!Array.isArray(this.arrFilter)) {
            this.arrFilter = [this.arrFilter];
        }

        const key = this.arrFilter.join('+');
        const func = Utils.filterFunc(this.arrFilter, filterStr, this.fuzzy, this.ignoreCase);
        this.dataSource.setFilter(key, func);
    }
}
