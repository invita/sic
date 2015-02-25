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

