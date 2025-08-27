-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: anon_db
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

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
-- Table structure for table `activation_tokens`
--

DROP TABLE IF EXISTS `activation_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activation_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activation_tokens`
--

LOCK TABLES `activation_tokens` WRITE;
/*!40000 ALTER TABLE `activation_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `activation_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Policy','2025-08-26 22:45:54','2025-08-26 22:45:54'),(2,'Workplace','2025-08-26 22:45:54','2025-08-26 22:45:54'),(3,'Events','2025-08-26 22:45:54','2025-08-26 22:45:54'),(4,'IT','2025-08-26 22:45:54','2025-08-26 22:45:54'),(5,'Wellness','2025-08-26 22:45:54','2025-08-26 22:45:54');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_upvotes`
--

DROP TABLE IF EXISTS `comment_upvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_upvotes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_upvotes_comment_id_user_id_unique` (`comment_id`,`user_id`),
  KEY `comment_upvotes_user_id_foreign` (`user_id`),
  CONSTRAINT `comment_upvotes_comment_id_foreign` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_upvotes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_upvotes`
--

LOCK TABLES `comment_upvotes` WRITE;
/*!40000 ALTER TABLE `comment_upvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_upvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `upvote_count` int NOT NULL DEFAULT '0',
  `parent_id` bigint unsigned DEFAULT NULL,
  `status` enum('active','flagged','resolved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `flaged_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_post_id_foreign` (`post_id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_parent_id_foreign` (`parent_id`),
  CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_11_000000_create_user_statuses_table',1),(2,'2014_10_12_000000_create_users_table',1),(3,'2014_10_12_100000_create_password_reset_tokens_table',1),(4,'2016_06_01_000001_create_oauth_auth_codes_table',1),(5,'2016_06_01_000002_create_oauth_access_tokens_table',1),(6,'2016_06_01_000003_create_oauth_refresh_tokens_table',1),(7,'2016_06_01_000004_create_oauth_clients_table',1),(8,'2016_06_01_000005_create_oauth_personal_access_clients_table',1),(9,'2019_08_19_000000_create_failed_jobs_table',1),(10,'2019_12_14_000001_create_personal_access_tokens_table',1),(11,'2025_08_26_020528_create_categories_table',1),(12,'2025_08_26_020602_create_posts_table',1),(13,'2025_08_26_025309_create_comments_table',1),(14,'2025_08_26_031429_create_comment_upvotes_table',1),(15,'2025_08_27_062751_create_activation_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_access_tokens`
--

LOCK TABLES `oauth_access_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_auth_codes`
--

LOCK TABLES `oauth_auth_codes` WRITE;
/*!40000 ALTER TABLE `oauth_auth_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_auth_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_personal_access_clients`
--

DROP TABLE IF EXISTS `oauth_personal_access_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_personal_access_clients`
--

LOCK TABLES `oauth_personal_access_clients` WRITE;
/*!40000 ALTER TABLE `oauth_personal_access_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_personal_access_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_refresh_tokens`
--

LOCK TABLES `oauth_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','flagged','resolved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `upvote_count` int NOT NULL DEFAULT '0',
  `viewer_count` int NOT NULL DEFAULT '0',
  `flaged_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_category_id_foreign` (`category_id`),
  KEY `posts_user_id_foreign` (`user_id`),
  CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_statuses`
--

DROP TABLE IF EXISTS `user_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_statuses`
--

LOCK TABLES `user_statuses` WRITE;
/*!40000 ALTER TABLE `user_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middle_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `microsoft_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `microsoft_tenant_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Member',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `immediate_supervisor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `login_attempts` int NOT NULL DEFAULT '0',
  `user_status_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_microsoft_id_unique` (`microsoft_id`),
  KEY `users_username_index` (`username`),
  KEY `users_microsoft_id_index` (`microsoft_id`),
  KEY `users_microsoft_tenant_id_index` (`microsoft_tenant_id`),
  KEY `users_email_index` (`email`),
  KEY `users_user_status_id_foreign` (`user_status_id`),
  CONSTRAINT `users_user_status_id_foreign` FOREIGN KEY (`user_status_id`) REFERENCES `user_statuses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Toshihiko','','Nishida','Toshihiko  Nishida','nishida.t@sprobe.com','IncognitoObserver4623',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Management','Toshihiko Nishida','2022-10-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(2,'Marie Claire Yaxien','Villanueva','Pejana','Marie Claire Yaxien Villanueva Pejana','pejana.mc@sprobe.com','StealthIndividual1757',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2019-10-07',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(3,'Glenn Vincent','Geotoro','Otadoy','Glenn Vincent Geotoro Otadoy','otadoy.gv@sprobe.com','MysteryInsider4685',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2019-11-04',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(4,'Stella Maris','Paduga','Resma','Stella Maris Paduga Resma','paduga.sm@sprobe.com','VeiledParticipant8518',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2019-11-04',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(5,'John Kenneth','Navarro','Cariño','John Kenneth Navarro Cariño','carino.jk@sprobe.com','PhantomWitness1586',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Bianca Benedicte Lauron','2021-10-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(6,'Leobert','Geverola','Camoro','Leobert Geverola Camoro','camoro.l@sprobe.com','PrivateAssociate3047',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2022-04-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(7,'Shiena Marie','Taparan','Caminero','Shiena Marie Taparan Caminero','caminero.sm@sprobe.com','StealthReporter5845',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2022-04-05',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(8,'Ruben','Tanginan','Arche','Ruben Tanginan Arche','arche.r@sprobe.com','NamelessProfessional8010',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2022-05-02',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(9,'Jennifer','Abellana','Giganto','Jennifer Abellana Giganto','giganto.ja@sprobe.com','PrivatePerson1787',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2014-05-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(10,'Bianca Benedicte','Biaño','Lauron','Bianca Benedicte Biaño Lauron','biano.bbs@sprobe.com','UndercoverStaff6475',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Group Leader','Toshihiko Nishida','2016-04-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(11,'Arjun','Gica','Manipes','Arjun Gica Manipes','manipes.ag@sprobe.com','DiscreetParticipant4157',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Bianca Benedicte Lauron','2016-05-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(12,'Kysha Faye','Dacullo','Nacua','Kysha Faye Dacullo Nacua','nacua.kfd@sprobe.com','InvisibleObserver8192',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Ma. Teresa Labra','2016-05-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(13,'Clieve','Ceniza','Comahig','Clieve Ceniza Comahig','comahig.cc@sprobe.com','FacelessWorker6700',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Louie Gabutin','2018-04-16',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(14,'Briane  Allan','Ando','Galorio','Briane  Allan Ando Galorio','galorio.baa@sprobe.com','DiscreetWorker2103',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Leader','Ma. Teresa Labra','2018-07-16',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(15,'Audie Michael','Cerna','Litrada II','Audie Michael Cerna Litrada II','litrada.amc@sprobe.com','FacelessWorker8926',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Bianca Benedicte Lauron','2018-09-03',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(16,'Michael','Gallardo','Mativo','Michael Gallardo Mativo','mativo.m@sprobe.com','MysteryParticipant5036',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Ma. Teresa Labra','2018-10-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(17,'Yurika','Sakano','Roa','Yurika Sakano Roa','roa.ys@sprobe.com','MysteryIndividual2381',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Japanese','Ma. Teresa Labra','2019-01-07',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(18,'John Ivans','Cayas','Saromines','John Ivans Cayas Saromines','saromines.jic@sprobe.com','NamelessUser1718',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Quality Assurance','Bianca Benedicte Lauron','2019-03-16',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(19,'John Leroy','Anton','Damulo','John Leroy Anton Damulo','damulo.jla@sprobe.com','PhantomContributor5664',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Quality Assurance','Briane  Allan Galorio','2019-03-20',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(20,'Jay','Asaldo','Piquero','Jay Asaldo Piquero','piquero.ja@sprobe.com','GhostlyVoice9874',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2019-05-16',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(21,'Adam','Tacadao','Melecio','Adam Tacadao Melecio','melecio.at@sprobe.com','MaskedWorker6889',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Ma. Teresa Labra','2019-06-03',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(22,'Louie','Basaya','Gabutin','Louie Basaya Gabutin','gabutin.lb@sprobe.com','PrivateColleague3413',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Group Leader','Jonathan Vicente Canillo','2019-08-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(23,'Marnito','Itable','Mahinlo','Marnito Itable Mahinlo','mahinlo.mi@sprobe.com','AnonymousParticipant5110',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Louie Gabutin','2019-08-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(24,'Jade','Villarin','Dabuco','Jade Villarin Dabuco','dabuco.jv@sprobe.com','UndercoverAgent7913',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Ma. Teresa Labra','2019-09-02',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(25,'Michael','Pilones','Tampus','Michael Pilones Tampus','tampus.mp@sprobe.com','StealthContributor4463',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Workplace','Milodie Bascar','2019-09-20',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(26,'Thea Marie','Canete','Deloso','Thea Marie Canete Deloso','deloso.tm@sprobe.com','NamelessEmployee3708',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Group Leader','Jonathan Vicente Canillo','2021-03-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(27,'Charl Rio','Villeno','Lagura','Charl Rio Villeno Lagura','lagura.cr@sprobe.com','QuietTeam9077',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Leader','Louie Gabutin','2021-03-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(28,'Eric','Barbasa','Victoriano','Eric Barbasa Victoriano','victoriano.e@sprobe.com','UndercoverProfessional2326',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2021-03-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(29,'Jonathan Vicente','Polloso','Canillo','Jonathan Vicente Polloso Canillo','canillo.jv@sprobe.com','VeiledColleague8628',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Leader','Toshihiko Nishida','2021-05-20',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(30,'Virnon Nel','Berdin','Tutor','Virnon Nel Berdin Tutor','tutor.vn@sprobe.com','SecretVoice7884',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Louie Gabutin','2021-06-25',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(31,'John Nelon','Doroy','Rodriguez','John Nelon Doroy Rodriguez','rodriguez.jn@sprobe.com','NamelessUser7164',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Batch Monitoring','Louie Gabutin','2021-09-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(32,'Mc Gyver','Paglinawan','Galbizo','Mc Gyver Paglinawan Galbizo','galbizo.mg@sprobe.com','NamelessPerson9856',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Quality Assurance','Briane  Allan Galorio','2021-09-10',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(33,'Peter Anthony','Cosido','Tibon','Peter Anthony Cosido Tibon','tibon.pa@sprobe.com','WhisperObserver3414',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2021-12-06',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(34,'John Lorenz','Monteza','Ruizo','John Lorenz Monteza Ruizo','ruizo.jl@sprobe.com','ShadowAgent8634',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Group Leader','Tatsunori Tanaka','2021-08-05',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(35,'Cristy','Borgonia','Bordadora','Cristy Borgonia Bordadora','bordadora.c@sprobe.com','IncognitoReporter9918',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Quality Assurance','Ma. Teresa Labra','2022-03-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(36,'Geoffrey','Caranto','Eslava','Geoffrey Caranto Eslava','eslava.g@sprobe.com','FacelessObserver8558',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2022-02-07',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(37,'Jeffrey','Bebasa','Hitosis','Jeffrey Bebasa Hitosis','hitosis.j@sprobe.com','AnonymousEmployee6772',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Bianca Benedicte Lauron','2022-03-01',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(38,'Clifford','Parampan','Catubig','Clifford Parampan Catubig','catubig.c@sprobe.com','PhantomProfessional9114',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Bianca Benedicte Lauron','2022-03-21',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(39,'Alvin','Catapang','Sanchez','Alvin Catapang Sanchez','sanchez.a@sprobe.com','AnonymousVoice3702',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Ma. Teresa Labra','2022-03-15',0,NULL,'2025-08-26 22:45:54','2025-08-26 22:45:54'),(40,'Ma. Teresa','Canonigo','Labra','Ma. Teresa Canonigo Labra','labra.mt@sprobe.com','VeiledVoice7762',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Group Leader','Toshihiko Nishida','2022-06-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(41,'Archristian','Presbitero','Verdida','Archristian Presbitero Verdida','verdida.a@sprobe.com','StealthEmployee5290',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Tatsunori Tanaka','2022-05-02',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(42,'Milodie','Uy','Bascar','Milodie Uy Bascar','bascar.m@sprobe.com','MysteryWitness1628',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Nurse','Thea Marie Deloso','2022-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(43,'Susumu','','Tomeoku','Susumu  Tomeoku','tomeoku.s@sprobe.com','StealthPerson9454',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Japanese','Tatsunori Tanaka','2022-06-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(44,'Tatsunori','','Tanaka','Tatsunori  Tanaka','tanaka.t@sprobe.com','HiddenContact7364',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Leader','Toshihiko Nishida','2024-01-04',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(45,'Norhata','Punag','Casan','Norhata Punag Casan','casan.n@sprobe.com','FacelessAgent7861',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Leader','Milodie Bascar','2024-04-29',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(46,'Cray Pixel','Filosopo','Abitria','Cray Pixel Filosopo Abitria','abitria.cp@sprobe.com','FacelessEmployee9888',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(47,'Lyle','Cuyos','Cañete','Lyle Cuyos Cañete','canete.l@sprobe.com','FacelessPerson1035',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(48,'Dwight','','Eyac','Dwight  Eyac','eyac.d@sprobe.com','FacelessWorker4256',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(49,'Moses Anthony','Yap','Fat','Moses Anthony Yap Fat','fat.ma@sprobe.com','GhostlyMember6533',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Ma. Teresa Labra','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(50,'Clarisse Yvonne','Binarao','Jacalan','Clarisse Yvonne Binarao Jacalan','jacalan.cy@sprobe.com','CovertPerson6694',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(51,'Kim Darius','Lomentigar','Panis','Kim Darius Lomentigar Panis','panis.kd@sprobe.com','PhantomWitness2227',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Ma. Teresa Labra','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(52,'Christ Rile','Ardina','Parinasan','Christ Rile Ardina Parinasan','parinasan.cr@sprobe.com','PhantomProfessional5291',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(53,'Dave Arlu Niño','Banzon','Tindoy','Dave Arlu Niño Banzon Tindoy','tindoy.dan@sprobe.com','MysteryUser9471',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Tatsunori Tanaka','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(54,'Janine','Bustamante','Ubal','Janine Bustamante Ubal','ubal.j@sprobe.com','UndercoverPerson2497',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Bianca Benedicte Lauron','2024-07-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(55,'Gemar','Bacus','Iligan','Gemar Bacus Iligan','iligan.g@sprobe.com','IncognitoIndividual1769',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Infrastructure','Jonathan Vicente Canillo','2024-11-13',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(56,'Florito','Baguio','Doyohim','Florito Baguio Doyohim','doyohim.f@sprobe.com','ShadowTeam3348',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Technical Lead','Ma. Teresa Labra','2024-11-25',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(57,'Kurt Desmond','','Cabaluna','Kurt Desmond  Cabaluna','cabaluna.k@sprobe.com','GhostlyAgent1545',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(58,'Giliane Aze','Frondoza','Dorado','Giliane Aze Frondoza Dorado','dorado.g@sprobe.com','HiddenIndividual6782',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(59,'Oliver Grant','Mandal','Pacatang','Oliver Grant Mandal Pacatang','pacatang.o@sprobe.com','PrivateTeam1514',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(60,'John Clement','Ranes','Rubiato','John Clement Ranes Rubiato','rubiato.j@sprobe.com','GhostlyReporter8769',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(61,'Ernesto','Caliso','Tacumba Jr.','Ernesto Caliso Tacumba Jr.','tacumba.e@sprobe.com','CovertWitness2674',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(62,'Angelo Rey','Ruiz','Bacaling','Angelo Rey Ruiz Bacaling','bacaling.a@sprobe.com','UnknownColleague5256',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Milodie Bascar','2025-06-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(63,'Jannah Mae','Araneta','Nene','Jannah Mae Araneta Nene','nene.jm@sprobe.com','InvisibleWorker3831',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Junior Accountant','Norhata Casan','2025-07-23',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(64,'Rasul Richy','Lumanggal','Palanggalan','Rasul Richy Lumanggal Palanggalan','palanggalan.rr@sprobe.com','NamelessPerson5422',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2025-08-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(65,'Rhea Bell','Isugan','Tomaquin','Rhea Bell Isugan Tomaquin','tomaquin.rb@sprobe.com','InvisibleIndividual5771',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2025-08-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55'),(66,'Monica Claire','Mamalias','Apor','Monica Claire Mamalias Apor','apor.mc@sprobe.com','SilentVoice4840',NULL,NULL,NULL,NULL,NULL,NULL,'Member','Software Engineer','Louie Gabutin','2025-08-01',0,NULL,'2025-08-26 22:45:55','2025-08-26 22:45:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-27 15:07:59
