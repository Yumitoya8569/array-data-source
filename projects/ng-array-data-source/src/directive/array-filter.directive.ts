import { Directive, Input, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ArrayDataSource } from '../core/array-data-soruce';
import { Utils } from '../core/utils';

export const MIN_FILTER_UPDATE_TIME = 300;

@Directive({
    selector: '[arrFilter]',
    exportAs: 'arrFilter'
})
export class ArrayFilterDirective implements OnChanges {
  
    @Input('arrFilter') fieldPaths!: string | string[];
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
                debounceTime(MIN_FILTER_UPDATE_TIME),
            )
            .subscribe(str => {
                this.doFilter(str);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.doFilter(this.elRef.nativeElement.value);
    }

    // for input element
    @HostListener('input', ['$event'])
    onHostInput(event: InputEvent) {
        this.filterChange.next(this.elRef.nativeElement.value)
    }

    // for select element
    @HostListener('change', ['$event'])
    onHostChange(event: Event) {
        this.filterChange.next(this.elRef.nativeElement.value)
    }

    doFilter(filter: string) {
        if (!Array.isArray(this.fieldPaths)) {
            this.fieldPaths = [this.fieldPaths];
        }

        const key = this.fieldPaths.join('+');
        this.dataSource.setFilter(key, Utils.filterFunc(this.fieldPaths, filter, this.fuzzy, this.ignoreCase));
    }
}
