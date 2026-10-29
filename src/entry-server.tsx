import { renderToString } from 'react-dom/server';
import { App } from './App';
export function render(path:string,base:string){return renderToString(<App path={path} base={base}/>);}
