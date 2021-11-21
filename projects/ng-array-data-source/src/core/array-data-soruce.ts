import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export type FilterMap<T> = Map<string, (item: T) => boolean>;
export type SortMap<T> = Map<string, (a: T, b: T) => number>;


export class ArrayDataSource<T> {
    private _edit = false;
    private _pageCount = 1;

    private _dataSource: BehaviorSubject<T[]>;
    get dataSource() {
        return this._dataSource.value;
    }
    set dataSource(value) {
        this._dataSource.next(value);
    }

    private _renderData: BehaviorSubject<T[]>;
    private get renderData() {
        return this._renderData.value;
    }
    private set renderData(value) {
        this._renderData.next(value);
    }

    private _filter: BehaviorSubject<FilterMap<T>>;
    private get filter() {
        return this._filter.value;
    }
    private set filter(value) {
        this._filter.next(value);
    }

    private _sort: BehaviorSubject<SortMap<T>>;
    private get sort() {
        return this._sort.value;
    }
    private set sort(value) {
        this._sort.next(value);
    }

    private _pageIndex: BehaviorSubject<number>;
    get pageIndex() {
        return this._pageIndex.value;
    }
    set pageIndex(value) {
        value = Math.max(Math.round(value), 0);
        this._pageIndex.next(value);
    }

    private _pageSize: BehaviorSubject<number>;
    get pageSize() {
        return this._pageSize.value;
    }
    set pageSize(value) {
        value = Math.max(Math.round(value), 0);
        this._pageSize.next(value);
    }

    get pageCount() {
        return this._pageCount;
    }

    constructor(dataSource: T[]) {
        this._dataSource = new BehaviorSubject<T[]>(dataSource);
        this._renderData = new BehaviorSubject<T[]>([]);
        this._filter = new BehaviorSubject<FilterMap<T>>(new Map());
        this._sort = new BehaviorSubject<SortMap<T>>(new Map());
        this._pageSize = new BehaviorSubject<number>(0);
        this._pageIndex = new BehaviorSubject<number>(0);
        this.updateSubscription();
    }

    private updateSubscription() {

        const filteredData = combineLatest([this._dataSource, this._filter])
            .pipe(
                filter(() => !this._edit),
                map(([a, b]) => this.getFilteredData(a, b))
            );

        const sortedData = combineLatest([filteredData, this._sort])
            .pipe(
                filter(() => !this._edit),
                map(([a, b]) => this.getSortedData(a, b))
            );

        combineLatest([sortedData, this._pageSize, this._pageIndex])
            .pipe(
                filter(() => !this._edit),
                tap(([a, b]) => this.countPage(a, b)),
                tap(([, , c]) => this.adjustPageIndex(c)),
                map(([a, b, c]) => this.getPageData(a, b, c))
            )
            .subscribe((data) => this.renderData = data);
    }

    private getFilteredData(data: T[], filterMap: FilterMap<T>) {
        if (filterMap.size > 0) {
            return data.filter((d) => this.doFilter(d, filterMap));
        } else {
            return data.slice();
        }
    }

    private doFilter(data: T, filterMap: FilterMap<T>): boolean {
        let result = true;
        for (const [key, filter] of filterMap) {
            result = result && filter(data);
            if (!result) { break; }
        }
        return result;
    }

    private getSortedData(data: T[], sortMap: SortMap<T>) {
        data = data.slice();

        if (sortMap.size > 0) {
            data.sort((a, b) => this.doSort(a, b, sortMap));
        }
        return data
    }

    private doSort(a: T, b: T, sortMap: SortMap<T>) {
        let result = 0;
        for (const [key, sort] of sortMap) {
            result = sort(a, b);
            if (result !== 0) { break; }
        }
        return result;
    }

    private countPage(data: T[], size: number) {
        this._pageCount = size > 0 ? Math.ceil(data.length / this.pageSize) : 1;
    }

    private adjustPageIndex(index: number) {
        this._edit = true;
        const newIndex = index < this._pageCount ? index : this._pageCount - 1;
        if (this.pageIndex != newIndex) {
            this.pageIndex = Math.max(newIndex, 0);
        }
        this._edit = false;
    }

    private getPageData(data: T[], size: number, index: number) {
        size = size > 0 ? size : data.length;
        index = index < this._pageCount ? index : this._pageCount - 1;
        const startPos = index * size;
        const endPos = Math.min((index + 1) * size, data.length);

        return data.slice(startPos, endPos);
    }

    connect() {
        return this._renderData;
    }

    disconnect() {
    }

    getRenderItems() {
        return this.renderData;
    }

    getRenderItem(index: number) {
        return this.renderData[index];
    }

    hasFilter(key: string) {
        return this.filter.has(key);
    }

    setFilter(key: string, filterFunc: (item: T) => boolean) {
        this.filter.set(key, filterFunc);
        this.filter = this.filter;
    }

    deleteFilter(key: string) {
        this.filter.delete(key);
        this.filter = this.filter;
    }

    clearFilter() {
        this.filter.clear();
        this.filter = this.filter;
    }

    hasSort(key: string) {
        return this.sort.has(key);
    }

    setSort(key: string, sortFunc: (a: T, b: T) => number) {
        this.sort.set(key, sortFunc);
        this.sort = this.sort;
    }

    deleteSort(key: string) {
        this.sort.delete(key);
        this.sort = this.sort;
    }

    clearSort() {
        this.sort.clear();
        this.sort = this.sort;
    }

    startEdit() {
        this._edit = true;
    }

    endEdit() {
        this._edit = false;
        this.dataSource = this.dataSource;
    }
}
