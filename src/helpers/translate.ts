import {readFile} from 'fs/promises';

export class Translator {
    static defaultLang: string;
    static translations: {[key: string]: string}[] = [];

    async load() {
        const cached = await readFile('_cache/translations.json')
        const data = JSON.parse(cached.toString());
        Translator.defaultLang = data.defaultLang;
        Translator.translations = data.translations;
        
    }

    static translate(translation: string, obj?: any) {
        return translate(translation, obj);
    }

}

export function translate(translation, obj) {
    const args = Array.prototype.slice.call(arguments,1);

    try {
      if (translation.indexOf('.') != -1){
          //@ts-ignore
        const phrase = Object.byString(Translator.translations, translation);
        args.unshift(phrase);
  
        return (!phrase) ? translation : applyTranslation(phrase, obj);
      }
  
      return (!Translator.translations[translation]) ? translation : applyTranslation(Translator.translations[translation],obj);
    }
    catch (e){
      return translation;
    }
  }
  export function applyTranslation(phrase, data) {
    if (!data) {return phrase;}
  
    return phrase.replace(/{{(.*?)}}/g, (match) => {
      return data[match.split(/{{|}}/).filter(Boolean)[0]]
    })
  }

  //@ts-ignore
  Object.byString = function(o, s) {
  
    s = s.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
    s = s.replace(/^\./, ''); // strip leading dot
    const a = s.split('.');
    while (a.length) {
      let n = a.shift();
      if (n in o) {
        o = o[n];
      } else {
        return;
      }
    }
  
    return o;
  };
  