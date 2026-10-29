import { useEffect,useRef } from 'react';

/** Animate only after hydration; the server-rendered element is always readable. */
export function useReveal<T extends HTMLElement>() {
 const ref=useRef<T>(null);
 useEffect(()=>{
  const element=ref.current;
  if(!element||!('IntersectionObserver' in window)||typeof element.animate!=='function')return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let animation:Animation|undefined;
  let played=false;
  const observer=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting)||played||preference.matches)return;
   played=true;observer.disconnect();
   animation=element.animate([
    {transform:'translateY(22px)'},
    {transform:'translateY(0)'},
   ],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
  },{threshold:.08});
  const sync=()=>{
   if(preference.matches){observer.disconnect();animation?.cancel();}
   else if(!played)observer.observe(element);
  };
  sync();preference.addEventListener('change',sync);
  return()=>{observer.disconnect();animation?.cancel();preference.removeEventListener('change',sync);};
 },[]);
 return ref;
}
