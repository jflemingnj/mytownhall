CREATE TABLE `event_alias` (
  `event_alias_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `event_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`event_alias_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
