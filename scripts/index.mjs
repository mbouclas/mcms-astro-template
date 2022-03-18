import { polyfill } from '@astropub/webapi';
import { loadEnv } from 'vite';
import fs from 'fs';
import {writeFile} from 'fs/promises';
import chalk from 'chalk';
import minimist from 'minimist';
import inquirer from 'inquirer';
const argv = minimist(process.argv.slice(2));





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
      successMessage("Boot data cached successfully");

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
  
  successMessage('Homepage data cached successfully');
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

  successMessage(`Categories cached successfully`);

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

  successMessage(`Pages cached successfully`);
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

  successMessage(`Tags cached successfully`);
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

function successMessage(msg) {
  console.log(chalk.greenBright.bold(msg))
}

async function executeCommand(command) {
  switch (command) {
    case 'Boot': await cacheBootData();
    break;
    case 'Homepage': await cacheHomePage();
    break;
    case 'Categories': await cacheCategories();
    break;
    case 'Pages': await cachePages();
    break;
  }
}

const answers = await inquirer.prompt([{ type: 'checkbox', 
name: 'commands', 
message: 'What to Sync', 
choices: ['All', 'Boot', 'Homepage', 'Categories', 'Pages']
}]);


if (answers.commands.indexOf('All') !== -1) {
  await cacheBootData();
  await cachePages();
  await cacheCategories();
  await cacheHomePage();
  console.log(chalk.bgGreen.blackBright('All Done'));
  process.exit();
}


for (let idx = 0; answers.commands.length > idx; idx++) {
  await executeCommand(answers.commands[idx]);
}
console.log(chalk.bgGreen.blackBright('All Done'))