-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Mar 17, 2015 at 11:29 PM
-- Server version: 5.5.38
-- PHP Version: 5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `sic`
--

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
`proj_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`proj_id`, `title`, `date_created`) VALUES
(1, 'Project 1', '2015-03-12'),
(2, 'Project 2', '2015-03-12'),
(3, 'Project 3', '2015-03-12'),
(4, 'Project 4', '2015-03-12'),
(5, 'Awesome Test Project', '2015-03-12'),
(8, 'Project 7', '2015-03-12'),
(9, 'New Project', '2015-03-13'),
(10, 'TestProjX', '2015-03-17');

-- --------------------------------------------------------

--
-- Table structure for table `project_line`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `project_line`
--

INSERT INTO `project_line` (`line_id`, `idx`, `proj_id`, `title`, `author`, `year`, `cobiss`, `issn`, `pub_id`) VALUES
(1, 1, 2, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 1),
(2, 2, 2, 'Nasveti', 'Gregor Marolt', 0, 'cob-2345', 'Issn_789', 2),
(3, 3, 2, 'Publikacija 1', 'Marjan Majcen', 0, 'cob-3456', 'Issn_99', 0),
(4, 4, 2, 'Publikacija 2', 'Bojana Kranjčan', 0, 'cob-666', 'Issn_11', 0),
(11, 1, 3, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 2),
(15, 1, 4, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 1),
(16, 2, 4, 'Nasveti', 'Gregor Marolt', 0, 'cob-2345', 'Issn_789', 2),
(17, 3, 4, 'Publikacija 1', 'Marjan Majcen', 0, 'cob-3456', 'Issn_99', 4),
(18, 4, 4, 'Publikacija 2', 'Bojana Kranjčan', 0, 'cob-666', 'Issn_11', 0),
(19, 1, 5, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 4),
(20, 2, 5, 'Nasveti', 'Gregor Marolt', 0, 'cob-2345', 'Issn_789', 6),
(21, 3, 5, 'Publikacija 1', 'Marjan Majcen', 0, 'cob-3456', 'Issn_99', 7),
(22, 4, 5, 'Publikacija 2', 'Bojana Kranjčan', 0, 'cob-666', 'Issn_11', 0),
(31, 1, 8, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 7),
(32, 2, 8, 'Nasveti', 'Gregor Marolt', 0, 'cob-2345', 'Issn_789', 5),
(33, 3, 8, 'Publikacija 1', 'Marjan Majcen', 0, 'cob-3456', 'Issn_99', 2),
(34, 4, 8, 'Publikacija 2', 'Bojana Kranjčan', 0, 'cob-666', 'Issn_11', 4),
(35, 1, 1, 'Kodni pravopis', 'Matic Vrščaj', 0, 'cob-1234', 'Test_Issn', 15),
(36, 2, 1, 'Nasveti', 'Gregor Marolt', 0, 'cob-2345', 'Issn_789', 0),
(37, 3, 1, 'Publikacija 1', 'Marjan Majcen', 0, 'cob-3456', 'Issn_99', 0),
(38, 4, 1, 'Publikacija 2', 'Bojana Kranjčan', 0, 'cob-666', 'Issn_11', 0),
(39, 1, 9, 'Kodni pravopis', 'Matic Vrščaj', 2014, 'cob-1234', 'Test_Issn', 16),
(40, 2, 9, 'Nasveti', 'Gregor Marolt', 2012, 'cob-2345', 'Issn_789', 0),
(41, 3, 9, 'Publikacija 1', 'Marjan Majcen', 1992, 'cob-3456', 'Issn_99', 0),
(42, 4, 9, 'Publikacija 2', 'Bojana Kranjčan', 2009, 'cob-666', 'Issn_11', 0),
(43, 1, 10, 'Kodni pravopis', 'Matic Vrščaj', 2014, 'cob-1234', 'Test_Issn', 15),
(44, 2, 10, 'Nasveti', 'Gregor Marolt', 2012, 'cob-2345', 'Issn_789', 0),
(45, 3, 10, 'Publikacija 1', 'Marjan Majcen', 1992, 'cob-3456', 'Issn_99', 0),
(46, 4, 10, 'Publikacija 2', 'Bojana Kranjčan', 2009, 'cob-666', 'Issn_11', 0);

-- --------------------------------------------------------

--
-- Table structure for table `publication`
--

DROP TABLE IF EXISTS `publication`;
CREATE TABLE `publication` (
`pub_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `cobiss` varchar(64) NOT NULL,
  `issn` varchar(16) NOT NULL,
  `original_id` int(11) NOT NULL,
  `is_temp` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `publication`
