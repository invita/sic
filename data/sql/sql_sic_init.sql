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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

ALTER TABLE `publication` ADD `is_temp` int(1) NOT NULL;
ALTER TABLE `publication` CHANGE `cobiss` `cobiss` VARCHAR(64) NOT NULL;
ALTER TABLE `publication` CHANGE `issn` `issn` VARCHAR(16) NOT NULL;
ALTER TABLE `publication` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE publication_author DROP PRIMARY KEY;
ALTER TABLE `publication_author` CHANGE `id` `idx` INT(11) NOT NULL AFTER `publication_id`;
ALTER TABLE publication_author ADD PRIMARY KEY (publication_id, idx);

ALTER TABLE publication_title DROP PRIMARY KEY;
ALTER TABLE `publication_title` CHANGE `id` `idx` INT(11) NOT NULL AFTER `publication_id`;
ALTER TABLE publication_title ADD PRIMARY KEY (publication_id, idx);



