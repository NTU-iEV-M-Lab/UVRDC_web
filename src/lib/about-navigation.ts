export const aboutNavigation = [
 {path:'/about/',label:'中心簡介',description:'成立背景、三院合作與中心任務',icon:'overview'},
 {path:'/about/people/',label:'組織人員',description:'中心主任、組織架構與諮詢委員',icon:'people'},
 {path:'/about/facilities/',label:'設備與平台',description:'載具平台、研究基礎與 AVL 設備',icon:'facilities'},
] as const;

const peopleAnchors=new Set(['#director','#organization','#advisory-committee']);
const facilityAnchors=new Set(['#research-foundation','#vehicle-platforms','#equipment-avl']);
export function aboutAnchorTarget(hash:string){
 if(peopleAnchors.has(hash))return '/about/people/'+hash;
 if(facilityAnchors.has(hash))return '/about/facilities/'+hash;
 return undefined;
}
