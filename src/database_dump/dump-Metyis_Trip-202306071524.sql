-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: Metyis_Trip
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approvers_to_grp_map`
--

DROP TABLE IF EXISTS `approvers_to_grp_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvers_to_grp_map` (
  `usr_to_grp_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `grp_id` int NOT NULL,
  PRIMARY KEY (`usr_to_grp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvers_to_grp_map`
--

LOCK TABLES `approvers_to_grp_map` WRITE;
/*!40000 ALTER TABLE `approvers_to_grp_map` DISABLE KEYS */;
INSERT INTO `approvers_to_grp_map` VALUES (1,31,1),(2,38,1),(3,28,2),(4,38,2);
/*!40000 ALTER TABLE `approvers_to_grp_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aproovals`
--

DROP TABLE IF EXISTS `aproovals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aproovals` (
  `aprooval_id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `aproover_id` int NOT NULL,
  `is_aprooved` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`aprooval_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aproovals`
--

LOCK TABLES `aproovals` WRITE;
/*!40000 ALTER TABLE `aproovals` DISABLE KEYS */;
INSERT INTO `aproovals` VALUES (116,112,11,0),(117,113,11,3);
/*!40000 ALTER TABLE `aproovals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aproovers`
--

DROP TABLE IF EXISTS `aproovers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aproovers` (
  `approverId` int NOT NULL AUTO_INCREMENT,
  `fromUserId` int DEFAULT NULL,
  `toUserId` int DEFAULT NULL,
  `isLastAproover` int DEFAULT NULL,
  PRIMARY KEY (`approverId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aproovers`
--

LOCK TABLES `aproovers` WRITE;
/*!40000 ALTER TABLE `aproovers` DISABLE KEYS */;
INSERT INTO `aproovers` VALUES (10,29,28,0),(11,30,29,0),(16,28,-1,0);
/*!40000 ALTER TABLE `aproovers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `grp_id` int NOT NULL AUTO_INCREMENT,
  `grp_name` varchar(100) DEFAULT NULL,
  `grp_type` int NOT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`grp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Hugo Boss',1,1),(2,'PVH',1,2),(3,'AWWG',1,3),(4,'Finance',2,NULL),(5,'Operations',2,NULL);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grp_approvals`
--

DROP TABLE IF EXISTS `grp_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grp_approvals` (
  `grp_approval_id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `status` int NOT NULL,
  `grp_approver_id` int NOT NULL,
  PRIMARY KEY (`grp_approval_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grp_approvals`
--

LOCK TABLES `grp_approvals` WRITE;
/*!40000 ALTER TABLE `grp_approvals` DISABLE KEYS */;
/*!40000 ALTER TABLE `grp_approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grp_approvers`
--

DROP TABLE IF EXISTS `grp_approvers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grp_approvers` (
  `grp_approver_id` int NOT NULL AUTO_INCREMENT,
  `from_grp_id` int NOT NULL,
  `to_grp_id` int NOT NULL,
  `from_grp_type` int NOT NULL,
  `to_grp_type` int NOT NULL,
  PRIMARY KEY (`grp_approver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grp_approvers`
--

LOCK TABLES `grp_approvers` WRITE;
/*!40000 ALTER TABLE `grp_approvers` DISABLE KEYS */;
INSERT INTO `grp_approvers` VALUES (1,0,1,0,1),(2,0,2,0,1),(3,0,3,0,1),(4,1,4,1,2),(5,2,4,1,2),(6,3,4,1,2),(7,4,5,2,2);
/*!40000 ALTER TABLE `grp_approvers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `projectId` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `project_code` varchar(100) NOT NULL,
  `client_id` int NOT NULL,
  PRIMARY KEY (`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Hugo Boss',NULL,'HB_01',0),(2,'PVH',NULL,'PVH_01',0),(3,'AWWG',NULL,'AWWG_01',0);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traveller_details`
--

DROP TABLE IF EXISTS `traveller_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traveller_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `passport_number` varchar(100) DEFAULT NULL,
  `adhaar_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traveller_details`
--

LOCK TABLES `traveller_details` WRITE;
/*!40000 ALTER TABLE `traveller_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `traveller_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_detail_submissions`
--

DROP TABLE IF EXISTS `trip_detail_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_detail_submissions` (
  `submissionId` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `status` int NOT NULL,
  `traveller_detail_id` int NOT NULL,
  PRIMARY KEY (`submissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_detail_submissions`
--

LOCK TABLES `trip_detail_submissions` WRITE;
/*!40000 ALTER TABLE `trip_detail_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `trip_detail_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `tripId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `userId` int NOT NULL,
  `projectId` int NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `travel_mode` int DEFAULT NULL,
  `hotel_from_date` date DEFAULT NULL,
  `hotel_to_date` date DEFAULT NULL,
  `from_country` varchar(100) DEFAULT NULL,
  `to_country` varchar(100) DEFAULT NULL,
  `from_city` varchar(100) DEFAULT NULL,
  `to_city` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tripId`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (112,'asda','2023-05-08','2023-05-11',30,2,'dasdasd',1,'2023-05-18','2023-05-27','asdasda','asdasda','sdasd','sdasdad'),(113,'Trip 01','2023-05-28','2023-05-02',30,2,'asda',0,'2023-05-28','2023-05-29','sdasda','sdasda','sdasda','sdasd');
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `employeeCode` varchar(100) DEFAULT NULL,
  `userType` tinyint(1) DEFAULT '0',
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'atul','atul.kumar@metyis.com','abc',0,'pass@123'),(28,'Suresh Srinivasan','suresh@gmail.com','',2,'pass'),(29,'Ishneet','ishneet@gmail.com','',2,'pass'),(30,'Atul','atul@gmail.com','',2,'pass'),(31,'Keshab','keshab@gmail.com','',1,NULL),(32,'asda','asdasd','dasd',2,NULL),(33,'czcs','dsfsdxccvxc','czxcz',1,NULL),(34,'Normal user','normal@gmail.com','',2,NULL),(35,'Admin User','admin@gmail.com','',1,NULL),(36,'Normal User1','normal1@gmail.com','',2,NULL),(37,'Admin User1','admin2@gmail.com','',1,NULL),(38,'Puneet','puneet@gmail.com','',2,NULL),(39,'Finance User1','finance1@gmail.com',NULL,2,NULL),(40,'Finance User2','finance2@gmail.com',NULL,2,NULL),(41,'Operation User1','operation1@gmail.com',NULL,2,NULL),(42,'Operation User2','operation2@gmail.com',NULL,2,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'Metyis_Trip'
--
/*!50003 DROP PROCEDURE IF EXISTS `Approve_Trip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Approve_Trip`(IN tripId INTEGER, IN approverId INTEGER)
BEGIN

UPDATE
	aproovals
SET
	aproovals.isAprooved = 2
WHERE
	aproovals.tripId = tripId
	AND aproovals.aprooverId = aprooverId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Create_Trip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Create_Trip`(
IN userId INTEGER,
IN projectId INTEGER,
IN name VARCHAR(32),
IN fromCountry VARCHAR(32),
IN toCountry VARCHAR(32),
IN fromCity VARCHAR(32),
IN toCity VARCHAR(32),
IN startDate DATE,
IN endDate DATE,
IN hotelFromDate DATE,
IN hotelToDate DATE,
IN reason VARCHAR(128),
IN travelMode INTEGER)
BEGIN

	INSERT
	INTO
	trips (userId,
	projectId,
	name,
	startDate,
	endDate,
	reason,
	travel_mode,
	hotel_from_date,
	hotel_to_date, 
	from_country,
	to_country,
	from_city,
	to_city)
	
	
VALUES(userId,
projectId,
name,
startDate,
endDate,
reason, 
	travelMode,
hotelFromDate,
hotelToDate,
fromCountry,
toCountry,
fromCity,
toCity);

SELECT LAST_INSERT_ID() as insertId;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_Approved_Trips` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_Approved_Trips`()
BEGIN
	SELECT
	tr.tripId ,
	tr.name ,
	tr.toLocation ,
	tr.fromLocation,
	apr.fromUserId ,
	apr.toUserId ,
	u.name as fromUser,
	us.name as toUser,
	ap.isAprooved ,
	ap.aprooverId ,
	apr.isLastAproover 
FROM
	aproovals ap
JOIN trips tr on
	ap.tripId = tr.tripId
JOIN aproovers apr on
	apr.approverId = ap.aprooverId
JOIN users u on 
	u.userId = apr.fromUserId
LEFT OUTER JOIN users us on 
	apr.toUserId = us.userId
WHERE
	ap.tripId NOT IN (
	SELECT
		a2.tripId
	FROM
		aproovals a2
	WHERE
		a2.isAprooved = 0 OR  a2.isAprooved = 1 OR  a2.isAprooved = 3)
ORDER BY
	tr.tripId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_Others_Trips` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_Others_Trips`(IN userId INTEGER)
BEGIN



SELECT
	t.tripId ,
	t.name ,
	t.from_country ,
	t.from_city ,
	t.reason ,
	t.travel_mode ,
	t.projectId ,
	DATE_FORMAT(t.hotel_from_date, "%m-%d-%Y") as hotel_from_date,
	DATE_FORMAT(t.hotel_to_date, "%m-%d-%Y") as hotel_to_date,
	t.to_country  ,
	t.to_city ,
	DATE_FORMAT(t.startDate, "%m-%d-%Y") as startDate,
	DATE_FORMAT(t.endDate, "%m-%d-%Y") as endDate,
	apr.fromUserId ,
	apr.toUserId ,
	u.name as fromUser,
	us.name as toUser,
	ap.isAprooved ,
	ap.aprooverId ,
	apr.isLastAproover 
FROM
	trips t
join aproovals ap on
	t.tripId = ap.tripId
JOIN aproovers apr on
	apr.approverId = ap.aprooverId
JOIN users u on
	u.userId = apr.fromUserId
JOIN users us on
	us.userId = apr.toUserId
WHERE
	t.tripId IN 

(
SELECT	
	trips.tripId 
	/*trips.name ,
	trips.toLocation ,
	trips.fromLocation,
	apr.fromUserId ,
	apr.toUserId ,
	u.name as fromUser,
	us.name as toUser,
	ap.isAprooved ,
	ap.aprooverId ,
	apr.isLastAproover */
FROM
	aproovals ap1
join aproovers apr1 on
	apr1.approverId = ap1.aprooverId
JOIN trips on
	trips.tripId = ap1.tripId
/*JOIN users u on
	u.userId = apr1.fromUserId
JOIN users us on
	us.userId = apr1.toUserId*/
WHERE #Don't get trips which are not sent or pending. But get trips which are rejected and to be resend
	apr1.toUserId = userId AND ap1.isAprooved != 0) 
