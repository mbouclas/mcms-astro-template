import {readFile} from 'fs/promises';

export class Data {
    static bootData;
    static lang = 'en';
    static locales = [];
    static menus = [];

    static async boot() {
        const bootDataCache = await readFile('_cache/boot.json');
        this.bootData = JSON.parse(bootDataCache.toString());
        this.lang = this.bootData.defaultLang;
        this.locales = Object.keys(this.bootData.locales).map(key => this.bootData.locales[key]);

        this.menus = this.bootData.menus;
    }
}