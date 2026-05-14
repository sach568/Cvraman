-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 01:27 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_panel`
--

-- --------------------------------------------------------

--
-- Table structure for table `relationship_manager_reports`
--

CREATE TABLE `relationship_manager_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `portal_id` varchar(255) NOT NULL,
  `created_date` date NOT NULL,
  `report_time` varchar(255) DEFAULT NULL,
  `manager_name` varchar(255) NOT NULL,
  `manager_mobile` varchar(255) NOT NULL,
  `sales_executive_entries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sales_executive_entries`)),
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_products` int(11) NOT NULL DEFAULT 0,
  `total_confirmed_orders` int(11) NOT NULL DEFAULT 0,
  `total_cod_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_prepaid_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relationship_manager_reports`
--

INSERT INTO `relationship_manager_reports` (`id`, `name`, `mobile`, `portal_id`, `created_date`, `report_time`, `manager_name`, `manager_mobile`, `sales_executive_entries`, `total_orders`, `total_products`, `total_confirmed_orders`, `total_cod_amount`, `total_prepaid_amount`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', '9876543210', 'admin@gmail.com', '2026-05-06', '06:02', 'shiva', '09876543212', '[{\"executive_name\":\"dd\",\"contact_number\":\"1234567898\",\"no_of_orders\":123,\"cod_amount\":1200,\"prepaid_amount\":112,\"remarks\":\"yes\"},{\"executive_name\":\"df\",\"contact_number\":\"1234567898\",\"no_of_orders\":432,\"cod_amount\":1298,\"prepaid_amount\":44,\"remarks\":\"yes\"}]', 555, 0, 0, '2498.00', '156.00', 1, '2026-05-06 00:33:29', '2026-05-06 00:40:47'),
(2, 'Admin User', '9876543210', 'admin@gmail.com', '2026-05-06', '07:29', 'mohit', '09876543212', '[{\"executive_name\":\"sa\",\"contact_number\":\"09876543213\",\"no_of_orders\":12,\"no_of_products\":12,\"order_confirmed\":\"Yes\",\"cod_amount\":1400,\"prepaid_amount\":1500,\"remarks\":\"yes\"}]', 12, 12, 12, '1400.00', '1500.00', 1, '2026-05-06 02:00:09', '2026-05-06 02:00:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `relationship_manager_reports`
--
ALTER TABLE `relationship_manager_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `relationship_manager_reports_created_by_foreign` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `relationship_manager_reports`
--
ALTER TABLE `relationship_manager_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `relationship_manager_reports`
--
ALTER TABLE `relationship_manager_reports`
  ADD CONSTRAINT `relationship_manager_reports_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