--

INSERT INTO `publication` (`pub_id`, `parent_id`, `year`, `cobiss`, `issn`, `original_id`, `is_temp`) VALUES
(1, 1, 2015, 'Cobiss-1234', '2467-1245', 0, 0),
(2, 0, 2010, 'Cobiss-1284', '4563-1284', 0, 0),
(4, 1, 2015, 'Cobiss-8675', '8765-9361', 0, 0),
(5, 0, 2015, '76543', '6542-2246', 0, 0),
(6, 0, 1999, '', '', 0, 0),
(7, 0, 2014, 'Cob-1234', 'Issn_99', 1, 0),
(15, 0, 0, 'cob-1234', 'Test_Issn', 0, 0),
(16, 0, 2014, '', '', 0, 0),
(17, 0, 0, '', '', 0, 0),
(18, 0, 0, '', '', 0, 0),
(19, 0, 0, '', '', 0, 0),
(20, 0, 0, '', '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `publication_author`
--

DROP TABLE IF EXISTS `publication_author`;
CREATE TABLE `publication_author` (
  `pub_id` int(11) NOT NULL,
  `idx` int(11) NOT NULL,
  `author` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `publication_author`
--

INSERT INTO `publication_author` (`pub_id`, `idx`, `author`) VALUES
(1, 0, 'Matic Vrščaj'),
(1, 1, 'Jan Kalšek'),
(2, 0, 'Janez Novak'),
(3, 0, 'asdf'),
(4, 0, 'Marjan Majcen'),
(5, 0, 'Valentin Rozman'),
(6, 0, 'Asdf'),
(7, 0, 'Test1111111'),
(8, 0, 'Test'),
(9, 0, 'Test'),
(10, 0, ''),
(11, 0, ''),
(12, 0, ''),
(13, 0, 'Matic Vrščaj'),
(14, 0, 'Test'),
(15, 0, 'Matic Vrščaj'),
(16, 0, 'Matic Vrščaj'),
(17, 0, ''),
(18, 0, ''),
(19, 0, ''),
(20, 0, 'Gregor Marolt');

-- --------------------------------------------------------

--
-- Table structure for table `publication_project_link`
--

DROP TABLE IF EXISTS `publication_project_link`;
CREATE TABLE `publication_project_link` (
`link_id` int(11) NOT NULL,
  `pub_id` int(11) NOT NULL,
  `proj_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `publication_project_link`
--

INSERT INTO `publication_project_link` (`link_id`, `pub_id`, `proj_id`) VALUES
(4, 2, 2),
(5, 1, 2),
(8, 1, 4),
(9, 2, 4),
(15, 4, 4),
(16, 2, 3),
(22, 4, 5),
(23, 6, 5),
(24, 6, 6),
(25, 1, 6),
(26, 5, 6),
(28, 4, 7),
(29, 7, 7),
(30, 7, 5),
(32, 5, 8),
(33, 2, 8),
(34, 4, 8),
(40, 15, 1),
(41, 16, 9),
(42, 2, 9),
(43, 20, 9),
(44, 15, 10);

-- --------------------------------------------------------

--
-- Table structure for table `publication_title`
--

DROP TABLE IF EXISTS `publication_title`;
CREATE TABLE `publication_title` (
  `pub_id` int(11) NOT NULL,
  `idx` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `publication_title`
--

INSERT INTO `publication_title` (`pub_id`, `idx`, `title`) VALUES
(1, 0, 'Web tutorials'),
(1, 1, 'How to design a Web page'),
(2, 0, 'Kako kmetovati'),
(3, 0, 'sdfg'),
(4, 0, 'Child publikacija'),
(5, 0, 'Danes je lep sončen dan'),
(6, 0, 'Asdf'),
(7, 0, 'Test1111111'),
(8, 0, ''),
(9, 0, 'Test'),
(10, 0, ''),
(11, 0, ''),
(12, 0, ''),
(13, 0, 'Kodni pravopis'),
(14, 0, 'Test'),
(15, 0, 'Kodni pravopis'),
(16, 0, 'Kodni pravopis'),
(17, 0, ''),
(18, 0, ''),
(19, 0, ''),
(20, 0, 'Nasveti po vesolju');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` char(32) NOT NULL DEFAULT '',
  `name` char(32) NOT NULL DEFAULT '',
  `modified` int(11) DEFAULT NULL,
  `lifetime` int(11) DEFAULT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `name`, `modified`, `lifetime`, `data`) VALUES
('46c62b055d2d253b06f6b288753d00f9', 'PHPSESSID', 1426270339, 1440, '__ZF|a:1:{s:20:"_REQUEST_ACCESS_TIME";d:1426270339.7726581096649169921875;}Zend_Auth|C:23:"Zend\\Stdlib\\ArrayObject":409:{a:4:{s:7:"storage";a:1:{s:7:"storage";a:5:{s:2:"id";s:2:"47";s:8:"username";s:5:"Duhec";s:8:"password";s:40:"9be03491d18ff0c13db1549d5ec975deee7de078";s:5:"email";s:22:"matic.vrscaj@gmail.com";s:5:"notes";s:14:"Duhec legenda.";}}s:4:"flag";i:2;s:13:"iteratorClass";s:13:"ArrayIterator";s:19:"protectedProperties";a:4:{i:0;s:7:"storage";i:1;s:4:"flag";i:2;s:13:"iteratorClass";i:3;s:19:"protectedProperties";}}}'),
('545b21ac261a6949b4361b07cdb7c43b', 'PHPSESSID', 1426631282, 1440, '__ZF|a:1:{s:20:"_REQUEST_ACCESS_TIME";d:1426631282.132955074310302734375;}Zend_Auth|C:23:"Zend\\Stdlib\\ArrayObject":409:{a:4:{s:7:"storage";a:1:{s:7:"storage";a:5:{s:2:"id";s:2:"47";s:8:"username";s:5:"Duhec";s:8:"password";s:40:"9be03491d18ff0c13db1549d5ec975deee7de078";s:5:"email";s:22:"matic.vrscaj@gmail.com";s:5:"notes";s:14:"Duhec legenda.";}}s:4:"flag";i:2;s:13:"iteratorClass";s:13:"ArrayIterator";s:19:"protectedProperties";a:4:{i:0;s:7:"storage";i:1;s:4:"flag";i:2;s:13:"iteratorClass";i:3;s:19:"protectedProperties";}}}');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
`id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `email` varchar(128) NOT NULL,
  `notes` varchar(64) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `notes`) VALUES
(46, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', '', ''),
(47, 'Duhec', '9be03491d18ff0c13db1549d5ec975deee7de078', 'matic.vrscaj@gmail.com', 'Duhec legenda.');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_publication_list`
--
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
);
-- --------------------------------------------------------

--
-- Structure for view `view_publication_list`
--
DROP TABLE IF EXISTS `view_publication_list`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_publication_list` AS select `publication`.`pub_id` AS `pub_id`,`publication`.`parent_id` AS `parent_id`,`publication`.`year` AS `year`,`publication`.`cobiss` AS `cobiss`,`publication`.`issn` AS `issn`,`publication`.`original_id` AS `original_id`,`publication`.`is_temp` AS `is_temp`,(select group_concat(`publication_author`.`author` separator ', ') from `publication_author` where (`publication_author`.`pub_id` = `publication`.`pub_id`) order by `publication_author`.`idx`) AS `author`,(select group_concat(`publication_title`.`title` separator ', ') from `publication_title` where (`publication_title`.`pub_id` = `publication`.`pub_id`) order by `publication_title`.`idx`) AS `title`,(select group_concat(`publication_project_link`.`proj_id` separator ', ') from `publication_project_link` where (`publication_project_link`.`pub_id` = `publication`.`pub_id`) order by `publication_project_link`.`link_id`) AS `proj_id` from `publication`;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `project`
--
ALTER TABLE `project`
 ADD PRIMARY KEY (`proj_id`);

--
-- Indexes for table `project_line`
--
ALTER TABLE `project_line`
 ADD PRIMARY KEY (`line_id`);

--
-- Indexes for table `publication`
--
ALTER TABLE `publication`
 ADD PRIMARY KEY (`pub_id`);

--
-- Indexes for table `publication_author`
--
ALTER TABLE `publication_author`
 ADD PRIMARY KEY (`pub_id`,`idx`);

--
-- Indexes for table `publication_project_link`
--
ALTER TABLE `publication_project_link`
 ADD PRIMARY KEY (`link_id`), ADD KEY `publication_id` (`pub_id`), ADD KEY `project_id` (`proj_id`);

--
-- Indexes for table `publication_title`
--
ALTER TABLE `publication_title`
 ADD PRIMARY KEY (`pub_id`,`idx`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
 ADD PRIMARY KEY (`id`,`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
MODIFY `proj_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `project_line`
--
ALTER TABLE `project_line`
MODIFY `line_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `publication`
--
ALTER TABLE `publication`
MODIFY `pub_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `publication_project_link`
--
ALTER TABLE `publication_project_link`
MODIFY `link_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;COMMIT;
