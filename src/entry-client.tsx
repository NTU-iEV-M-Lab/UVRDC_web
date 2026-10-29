import { createRoot, hydrateRoot } from 'react-dom/client';
import {useEffect,useState} from 'react';
import { App } from './App';
import { localPath } from './lib/paths';
import './styles.css';
import './experience.css';
const root=document.getElementById('root')!;
const base=import.meta.env.BASE_URL;
const requestedPath=localPath(window.location.pathname,base);
function ClientApp(){
 const [path,setPath]=useState(root.dataset.renderedPath||requestedPath);
 useEffect(()=>{setPath(requestedPath);},[]);
 return <App base={base} path={path}/>;
}
const app=<ClientApp/>;
if(root.querySelector('main'))hydrateRoot(root,app);else createRoot(root).render(app);
