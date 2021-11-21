export enum SortDirection {
    None,
    Asc,
    Desc
}

// @dynamic
export class Utils {

    static filterFunc(paths: string[], filter: string, isFuzzy: boolean, ignoreCase: boolean) {
        return (item: any) => {
            if (!filter) { return true; }

            let mixedData = this.getMixedData(item, paths);

            if (ignoreCase) {
                filter = filter.toLowerCase();
                mixedData = mixedData.toLowerCase();
            }

            if (isFuzzy) {
                return this.compareFuzzy(mixedData, filter);
            } else {
                return mixedData === filter;
            }
        }
    }

    static sortFunc(path: string, sortDirection: SortDirection) {
        return (a: any, b: any) => {
            const dataA = this.getData(a, path);
            const dataB = this.getData(b, path);

            if (sortDirection === SortDirection.Desc) {
                return this.compareDesc(dataA, dataB);
            } else if (sortDirection === SortDirection.Asc) {
                return this.compareAsc(dataA, dataB);
            } else {
                return 0;
            }
        }
    }

    static compareDesc(a: any, b: any) {
        return a < b ? 1 : a > b ? -1 : 0;
    }

    static compareAsc(a: any, b: any) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    static compareFuzzy(data: string, filter: string) {
        const fuzzyRegxStr = this.escapeRegExp(filter)
            .split(' ')
            .map(s => s.trim())
            .filter(s => !!s)
            .reduce((a, b) => a + `(?=.*${b})`, '') + '';
        const regx = new RegExp(fuzzyRegxStr);
        return regx.test(data)
    }

    static getMixedData(item: any, paths: string[]) {
        return paths.map(path => this.getData(item, path)).join('');
    }

    static getData(item: any, path: string) {
        const pathArr = path.split('.');

        let i = 0;
        let result = item;
        while (result && i < pathArr.length) {
            result = result[pathArr[i++]];
        }
        return result;
    }

    static escapeRegExp(str: string) {
        return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
}