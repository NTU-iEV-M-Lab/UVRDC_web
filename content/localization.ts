import type {News,SiteData,Media,AdvisoryMember} from './types';
export type EventTranslation=Pick<News,'title'|'summary'|'venue'|'organizers'|'format'|'region'|'centerRole'|'topics'|'sections'> & {
 agenda:Array<{title:string;description:string}>;
 agendaLabel?:string;
 resourceLabels:string[];
};
export type CenterTranslation={
 institution:Pick<SiteData['institution'],'name'|'shortName'|'intro'|'description'>;
 director:Omit<SiteData['director'],'sourceIds'|'resources'> & {resourceLabels:string[]};
 facilities:Omit<SiteData['facilities'],'sourceIds'>;
 advisoryMembers:Record<string,Pick<AdvisoryMember,'name'|'affiliation'|'note'>>;
 colleges:string[];
 missions:SiteData['missions'];
 courses:SiteData['courses'];
 collaborations:SiteData['collaborations'];
 media:Record<string,Pick<Media,'alt'|'caption'>>;
};
export type Locale='zh-Hant'|'en';
export type PublicContent={zh:SiteData;en:SiteData};
