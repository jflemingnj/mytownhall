CREATE TABLE `event` (
  `event_id` int(11) NOT NULL,
  `start_date` varchar(100) DEFAULT NULL,
  `times` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `details` varchar(200) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `end_date` varchar(100) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