ORDER BY
t.tripId;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_Trips` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_Trips`(IN userId INTEGER)
BEGIN
SELECT
	trips.tripId ,
	trips.name ,
	trips.to_country,
	trips.userId ,
	trips.from_country ,
	trips.from_city ,
	trips.to_city ,
	trips.hotel_from_date ,
	trips.hotel_to_date ,
	trips.reason ,
	trips.travel_mode ,
	trips.projectId ,
	trips.startDate ,
	trips.endDate ,
	apr.fromUserId ,
	apr.toUserId ,
	u.name as fromUser,
	us.name as toUser,
	ap.isAprooved ,
	ap.aprooverId ,
	apr.isLastAproover 
FROM
	trips
LEFT OUTER JOIN aproovals ap on
	ap.tripId = trips.tripId
LEFT OUTER JOIN aproovers apr on
	apr.approverId = ap.aprooverId
LEFT OUTER JOIN users u on 
	u.userId = apr.fromUserId
LEFT OUTER JOIN users us on 
	apr.toUserId = us.userId
WHERE
	trips.userId = userId ORDER BY trips.tripId;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_Trip_Detail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_Trip_Detail`(IN tripId INTEGER)
BEGIN
	SELECT
	trips.tripId ,
	trips.name ,
	trips.from_country ,
	trips.from_city ,
	trips.reason ,
	trips.travel_mode ,
	trips.projectId ,
	DATE_FORMAT(trips.hotel_from_date, "%m-%d-%Y") as hotel_from_date,
	DATE_FORMAT(trips.hotel_to_date, "%m-%d-%Y") as hotel_to_date,
	trips.to_country  ,
	trips.to_city ,
	DATE_FORMAT(trips.startDate, "%m-%d-%Y") as startDate,
	DATE_FORMAT(trips.endDate, "%m-%d-%Y") as endDate,
	apr.fromUserId ,
	apr.toUserId ,
	u.name as fromUser,
	us.name as toUser,
	ap.isAprooved ,
	ap.aprooverId ,
	apr.isLastAproover 
FROM
	trips
JOIN aproovals ap on
	ap.tripId = tripId 
JOIN aproovers apr on
	apr.approverId = ap.aprooverId
JOIN users u on 
	u.userId = apr.fromUserId
JOIN users us on 
	apr.toUserId = us.userId
WHERE
	trips.tripId  = tripId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Get_Users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Get_Users`()
