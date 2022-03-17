import { polyfill } from '@astropub/webapi';
import { loadEnv } from 'vite';
import fs from 'fs';
import {writeFile} from 'fs/promises';


polyfill(globalThis, {
  exclude: 'window document',
});

const { API_BASE_URL,ASTRO_KEY } = loadEnv('production', process.cwd(), '');

if (!fs.existsSync('_cache')) {
  fs.mkdirSync('_cache');
}


const cacheBootData = async () => {
    const response = await fetch(
        `${API_BASE_URL}boot`,
        {
          method: 'GET',
          headers: {
              'X-ASTRO-KEY': ASTRO_KEY
          }
        }
      );


      const bootData = await response.json();
      try {
        await writeFile('_cache/boot.json', JSON.stringify(bootData));
      }
      catch(e) {console.log('could not write boot file', e);}

      try {
        await writeFile('_cache/translations.json', JSON.stringify({...{defaultLang: bootData.defaultLang}, ...{translations: bootData.translations}}));
      }
      catch(e) {console.log('could not write boot file', e);}
      
      console.log(`>>> Boot data cached successfully`);
};

const cacheHomePage = async () => {
  const response = await fetch(
    `${API_BASE_URL}home`,
    {
      method: 'GET',
      headers: {
          'X-ASTRO-KEY': ASTRO_KEY
      }
    }
  );

  const data = await response.json();
  try {
    await writeFile('_cache/home.json', JSON.stringify(data));
  }
    catch(e) {console.log('could not write home file', e);
  }
  
  console.log(`>>> Homepage data cached successfully`);
}

const cacheCategories = async () => {
  const response = await fetch(
    `${API_BASE_URL}categories`,
    {
      method: 'GET',
      headers: {
          'X-ASTRO-KEY': ASTRO_KEY
      }
    }
  );

  const data = await response.json();

  try {
    await writeFile('_cache/categories.json', JSON.stringify(data));
  }
    catch(e) {console.log('could not write categories file', e);
  }

  console.log(`>>> Categories cached successfully`);

}

const cachePages = async () => {
  // Need to paginate requests so we won't overwhelm the server

  let data = [];
  let totalPages;
  let total;
  // perform an initial request to get the 1st page and the total number of pages
  const initial = await fetchPages();
  data = data.concat(initial.data);
  totalPages = initial.last_page;
  total = initial.total;

  for (let currentPage = 2; totalPages > currentPage; currentPage++) {
    const res = await fetchPages(currentPage);
    // console.log(`* Page ${currentPage} fetched`);
    data = data.concat(res.data);
  }

  try {
    await writeFile('_cache/pages.json', JSON.stringify(data));
  }
  catch(e) {console.log('could not write pages file', e);}

  console.log(`>>> Pages cached successfully`);
}

const cacheTags = async () => {
  const response = await fetch(
    `${API_BASE_URL}tags`,
    {
      method: 'GET',
      headers: {
          'X-ASTRO-KEY': ASTRO_KEY
      }
    }
  );

  const data = await response.json();

  try {
    await writeFile('_cache/tags.json', JSON.stringify(data));
  }
    catch(e) {console.log('could not write tags file', e);
  }

  console.log(`>>> Tags cached successfully`);
}

async function fetchPages(page=1) {
  const limit = 300;
  const response = await fetch(
    `${API_BASE_URL}pages?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
          'X-ASTRO-KEY': ASTRO_KEY
      }
    }
  );

  return await response.json();
}

await cacheBootData();
await cachePages();
await cacheCategories();
await cacheHomePage();
// await cacheTags();