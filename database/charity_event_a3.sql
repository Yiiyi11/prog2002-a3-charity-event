CREATE DATABASE  IF NOT EXISTS `charityevents_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `charityevents_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fun Run'),(2,'Gala Dinner'),(3,'Silent Auction'),(4,'Charity Concert');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charity_organisations`
--

DROP TABLE IF EXISTS `charity_organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_organisations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(150) NOT NULL,
  `mission` text NOT NULL,
  `contact_email` varchar(120) DEFAULT NULL,
  `contact_phone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_organisations`
--

LOCK TABLES `charity_organisations` WRITE;
/*!40000 ALTER TABLE `charity_organisations` DISABLE KEYS */;
INSERT INTO `charity_organisations` VALUES (1,'Community Hope Foundation','Raise fund for local disadvantaged communities','hope@charity.org','0400111222');
/*!40000 ALTER TABLE `charity_organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `org_id` int NOT NULL,
  `category_id` int NOT NULL,
  `event_name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `event_date` datetime NOT NULL,
  `location` varchar(200) NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `charity_goal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `current_progress` decimal(12,2) NOT NULL DEFAULT '0.00',
  `is_suspended` tinyint(1) NOT NULL DEFAULT '0',
  `event_image_url` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,6) DEFAULT NULL COMMENT 'latitude for open‑meteo weather api',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT 'longitude for open‑meteo weather api',
  PRIMARY KEY (`event_id`),
  KEY `org_id` (`org_id`),
  KEY `idx_eventdate` (`event_date`),
  KEY `idx_category` (`category_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `charity_organisations` (`org_id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,1,1,'City Fun Run 2026','Community fun run for homeless support','2026-11-15 08:00:00','Brisbane Park',25.00,15000.00,7200.00,0,'img/run.jpg',-27.469800,153.025100),(2,1,2,'Winter Gala Dinner','Annual fundraising gala dinner','2026-12-02 18:30:00','Riverside Hotel',120.00,30000.00,18500.00,0,'img/gala.jpg',-27.470500,153.031000),(3,1,3,'Silent Auction Night','Silent auction for youth program','2026-10-10 19:00:00','City Convention Centre',0.00,8000.00,8200.00,0,'img/auction.jpg',-27.468000,153.023400),(4,1,4,'Charity Rock Concert','Live music for mental health support','2027-01-05 19:00:00','Central Arena',45.00,22000.00,9100.00,0,'img/concert.jpg',-27.471200,153.028800),(5,1,1,'Beach Fun Run','Coastal charity run event','2026-11-22 07:30:00','Gold Coast Beach',30.00,12000.00,4500.00,0,'img/beachrun.jpg',-28.000200,153.431400),(6,1,2,'Spring Charity Ball','Spring formal fundraising event','2026-12-20 18:00:00','Grand Ballroom',150.00,35000.00,11000.00,0,'img/springball.jpg',-27.469100,153.027600),(7,1,3,'Art Silent Auction','Artwork auction for children charity','2026-09-01 17:00:00','Art Gallery',0.00,10000.00,10500.00,0,'img/artauction.jpg',-27.467400,153.022100),(8,1,4,'Acoustic Charity Show','Small acoustic live show','2027-01-12 20:00:00','Town Hall',20.00,5000.00,2300.00,0,'img/acoustic.jpg',-27.472000,153.030200),(9,1,1,'Suspended Test Event','Policy violation test event','2026-11-30 10:00:00','Test location',10.00,2000.00,500.00,1,'img/sus.jpg',NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `registration_id` int NOT NULL AUTO_INCREMENT COMMENT 'unique registration primary key',
  `event_id` int NOT NULL COMMENT 'foreign key link to events table',
  `contact_fullname` varchar(150) NOT NULL COMMENT 'registrant full name',
  `contact_email` varchar(120) NOT NULL COMMENT 'registrant email address',
  `contact_phone` varchar(30) DEFAULT NULL COMMENT 'registrant phone number',
  `ticket_quantity` int NOT NULL COMMENT 'number of tickets purchased',
  `registration_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'timestamp when registration submitted',
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `uk_event_email` (`event_id`,`contact_email`),
  KEY `fk_reg_event` (`event_id`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,1,'Alice Smith','alice@example.com','0411111111',2,'2026-09-02 10:15:00'),(2,1,'Bob Wilson','bob@example.com','0422222222',1,'2026-09-03 14:20:00'),(3,1,'Charlie Brown','charlie@example.com','0433333333',3,'2026-09-04 09:05:00'),(4,2,'Diana Prince','diana@example.com','0444444444',2,'2026-09-05 18:30:00'),(5,2,'Edward Clark','edward@example.com','0455555555',4,'2026-09-06 11:40:00'),(6,2,'Fiona Davis','fiona@example.com','0466666666',1,'2026-09-07 15:10:00'),(7,3,'George Hall','george@example.com','0477777777',2,'2026-09-08 13:25:00'),(8,5,'Hannah Lee','hannah@example.com','0488888888',3,'2026-09-09 16:50:00'),(9,5,'Ian Moore','ian@example.com','0499999999',1,'2026-09-10 10:00:00'),(10,6,'Julia Taylor','julia@example.com','0412345678',2,'2026-09-11 08:15:00'),(11,7,'Kevin Young','kevin@example.com','0487654321',1,'2026-09-12 14:35:00');
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 15:48:31
USE charityevents_db;
SHOW TABLES;

USE charityevents_db;
UPDATE events SET latitude = -27.4689, longitude = 153.0235 WHERE event_id = 1;

USE charityevents_db;
DESCRIBE events;

USE charityevents_db;
ALTER TABLE events ADD COLUMN latitude DECIMAL(10,6) NULL;
ALTER TABLE events ADD COLUMN longitude DECIMAL(10,6) NULL;


USE charityevents_db;
DESCRIBE events;

USE charityevents_db;
UPDATE events SET latitude = -27.4689, longitude = 153.0235 WHERE event_id = 1;
USE charityevents_db;
SELECT * FROM events;