BEGIN
	SELECT * FROM users WHERE users.userType != 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Reject_Trip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Reject_Trip`(IN tripId INTEGER, IN approverId INTEGER)
BEGIN

#Mark all approvals as 'Pending'	
/*UPDATE
	aproovals
SET
	aproovals.isAprooved = 0
WHERE
	aproovals.tripId = tripId;*/

#Mark approval as Rejected for 'approver' & 'trip'
UPDATE
	aproovals
SET
	aproovals.isAprooved = 3
WHERE
	aproovals.tripId = tripId
	AND aproovals.aprooverId = approverId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Reset_Trip_Approvals` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Reset_Trip_Approvals`(IN tripId INTEGER)
BEGIN
	UPDATE
	aproovals
SET
	aproovals.isAprooved = 4
WHERE
	aproovals .tripId = tripId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Send_Trip_For_Approval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Send_Trip_For_Approval`(IN tripId INTEGER, IN userId INTEGER)
BEGIN
	DECLARE approverId INTEGER;
	DECLARE approvalId INTEGER;
	DECLARE toUserId INTEGER;

#Find approverId to send to next approver.
SELECT
	aproovers.approverId, aproovers.toUserId
into
	approverId, toUserId
FROM
	aproovers
WHERE
	aproovers.fromUserId = userId;

SELECT
	approverId;

IF toUserId != -1 THEN

#Find existing approval for above approver.
SELECT
	a.aproovalId
into
	approvalId
FROM
	aproovals a
WHERE
	a.tripId = tripId
	AND a.aprooverId = approverId;

IF approverId IS NOT NULL THEN

	IF ISNULL(approvalId) then #Insert approval if does not exist.
INSERT
	INTO
	aproovals (aproovals.tripId,
	aproovals.aprooverId,
	aproovals.isAprooved)
values (tripId,
approverId,
1);
else #Update approval if already exists.
UPDATE
	aproovals
SET
	aproovals.isAprooved = 1
WHERE
	aproovals .aproovalId = approvalId;

/*#
UPDATE
	aproovals
SET
	aproovals.isAprooved = 0
WHERE
	aproovals .isAprooved = 2;*/

END IF;
END IF;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Update_Trip` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_Trip`(IN tripId INTEGER, IN name VARCHAR(64), IN fromLocation VARCHAR(64), IN toLocation VARCHAR(64))
BEGIN
	UPDATE
	trips
SET
	trips.name = name,
	trips.fromLocation = fromLocation ,
	trips .toLocation = toLocation
WHERE
	trips .tripId = tripId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-07 15:24:41
