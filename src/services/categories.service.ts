import {readFile} from 'fs/promises';
import {PageService} from './page.service';
import {arrayPaginator} from '../helpers/paginate-array';


export class CategoriesService {
    categories = [];
    tree = [];
    pages = [];

    async load() {
        const cached = await readFile('_cache/categories.json')
        const data = JSON.parse(cached.toString());
        this.categories = data.flat;
        this.tree = data.tree;
        this.pages = await (new PageService).load();
        return this;
    }

    async pathsByCategory() {
        let all = [];
        this.categories.forEach(category => {
            all = all.concat(this.findPagesByCategoryId(category.id));
        });

        return all;
        
    }

    findPagesByCategoryId(id: number) {
        const found = [];
        this.pages.forEach(page => {
            const foundIndex = page.categories.findIndex(cat => id === cat.id);
            if (foundIndex !== -1) {
                found.push({...page, currentCategory: page.categories[foundIndex]})
            }
        })

        return found;
    }

    assignPagesToCategories() {
        return this.categories.map(category => {

            // sort items here
            //@ts-ignore
            const items = this.findPagesByCategoryId(category.id).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            return {...category, items}
        })
    }

    createPathsFromPaginator(perPage = 10) {
        let all = [];
        // Add the items inside the categories
        const pages = this.assignPagesToCategories();
        let i = 0;

        // loop through the pages, paginate the items and assign them to all
        pages.forEach(page => {
            const init = arrayPaginator(page.items, 1, perPage);
            
            //now we have a total pages, which means we can loop and create the array of paginated categories
            for (let idx = 0; init.totalPages > idx; idx++) {
                // console.log(i, '---', page.slug, idx+1)
                const paginated = arrayPaginator(page.items, idx+1, perPage);
                all = all.concat({...page, ...{items: paginated, page: idx+1}});
                i++;
            }
        });

        return all;
    }
}