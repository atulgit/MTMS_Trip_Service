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
-- Table structure for table `aproovals`
--

DROP TABLE IF EXISTS `aproovals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aproovals` (
  `aproovalId` int NOT NULL AUTO_INCREMENT,
  `tripId` int NOT NULL,
  `aprooverId` int NOT NULL,
  `isAprooved` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`aproovalId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aproovals`
--

LOCK TABLES `aproovals` WRITE;
/*!40000 ALTER TABLE `aproovals` DISABLE KEYS */;
INSERT INTO `aproovals` VALUES (13,17,10,1),(17,21,11,1),(18,22,10,1),(19,21,10,1),(20,21,9,0),(21,22,9,0),(22,23,11,1),(23,11,10,0),(24,23,10,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aproovers`
--

LOCK TABLES `aproovers` WRITE;
/*!40000 ALTER TABLE `aproovers` DISABLE KEYS */;
INSERT INTO `aproovers` VALUES (10,29,28,0),(11,30,29,0);
/*!40000 ALTER TABLE `aproovers` ENABLE KEYS */;
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
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `fromLocation` varchar(100) DEFAULT NULL,
  `toLocation` varchar(100) DEFAULT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`tripId`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (21,'Atul Trip',NULL,NULL,'Delhi','London',30),(22,'Ishu Trip',NULL,NULL,'Delhi','London',29),(23,'Atul_1 Trip',NULL,NULL,'Delhi','Lodon',30);
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
  `is_admin` tinyint(1) DEFAULT '0',
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'atul','atul.kumar@metyis.com','abc',1,'pass@123'),(28,'Suresh','suresh@gmail.com','',0,'pass'),(29,'Ishneet','ishneet@gmail.com','',0,'pass'),(30,'Atul','atul@gmail.com','',0,'pass'),(31,'Keshab','keshab@gmail.com','',0,NULL);
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
	aproovals.isAprooved = 1
WHERE
	aproovals.tripId = tripId
	AND aproovals.aprooverId = aprooverId ;
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
	t.toLocation ,
	t.fromLocation,
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
WHERE
	apr1.toUserId = userId) ORDER BY t.tripId;


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
	trips.toLocation ,
	trips.fromLocation,
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
	ap.tripId = trips.tripId
JOIN aproovers apr on
	apr.approverId = ap.aprooverId
JOIN users u on 
	u.userId = apr.fromUserId
JOIN users us on 
	apr.toUserId = us.userId
WHERE
	trips.userId = userId ORDER BY trips.tripId;
	
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
	SELECT
	aproovers.approverId
into
	approverId
FROM
	aproovers
WHERE
	aproovers.fromUserId = userId;

SELECT
	approverId;

IF approverId IS NOT NULL THEN

INSERT
	INTO
	aproovals (aproovals.tripId,
	aproovals.aprooverId)
values (tripId,
approverId);


END IF;
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

-- Dump completed on 2023-05-18 14:32:12
