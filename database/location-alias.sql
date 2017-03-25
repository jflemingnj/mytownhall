CREATE TABLE `location_alias` (
  `location_alias_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`location_alias_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
