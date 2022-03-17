import {arrayPaginator} from '../helpers/paginate-array';
import {readFile} from 'fs/promises';
import {PageService} from './page.service';

export class TagService {
    tags = [];
    pages = [];

    async load() {
        this.pages = await (new PageService).load();
        this.getTags();
        const t = this.tags.find(tag => tag.slug  === 'resultmed')
        return this;
    }

    getTags() {
        this.tags = this.pages
        .filter(page => Array.isArray(page.tagged) && page.tagged.length > 0)
        .map(page => {
            return page.tagged.map(tag => {
                return {
                    name: tag.tag_name,
                    slug: tag.tag_slug,
                    id: tag.id
                }
            });
        }).flat();
    }

    assignPagesToTags() {
        return this.tags.map(tag => {
            // sort items here
            //@ts-ignore
            const items = this.findPagesByTagId(tag.slug);
            
            return {...tag, items}
        });
        
    }

    findPagesByTagId(slug: string) {
        const found = [];
        this.pages.forEach(page => {
            const foundIndex = page.tagged.findIndex(tag => slug === tag.tag_slug);
            
            if (foundIndex !== -1) {
                found.push({...page, currentTag: page.tagged[foundIndex]})
            }
        })

        return found;
    }

    createPathsFromPaginator(perPage = 10) {
        let all = [];
        // Add the items inside the categories
        const pages = this.assignPagesToTags();

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