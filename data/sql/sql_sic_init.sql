SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `sic` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `sic`;

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
`proj_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `project_line`;
CREATE TABLE `project_line` (
`line_id` int(11) NOT NULL,
  `idx` int(11) NOT NULL,
  `proj_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `cobiss` varchar(64) NOT NULL,
  `issn` varchar(16) NOT NULL,
  `pub_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `publication`;
CREATE TABLE `publication` (
`pub_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `cobiss` varchar(64) NOT NULL,
  `issn` varchar(16) NOT NULL,
  `original_id` int(11) NOT NULL,
  `is_temp` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `publication_author`;
CREATE TABLE `publication_author` (
  `pub_id` int(11) NOT NULL,
  `idx` int(11) NOT NULL,
  `author` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `publication_project_link`;
CREATE TABLE `publication_project_link` (
`link_id` int(11) NOT NULL,
  `pub_id` int(11) NOT NULL,
  `proj_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `publication_title`;
CREATE TABLE `publication_title` (
  `pub_id` int(11) NOT NULL,
  `idx` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` char(32) NOT NULL DEFAULT '',
  `name` char(32) NOT NULL DEFAULT '',
  `modified` int(11) DEFAULT NULL,
  `lifetime` int(11) DEFAULT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
`id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `email` varchar(128) NOT NULL,
  `notes` varchar(64) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
DROP VIEW IF EXISTS `view_publication_list`;
CREATE TABLE `view_publication_list` (
`pub_id` int(11)
,`parent_id` int(11)
,`year` int(11)
,`cobiss` varchar(64)
,`issn` varchar(16)
,`original_id` int(11)
,`is_temp` int(1)
,`author` varchar(341)
,`title` varchar(341)
,`proj_id` varchar(256)
);DROP TABLE IF EXISTS `view_publication_list`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_publication_list` AS select `publication`.`pub_id` AS `pub_id`,`publication`.`parent_id` AS `parent_id`,`publication`.`year` AS `year`,`publication`.`cobiss` AS `cobiss`,`publication`.`issn` AS `issn`,`publication`.`original_id` AS `original_id`,`publication`.`is_temp` AS `is_temp`,(select group_concat(`publication_author`.`author` separator ', ') from `publication_author` where (`publication_author`.`pub_id` = `publication`.`pub_id`) order by `publication_author`.`idx`) AS `author`,(select group_concat(`publication_title`.`title` separator ', ') from `publication_title` where (`publication_title`.`pub_id` = `publication`.`pub_id`) order by `publication_title`.`idx`) AS `title`,(select group_concat(`publication_project_link`.`proj_id` separator ', ') from `publication_project_link` where (`publication_project_link`.`pub_id` = `publication`.`pub_id`) order by `publication_project_link`.`link_id`) AS `proj_id` from `publication`;


ALTER TABLE `project`
 ADD PRIMARY KEY (`proj_id`);

ALTER TABLE `project_line`
 ADD PRIMARY KEY (`line_id`);

ALTER TABLE `publication`
 ADD PRIMARY KEY (`pub_id`);

ALTER TABLE `publication_author`
 ADD PRIMARY KEY (`pub_id`,`idx`);

ALTER TABLE `publication_project_link`
 ADD PRIMARY KEY (`link_id`), ADD KEY `publication_id` (`pub_id`), ADD KEY `project_id` (`proj_id`);

ALTER TABLE `publication_title`
 ADD PRIMARY KEY (`pub_id`,`idx`);

ALTER TABLE `session`
 ADD PRIMARY KEY (`id`,`name`);

ALTER TABLE `user`
 ADD PRIMARY KEY (`id`);


ALTER TABLE `project`
MODIFY `proj_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
ALTER TABLE `project_line`
MODIFY `line_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
ALTER TABLE `publication`
MODIFY `pub_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
ALTER TABLE `publication_project_link`
MODIFY `link_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;


CREATE OR REPLACE VIEW view_publication_list AS
SELECT
    publication.pub_id AS pub_id,
    publication.parent_id AS parent_id,
    publication.year AS year,
    publication.cobiss AS cobiss,
    publication.issn AS issn,
    publication.original_id AS original_id,
    publication.is_temp AS is_temp,
    (
      SELECT GROUP_CONCAT(publication_author.author SEPARATOR ', ')
			FROM publication_author WHERE publication_author.pub_id = publication.pub_id
			ORDER BY publication_author.idx
    ) AS author,
    (
      SELECT GROUP_CONCAT(publication_title.title SEPARATOR ', ')
			FROM publication_title WHERE publication_title.pub_id = publication.pub_id
			ORDER BY publication_title.idx
    ) AS title,
    (
      SELECT GROUP_CONCAT(publication_project_link.proj_id SEPARATOR ', ')
			FROM publication_project_link WHERE publication_project_link.pub_id = publication.pub_id
			ORDER BY publication_project_link.link_id
    ) AS proj_id

FROM publication;

-- 2015-03-22


DROP TABLE IF EXISTS `quote`;
CREATE TABLE `quote` (
  `quote_id` int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `pub_id` int(11) NOT NULL,
  `pub_page` int(11) NOT NULL,
  `quoted_pub_id` int(11) NOT NULL,
  `quoted_pub_page` int(11) NOT NULL,
  `date_quoted` date NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;








