import {readFile} from 'fs/promises';

export class HomePageService {
    regions = {};

    async load() {
        const cached = await readFile('_cache/home.json')
        const data = JSON.parse(cached.toString());
        this.regions = data.regions;
        return this;
    }

    getRegionItems(name) {
        if (!this.regions[name]) {return [];}
        return this.regions[name].items;
    }
}