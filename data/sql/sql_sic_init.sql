ALTER TABLE `user` ADD `email` VARCHAR(64) NOT NULL;
ALTER TABLE `user` ADD `notes` VARCHAR(256) NOT NULL;


CREATE TABLE `publication` (
`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `cobiss` int(11) NOT NULL,
  `issn` int(11) NOT NULL,
  `original_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `publication_author` (
`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `publication_id` int(11) NOT NULL,
  `author` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


 CREATE TABLE `publication_title` (
`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `publication_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `project` (
`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `publication` ADD `is_temp` int(1) NOT NULL;
ALTER TABLE `publication` CHANGE `cobiss` `cobiss` VARCHAR(64) NOT NULL;
ALTER TABLE `publication` CHANGE `issn` `issn` VARCHAR(16) NOT NULL;
ALTER TABLE `publication` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `publication_author` CHANGE `id` `idx` INT(11) NOT NULL AFTER `publication_id`;
ALTER TABLE publication_author DROP PRIMARY KEY;
ALTER TABLE publication_author ADD PRIMARY KEY (publication_id, idx);

ALTER TABLE `publication_title` CHANGE `id` `idx` INT(11) NOT NULL AFTER `publication_id`;
ALTER TABLE publication_title DROP PRIMARY KEY;
ALTER TABLE publication_title ADD PRIMARY KEY (publication_id, idx);


CREATE TABLE `publication_project_link` (
`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `publication_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `publication_project_link` ADD INDEX `publication_id` ( `publication_id` );
ALTER TABLE `publication_project_link` ADD INDEX `project_id` ( `project_id` );


DROP TABLE project_tmplines;
CREATE TABLE `project_lines` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `idx` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `cobiss` VARCHAR(64) NOT NULL,
  `issn` VARCHAR(16) NOT NULL,
  `publication_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `project_lines` ADD `idx` int(11) NOT NULL AFTER `id`;


CREATE OR REPLACE VIEW view_publication_list AS
SELECT
    publication.id AS id,
    publication.parent_id AS parent_id,
    publication.year AS year,
    publication.cobiss AS cobiss,
    publication.issn AS issn,
    publication.original_id AS original_id,
    publication.is_temp AS is_temp,
    (
      SELECT GROUP_CONCAT(publication_author.author SEPARATOR ', ')
			FROM publication_author WHERE publication_author.publication_id = publication.id
			ORDER BY publication_author.idx
    ) AS author,
    (
      SELECT GROUP_CONCAT(publication_title.title SEPARATOR ', ')
			FROM publication_title WHERE publication_title.publication_id = publication.id
			ORDER BY publication_title.idx
    ) AS title,
    (
      SELECT GROUP_CONCAT(publication_project_link.project_id SEPARATOR ', ')
			FROM publication_project_link WHERE publication_project_link.publication_id = publication.id
			ORDER BY publication_project_link.id
    ) AS project_id

FROM publication;










