DROP VIEW view_publication_list;
CREATE ALGORITHM=MERGE
VIEW `view_publication_list` AS
SELECT
    `publication`.`pub_id` AS `pub_id`,
    `publication`.`parent_id` AS `parent_id`,
    `publication`.`original_id` AS `original_id`,
    `publication`.`is_series` AS `is_series`,
    `pubGetSeries`(`publication`.`pub_id`) AS `series_id`,
    (select group_concat(`publication_creator`.`creator` separator '||')
      from `publication_creator`
      where (`publication_creator`.`pub_id` = `publication`.`pub_id`)
      order by `publication_creator`.`idx`) AS `creator`,
    (select group_concat(`publication_creator`.`creator` separator '||')
      from (`publication_creator`
      join `codes_pub_creator` on((`codes_pub_creator`.`code_id` = `publication_creator`.`code_id`)))
       where ((`publication_creator`.`pub_id` = `publication`.`pub_id`)
       and (`codes_pub_creator`.`value` = 'author'))
       order by `publication_creator`.`idx`) AS `creator_author`,
    (select group_concat(`publication_creator`.`creator` separator '||')
      from (`publication_creator`
      join `codes_pub_creator` on((`codes_pub_creator`.`code_id` = `publication_creator`.`code_id`)))
      where ((`publication_creator`.`pub_id` = `publication`.`pub_id`)
      and (`codes_pub_creator`.`value` = 'editor'))
      order by `publication_creator`.`idx`) AS `creator_editor`,
    (select group_concat(`publication_creator`.`creator` separator '||')
      from (`publication_creator`
      join `codes_pub_creator` on((`codes_pub_creator`.`code_id` = `publication_creator`.`code_id`)))
      where ((`publication_creator`.`pub_id` = `publication`.`pub_id`)
      and (`codes_pub_creator`.`value` = 'organization'))
      order by `publication_creator`.`idx`) AS `creator_organization`,
    (select group_concat(`publication_idno`.`idno` separator '||')
      from `publication_idno`
      where (`publication_idno`.`pub_id` = `publication`.`pub_id`)
      order by `publication_idno`.`idx`) AS `idno`,
    (select group_concat(`publication_idno`.`idno` separator '||')
      from (`publication_idno` join `codes_pub_idno` on((`codes_pub_idno`.`code_id` = `publication_idno`.`code_id`)))
      where ((`publication_idno`.`pub_id` = `publication`.`pub_id`)
      and (`codes_pub_idno`.`value` = 'cobiss'))
      order by `publication_idno`.`idx`) AS `idno_cobiss`,
    (select group_concat(`publication_idno`.`idno` separator '||')
      from (`publication_idno` join `codes_pub_idno` on((`codes_pub_idno`.`code_id` = `publication_idno`.`code_id`)))
      where ((`publication_idno`.`pub_id` = `publication`.`pub_id`)
      and (`codes_pub_idno`.`value` = 'issn'))
      order by `publication_idno`.`idx`) AS `idno_issn`,
    (select group_concat(`publication_idno`.`idno` separator '||')
      from (`publication_idno`
      join `codes_pub_idno` on((`codes_pub_idno`.`code_id` = `publication_idno`.`code_id`)))
      where ((`publication_idno`.`pub_id` = `publication`.`pub_id`)
      and (`codes_pub_idno`.`value` = 'sistory'))
      order by `publication_idno`.`idx`) AS `idno_sistory`,
    (select group_concat(`publication_year`.`year` separator '||')
      from `publication_year`
      where (`publication_year`.`pub_id` = `publication`.`pub_id`) order by `publication_year`.`idx`) AS `year`,
    (select group_concat(`publication_title`.`title` separator '||')
      from `publication_title`
      where (`publication_title`.`pub_id` = `publication`.`pub_id`)
      order by `publication_title`.`idx`) AS `title`,
    (select group_concat(`publication_publisher`.`publisher` separator '||')
      from `publication_publisher`
      where (`publication_publisher`.`pub_id` = `publication`.`pub_id`)
      order by `publication_publisher`.`idx`) AS `publisher`,
    (select group_concat(`publication_place`.`place` separator '||')
      from `publication_place`
      where (`publication_place`.`pub_id` = `publication`.`pub_id`)
      order by `publication_place`.`idx`) AS `place`,
    (select group_concat(`publication_addidno`.`addidno` separator '||') from `publication_addidno` where (`publication_addidno`.`pub_id` = `publication`.`pub_id`) order by `publication_addidno`.`idx`) AS `addidno`,(select group_concat(`publication_addtitle`.`addtitle` separator '||') from `publication_addtitle` where (`publication_addtitle`.`pub_id` = `publication`.`pub_id`) order by `publication_addtitle`.`idx`) AS `addtitle`,(select group_concat(`publication_volume`.`volume` separator '||') from `publication_volume` where (`publication_volume`.`pub_id` = `publication`.`pub_id`) order by `publication_volume`.`idx`) AS `volume`,(select group_concat(`publication_issue`.`issue` separator '||') from `publication_issue` where (`publication_issue`.`pub_id` = `publication`.`pub_id`) order by `publication_issue`.`idx`) AS `issue`,(select group_concat(`publication_page`.`page` separator '||') from `publication_page` where (`publication_page`.`pub_id` = `publication`.`pub_id`) order by `publication_page`.`idx`) AS `page`,(select group_concat(`publication_edition`.`edition` separator '||') from `publication_edition` where (`publication_edition`.`pub_id` = `publication`.`pub_id`) order by `publication_edition`.`idx`) AS `edition`,(select group_concat(`publication_source`.`source` separator '||') from `publication_source` where (`publication_source`.`pub_id` = `publication`.`pub_id`) order by `publication_source`.`idx`) AS `source`,(select group_concat(`publication_online`.`online` separator '||') from `publication_online` where (`publication_online`.`pub_id` = `publication`.`pub_id`) order by `publication_online`.`idx`) AS `online`,(select group_concat(`publication_strng`.`strng` separator '||') from `publication_strng` where (`publication_strng`.`pub_id` = `publication`.`pub_id`) order by `publication_strng`.`idx`) AS `strng`,(select group_concat(`publication_note`.`note` separator '||') from `publication_note` where (`publication_note`.`pub_id` = `publication`.`pub_id`) order by `publication_note`.`idx`) AS `note`,(select group_concat(`publication_project_link`.`proj_id` separator '||') from `publication_project_link` where (`publication_project_link`.`pub_id` = `publication`.`pub_id`) order by `publication_project_link`.`link_id`) AS `proj_id` from `publication`