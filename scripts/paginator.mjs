import * as paginator from 'paginate-array';
import {readFile} from 'fs/promises';
const paginate = paginator.default;
const categoriesJson = await readFile('_cache/categories.json');
const pagesJson = await readFile('_cache/pages.json');
const pages = JSON.parse(pagesJson.toString());
const categories = JSON.parse(categoriesJson.toString());


class CategoriesService {
    categories = [];
    tree = [];
    pages = [];

    constructor(pages, categories) {
        this.pages = pages;
        this.categories = categories.flat;
        this.tree = categories.tree;
    }

    assignPagesToCategories() {
        return this.categories.map(category => {
            const items = this.findPagesByCategoryId(category.id);

            return {...category, items}
        })
    }

    findPagesByCategoryId(id) {
        const found = [];
        this.pages.forEach(page => {
            const foundIndex = page.categories.findIndex(cat => id === cat.id);
            if (foundIndex !== -1) {
                found.push({...page, currentCategory: page.categories[foundIndex]})
            }
        })
    
        return found;
    }

    createPathsFromPaginator(perPage = 10) {
        let all = [];
        // Add the items inside the categories
        const pages = this.assignPagesToCategories();
        let i = 0;
        // loop through the pages, paginate the items and assign them to all
        pages.forEach(page => {
            const init = paginate(page.items, 1, perPage);
            //now we have a total pages, which means we can loop and create the array of paginated categories
            for (let idx = 0; init.totalPages > idx; idx++) {
                // console.log(i, '---', page.slug, idx+1)
                const paginated = paginate(page.items, idx+1, perPage);
                all = all.concat({...page, ...{items: paginated}});
                i++;
            }
        });

        return all;
    }
}


const service = new CategoriesService(pages, categories);
const p = service.createPathsFromPaginator();
console.log(p[64].items.data.length, p[65].items.data.length)
