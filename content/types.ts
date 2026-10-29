export type Section={title:string;paragraphs:string[]};
export type Resource={label:string;url:string};
export type Source={id:string;title:string;version:string;accessedAt:string};
export type AgendaItem={time:string;title:string;description:string};
export type News={
 kind:'event';slug:string;title:string;englishTitle?:string;summary:string;
 publicationState:'published'|'draft';updatedAt:string;sourceIds:string[];editorialNotes?:string;
 category:string;international:boolean;date:string;endDate:string;venue:string;organizers:string;
 format:string;region:string;centerRole:string;topics:string[];featured?:boolean;
 participation:'host'|'co-organizer'|'visitor'|'speaker';recordType?:'program';
 image?:string;gallery:string[];sections:Section[];agenda:AgendaItem[];agendaLabel?:string;resources:Resource[];
};
export type Media={file:string;sourceId:string;caption:string;alt:string;width:number;height:number;kind:'photo'|'figure'|'concept'|'logo'};
export type Director={name:string;englishName:string;role:string;affiliation:string;education:string;background:string;interests:string[];highlight:string;experience:Section[];sourceIds:string[];resources:Resource[]};
export type Facilities={provider:string;description:string;areas:string[];sourceIds:string[]};
export type AdvisoryMember={id:string;name:string;affiliation:string;note?:string;termEnd?:string;sourceIds:string[]};
export type SiteData={
 asOf:string;
 institution:{name:string;shortName:string;englishName:string;intro:string;description:string;foundingYear:number;sourceIds:string[]};
 contact:{email:string|null;phone:string|null;address:string|null;url:string|null};
 director:Director;facilities:Facilities;advisoryMembers:AdvisoryMember[];sources:Source[];events:News[];media:Media[];
 colleges:string[];missions:{title:string;english:string;text:string}[];
 courses:{title:string;text:string;focus:string[];exercise:string}[];collaborations:{title:string;text:string;areas:string[]}[];
};
