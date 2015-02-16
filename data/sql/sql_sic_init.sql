ALTER TABLE `user` ADD `email` VARCHAR(64) NOT NULL;
ALTER TABLE `user` ADD `notes` VARCHAR(256) NOT NULL;


CREATE TABLE `publication` (
`id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `cobiss` int(11) NOT NULL,
  `issn` int(11) NOT NULL,
  `original_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

ALTER TABLE `publication`
 ADD PRIMARY KEY (`id`);


CREATE TABLE `publication_author` (
`id` int(11) NOT NULL,
  `publication_id` int(11) NOT NULL,
  `author` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

ALTER TABLE `publication_author`
 ADD PRIMARY KEY (`id`);


 CREATE TABLE `publication_title` (
`id` int(11) NOT NULL,
  `publication_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

ALTER TABLE `publication_title`
 ADD PRIMARY KEY (`id`);