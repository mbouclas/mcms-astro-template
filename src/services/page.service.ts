import {readFile} from 'fs/promises';

export class PageService {
    pages = [];
    constructor() {

    }

    async load(): Promise<any[]> {
        const cached = await readFile('_cache/pages.json')
        this.pages = JSON.parse(cached.toString());

        return this.pages;
    }
    
}