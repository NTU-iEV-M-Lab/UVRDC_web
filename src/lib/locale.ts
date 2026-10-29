import type {Locale} from '../../content/localization';
export function localeFromPath(path:string):Locale{return path==='/en'||path.startsWith('/en/')?'en':'zh-Hant';}
export function contentPath(path:string){return localeFromPath(path)==='en'?(path.slice(3)||'/'):path;}
export function languagePath(path:string,locale:Locale){const local=contentPath(path);return locale==='en'?'/en'+(local.startsWith('/')?local:'/'+local):local;}
