CREATE OR REPLACE ALGORITHM=MERGE
VIEW `view_publication_list` AS
select
	pub.pub_id as `pub_id`,
    pub.parent_id as `parent_id`,
    pub.original_id as `original_id`,
    pub.is_series as `is_series`,
    PUBGETSERIES(pub.pub_id) as `series_id`,
    GROUP_CONCAT(distinct creator.creator order by creator.idx  SEPARATOR '||') as `creator`,
    GROUP_CONCAT(distinct creator_author.creator order by creator_author.idx  SEPARATOR '||') as `creator_author`,
    GROUP_CONCAT(distinct creator_editor.creator order by creator_editor.idx  SEPARATOR '||') as `creator_editor`,
    GROUP_CONCAT(distinct creator_organization.creator order by creator_organization.idx  SEPARATOR '||') as `creator_organization`,
    GROUP_CONCAT(distinct idno.idno order by idno.idx  SEPARATOR '||') as `idno`,
    GROUP_CONCAT(distinct idno_cobiss.idno order by idno_cobiss.idx  SEPARATOR '||') as `idno_cobiss`,
    GROUP_CONCAT(distinct idno_issn.idno order by idno_issn.idx  SEPARATOR '||') as `idno_issn`,
    GROUP_CONCAT(distinct idno_sistory.idno order by idno_sistory.idx  SEPARATOR '||') as `idno_sistory`,
    GROUP_CONCAT(distinct `year`.`year` order by `year`.idx  SEPARATOR '||') as `year`,
    GROUP_CONCAT(distinct title.title order by title.idx  SEPARATOR '||') as `title`,
    GROUP_CONCAT(distinct publisher.publisher order by publisher.idx  SEPARATOR '||') as `publisher`,
    GROUP_CONCAT(distinct place.place order by place.idx  SEPARATOR '||') as `place`,
    GROUP_CONCAT(distinct addidno.addidno order by addidno.idx  SEPARATOR '||') as `addidno`,
    GROUP_CONCAT(distinct addtitle.addtitle order by addtitle.idx  SEPARATOR '||') as `addtitle`,
    GROUP_CONCAT(distinct volume.volume order by volume.idx  SEPARATOR '||') as `volume`,
    GROUP_CONCAT(distinct issue.issue order by issue.idx  SEPARATOR '||') as `issue`,
    GROUP_CONCAT(distinct `page`.`page` order by `page`.idx  SEPARATOR '||') as `page`,
    GROUP_CONCAT(distinct edition.edition order by edition.idx  SEPARATOR '||') as `edition`,
    GROUP_CONCAT(distinct `source`.`source` order by `source`.idx  SEPARATOR '||') as `source`,
    GROUP_CONCAT(distinct `online`.`online` order by `online`.idx  SEPARATOR '||') as `online`,
    GROUP_CONCAT(distinct strng.strng order by strng.idx  SEPARATOR '||') as `strng`,
    GROUP_CONCAT(distinct note.note order by note.idx  SEPARATOR '||') as `note`,
    GROUP_CONCAT(distinct project_link.proj_id order by project_link.link_id  SEPARATOR '||') as `proj_id`

from publication pub

left join publication_creator creator on creator.pub_id = pub.pub_id
left join publication_creator creator_author on creator_author.pub_id = pub.pub_id and creator_author.code_id = 1 -- codes_pub_creator.value = 'author'
left join publication_creator creator_editor on creator_editor.pub_id = pub.pub_id and creator_editor.code_id = 3 -- codes_pub_creator.value = 'editor'
left join publication_creator creator_organization on creator_organization.pub_id = pub.pub_id and creator_organization.code_id = 5 -- codes_pub_creator.value = 'organization'
left join publication_idno idno on idno.pub_id = pub.pub_id
left join publication_idno idno_cobiss on idno_cobiss.pub_id = pub.pub_id and idno_cobiss.code_id = 1 -- codes_pub_idno.value = 'cobiss'
left join publication_idno idno_issn on idno_issn.pub_id = pub.pub_id and idno_issn.code_id = 3 -- codes_pub_idno.value = 'issn'
left join publication_idno idno_sistory on idno_sistory.pub_id = pub.pub_id and idno_sistory.code_id = 5 -- codes_pub_idno.value = 'sistory'
left join publication_year `year` on `year`.pub_id = pub.pub_id
left join publication_title title on title.pub_id = pub.pub_id
left join publication_publisher publisher on publisher.pub_id = pub.pub_id
left join publication_place place on place.pub_id = pub.pub_id
left join publication_addidno addidno on addidno.pub_id = pub.pub_id
left join publication_addtitle addtitle on addtitle.pub_id = pub.pub_id
left join publication_volume volume on volume.pub_id = pub.pub_id
left join publication_issue issue on issue.pub_id = pub.pub_id
left join publication_page `page` on page.pub_id = pub.pub_id
left join publication_edition edition on edition.pub_id = pub.pub_id
left join publication_source `source` on `source`.pub_id = pub.pub_id
left join publication_online `online` on `online`.pub_id = pub.pub_id
left join publication_strng strng on strng.pub_id = pub.pub_id
left join publication_note note on note.pub_id = pub.pub_id
left join publication_project_link project_link on project_link.pub_id = pub.pub_id

group by pub.pub_id



