import {useEffect,useRef,useState,type ComponentProps} from 'react';
import {Root} from '@radix-ui/react-navigation-menu';

/** Preserve Radix keyboard routing without an aria-hidden, tabbable focus proxy. */
export function NavigationMenuRoot(props:Omit<ComponentProps<typeof Root>,'value'|'onValueChange'>){
 const [value,setValue]=useState('');
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(!value)return;
  // This empty proxy immediately forwards focus to a real menu link. It must
  // remain tabbable, so it cannot also be hidden from the accessibility tree.
  ref.current?.querySelectorAll('.primary-nav-item > span[aria-hidden="true"][tabindex="0"]').forEach(proxy=>{
   if(!proxy.hasChildNodes())proxy.removeAttribute('aria-hidden');
  });
 },[value]);
 return <Root {...props} ref={ref} value={value} onValueChange={setValue}/>;
}
