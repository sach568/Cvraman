-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 01:34 PM
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
-- Table structure for table `sales_executive_reports`
--

CREATE TABLE `sales_executive_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) NOT NULL,
  `portal_id` varchar(255) NOT NULL,
  `manager_name` varchar(255) NOT NULL,
  `manager_mobile` varchar(255) DEFAULT NULL,
  `created_date` date NOT NULL,
  `report_time` varchar(255) DEFAULT NULL,
  `order_entries_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order_entries_data`)),
  `first_closures_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`first_closures_data`)),
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_amount_sum` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_cod_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_prepaid_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `today_works_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`today_works_data`)),
  `followups_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`followups_data`)),
  `total_number_sales` decimal(10,0) NOT NULL DEFAULT 0,
  `total_sales_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_followup` int(11) NOT NULL DEFAULT 0,
  `total_customers` int(11) NOT NULL DEFAULT 0,
  `sales_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sales_data`)),
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_executive_reports`
--

INSERT INTO `sales_executive_reports` (`id`, `name`, `email`, `mobile`, `portal_id`, `manager_name`, `manager_mobile`, `created_date`, `report_time`, `order_entries_data`, `first_closures_data`, `total_orders`, `total_amount_sum`, `total_cod_amount`, `total_prepaid_amount`, `today_works_data`, `followups_data`, `total_number_sales`, `total_sales_amount`, `total_followup`, `total_customers`, `sales_data`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'new data', NULL, '0987654323', 's@g.com', 'rahul1', NULL, '2026-05-02', NULL, NULL, NULL, 0, '0.00', '0.00', '0.00', '[{\"sales_number\":\"120\",\"sales_amount\":\"80000\"}]', '[{\"customer_name\":\"shiva1\",\"mobile\":\"0987654323\"},{\"customer_name\":\"snai1\",\"mobile\":\"0987654323\"}]', '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-02 01:11:08', '2026-05-02 01:11:44'),
(4, 'Admin User', NULL, '9876543210', 'admin@gmail.com', 'shiva', NULL, '2026-05-05', NULL, NULL, NULL, 0, '0.00', '0.00', '0.00', NULL, NULL, '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-05 03:54:55', '2026-05-05 03:54:55'),
(5, 'Admin User', NULL, '9876543210', 'admin@gmail.com', 'shiva', '09876543212', '2026-05-05', '09:50', '[{\"sales_date\":\"05\\/05\",\"order_number\":\"123\",\"total_amount\":\"1200\",\"source\":\"Friend\",\"remarks\":\"yes\"},{\"sales_date\":\"05\\/05\",\"order_number\":\"876\",\"total_amount\":\"1400\",\"source\":\"Friend\",\"remarks\":\"yes\"}]', '[{\"closure_name\":\"sa\",\"closure_number\":\"9876543212\",\"closure_portal_id\":\"n@g.com\"}]', 2, '2600.00', '0.00', '0.00', NULL, NULL, '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-05 04:21:38', '2026-05-05 04:21:38'),
(6, 'Admin User', NULL, '9876543210', 'admin@gmail.com', 'mohit', '09876543212', '2026-05-05', '10:08', '[{\"no_of_products\":\"2\",\"order_number\":\"123\",\"total_amount\":\"1600\",\"source\":\"Friend\",\"remarks\":\"yes\"},{\"no_of_products\":\"4\",\"order_number\":\"876\",\"total_amount\":\"14000\",\"source\":\"Person\",\"remarks\":\"yes\"}]', '[{\"closure_name\":\"sa\",\"closure_number\":\"9876543212\",\"closure_portal_id\":\"n@g.com\"},{\"closure_name\":\"js\",\"closure_number\":\"9876543212\",\"closure_portal_id\":\"j@g.com\"}]', 2, '15600.00', '0.00', '0.00', NULL, NULL, '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-05 04:40:02', '2026-05-05 04:41:13'),
(7, 'Admin User', NULL, '9876543210', 'admin@gmail.com', 'mohit', '09876543212', '2026-05-05', '10:47', '[{\"no_of_products\":\"2\",\"customer_name\":\"subham\",\"order_id\":\"123\",\"total_amount\":1600,\"payment_status\":\"COD\",\"source\":\"Friend\",\"remarks\":\"yes\"},{\"no_of_products\":\"5\",\"customer_name\":\"ddd\",\"order_id\":\"555\",\"total_amount\":14000,\"payment_status\":\"Pre-paid\",\"source\":\"Friend\",\"remarks\":\"n\"}]', '[{\"closure_name\":\"sa\",\"closure_number\":\"9876543212\",\"closure_portal_id\":\"n@g.com\"}]', 2, '15600.00', '1600.00', '14000.00', NULL, NULL, '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-05 05:18:22', '2026-05-05 05:18:22'),
(8, 'Admin User', NULL, '9876543210', 'admin@gmail.com', 'mohit', '09876543212', '2026-05-05', '11:01', '[{\"no_of_products\":\"3\",\"order_id\":\"123\",\"total_amount\":1600,\"payment_status\":\"Pre-paid\",\"source\":\"Friend\",\"remarks\":\"yes\"},{\"no_of_products\":\"5\",\"order_id\":\"555\",\"total_amount\":14000,\"payment_status\":\"COD\",\"source\":\"Person\",\"remarks\":\"yes\"}]', '[{\"closure_name\":\"sas\",\"closure_number\":\"9876543212\",\"closure_portal_id\":\"n@g.com\"}]', 2, '15600.00', '14000.00', '1600.00', NULL, NULL, '0', '0.00', 0, 0, NULL, 'pending', 1, '2026-05-05 05:32:24', '2026-05-05 05:33:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sales_executive_reports`
--
ALTER TABLE `sales_executive_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_executive_reports_created_by_foreign` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sales_executive_reports`
--
ALTER TABLE `sales_executive_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales_executive_reports`
--
ALTER TABLE `sales_executive_reports`
  ADD CONSTRAINT `sales_executive_reports_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
