// @dynamic
export class Utils {

    static filterFunc(paths: string[], filter: string, isFuzzy: boolean, ignoreCase: boolean) {
        return (item: any) => {
            if (!filter) { return true; }

            let result = true;
            let mixedData = paths.map(path => this.get(item, path)).join('');

            if (ignoreCase) {
                filter = filter.toLowerCase();
                mixedData = mixedData.toLowerCase();
            }

            if (isFuzzy) {
                const fuzzyRegxStr = this.escapeRegExp(filter)
                    .split(' ')
                    .map(s => s.trim())
                    .filter(s => !!s)
                    .reduce((a, b) => a + `(?=.*${b})`, '') + '';
                const regx = new RegExp(fuzzyRegxStr);
                if (!regx.test(mixedData)) { result = false; }

            } else {
                if (filter !== mixedData) { result = false; }
            }
            return result;
        }
    }

    static sortFunc(path: string, sortType: 'asc' | 'desc') {
        if (sortType === 'asc') {
            return (a: any, b: any) => this.get(a, path) < this.get(b, path) ? -1 : this.get(a, path) > this.get(b, path) ? 1 : 0;
        } else {
            return (a: any, b: any) => this.get(a, path) < this.get(b, path) ? 1 : this.get(a, path) > this.get(b, path) ? -1 : 0;
        }
    }

    private static get(item: any, path: string): any {
        const pathArr = path.split('.');

        let i = 0;
        let result = item;
        while (result && i < pathArr.length) {
            result = result[pathArr[i++]];
        }
        return result;
    }

    private static escapeRegExp(str: string) {
        return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
}