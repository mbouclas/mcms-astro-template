import {readFile} from 'fs/promises';
import {spawn, exec, execFile} from 'child_process';

const bootDataCache = await readFile('_cache/boot.json');
const bootData = JSON.parse(bootDataCache.toString());



exec('npm run build', (err, stdout, stderr) => {
    console.log(err, stderr, stdout)
    // ...
  });

// try {
//      await execute(`npm`, []);

// }
// catch (e) {
//     console.log(e)
// }


// function execute(fileName, params, path) {
//     let promise = new Promise((resolve, reject) => {
//         execFile(fileName, params, { cwd: path }, (err, data) => {
//             if (err) reject(err);
//             else resolve(data);
//         });

//     });
//     return promise;
// }