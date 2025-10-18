-- CreateTable
CREATE TABLE `agreements` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_student` BIGINT UNSIGNED NOT NULL,
    `id_project` BIGINT UNSIGNED NOT NULL,
    `agreement_status` ENUM('Revisi', 'Proses', 'Terplotting Bimbingan') NOT NULL,
    `progress` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `agreements_id_project_index`(`id_project`),
    INDEX `agreements_id_student_index`(`id_student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tittle` VARCHAR(255) NOT NULL,
    `detail` VARCHAR(255) NOT NULL,
    `attachment` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bimbingan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_student` BIGINT UNSIGNED NOT NULL,
    `id_lecturer` BIGINT UNSIGNED NOT NULL,
    `ke` VARCHAR(255) NOT NULL,
    `tanggal` DATE NOT NULL,
    `subjek` VARCHAR(255) NOT NULL,
    `catatan_dosen` VARCHAR(255) NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `aksi` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `bimbingan_id_lecturer_index`(`id_lecturer`),
    INDEX `bimbingan_id_student_index`(`id_student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `pic` VARCHAR(255) NOT NULL,
    `status` ENUM('process', 'approve', 'rejected', 'canceled', 'Waiting to be return', 'done') NOT NULL DEFAULT 'process',
    `tanggal` DATE NOT NULL,
    `session_id` BIGINT UNSIGNED NOT NULL,
    `inventories_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_content` BIGINT UNSIGNED NOT NULL,
    `id_user` BIGINT UNSIGNED NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `comments_id_content_index`(`id_content`),
    INDEX `comments_id_user_index`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_content` BIGINT UNSIGNED NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,

    INDEX `content_images_id_content_index`(`id_content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_proyek` BIGINT UNSIGNED NOT NULL,
    `thumbnail_image_url` VARCHAR(255) NOT NULL,
    `content_url` VARCHAR(255) NULL,
    `video_url` VARCHAR(255) NULL,
    `video_tittle` VARCHAR(255) NULL,
    `github_url` VARCHAR(255) NULL,
    `tipe_konten` ENUM('jurnal', 'tugas akhir') NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `contents_id_proyek`(`id_proyek`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `carts_id_user_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(255) NOT NULL,
    `no_item` VARCHAR(255) NULL,
    `condition` ENUM('good', 'bad') NOT NULL,
    `alat/bhp` ENUM('alat', 'bhp') NOT NULL,
    `type` ENUM('praktikum', 'projek') NULL,
    `no_inv_ugm` VARCHAR(255) NULL,
    `information` TEXT NOT NULL,
    `room_id` BIGINT UNSIGNED NULL,
    `labolatory_id` BIGINT UNSIGNED NULL,
    `created_by` BIGINT UNSIGNED NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `inventories_no_item_unique`(`no_item`),
    INDEX `inventories_created_by_foreign`(`created_by`),
    INDEX `inventories_labolatory_id_foreign`(`labolatory_id`),
    INDEX `inventories_room_id_foreign`(`room_id`),
    INDEX `inventories_updated_by_foreign`(`updated_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_galleries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inventory_id` BIGINT UNSIGNED NOT NULL,
    `filepath` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `inventory_galleries_inventory_id_foreign`(`inventory_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_reserves` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `inventory_id` BIGINT UNSIGNED NOT NULL,
    `start_time` TIMESTAMP(0) NULL,
    `end_time` TIMESTAMP(0) NULL,
    `identity` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `no_wa` VARCHAR(50) NOT NULL,
    `needs` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `name` VARCHAR(255) NULL,

    INDEX `inventory_reserves_inventory_id_foreign`(`inventory_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_rooms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT UNSIGNED NOT NULL,
    `inventory_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `inventory_rooms_inventory_id_foreign`(`inventory_id`),
    INDEX `inventory_rooms_room_id_foreign`(`room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_pengadaans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `pengadaan_id` BIGINT UNSIGNED NOT NULL,
    `inventory_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `item_pengadaans_inventory_id_foreign`(`inventory_id`),
    INDEX `item_pengadaans_pengadaan_id_foreign`(`pengadaan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labolatories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laboran` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `laboran_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laboratorium_support` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT UNSIGNED NOT NULL,
    `support_type_1` VARCHAR(255) NOT NULL,
    `support_type_2` VARCHAR(255) NULL,
    `support_type_3` VARCHAR(255) NULL,
    `support_type_4` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `laboratorium_support_room_id_foreign`(`room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lecturers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT UNSIGNED NOT NULL,
    `image_profile` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `front_title` VARCHAR(255) NOT NULL,
    `back_title` VARCHAR(255) NOT NULL,
    `NID` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `max_quota` INTEGER NOT NULL,
    `isKaprodi` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `lecturers_id_user_index`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT UNSIGNED NOT NULL,
    `id_content` BIGINT UNSIGNED NOT NULL,
    `notification_message` TEXT NOT NULL,
    `notification_date` DATETIME(0) NOT NULL,

    INDEX `notifications_id_content_index`(`id_content`),
    INDEX `notifications_id_user_index`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendadaran` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_student` BIGINT UNSIGNED NOT NULL,
    `id_lecturer` BIGINT UNSIGNED NOT NULL,
    `tanggal_sidang` DATE NOT NULL,
    `jam` TIME(0) NOT NULL,
    `ruang` VARCHAR(255) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `pendadaran_id_lecturer_index`(`id_lecturer`),
    INDEX `pendadaran_id_student_index`(`id_student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengadaans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(255) NOT NULL,
    `spesifikasi` TEXT NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga_item` BIGINT NOT NULL,
    `bulan_pengadaan` DATE NOT NULL,
    `labolatory_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `pengadaans_labolatory_id_foreign`(`labolatory_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periods` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `semester` ENUM('Genap', 'Ganjil') NOT NULL,
    `year` VARCHAR(255) NOT NULL,
    `description` ENUM('Tugas Akhir', 'Yudisium') NOT NULL,
    `status` ENUM('Aktif', 'Tidak Aktif') NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `tanggal_sidang` DATE NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `expires_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_lecturer` BIGINT UNSIGNED NOT NULL,
    `id_period` BIGINT UNSIGNED NOT NULL,
    `tittle` VARCHAR(255) NOT NULL,
    `agency` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `tools` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `projects_id_lecturer_index`(`id_lecturer`),
    INDEX `projects_id_period_index`(`id_period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `laboran_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `research_laboran_id_foreign`(`laboran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserve_rules` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `rule` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_reserves` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT UNSIGNED NULL,
    `start_time` TIMESTAMP(0) NULL,
    `end_time` TIMESTAMP(0) NULL,
    `identity` VARCHAR(100) NULL,
    `email` VARCHAR(255) NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `no_wa` VARCHAR(50) NULL,
    `needs` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `name` VARCHAR(255) NULL,

    INDEX `room_reserves_room_id_foreign`(`room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `capacity` INTEGER NULL,
    `type` ENUM('gudang', 'laboratorium') NOT NULL,
    `description` TEXT NULL,
    `foto_laboratorium` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_id` BIGINT UNSIGNED NOT NULL,
    `subject_id` BIGINT UNSIGNED NOT NULL,
    `start_time` TIMESTAMP(0) NULL,
    `end_time` TIMESTAMP(0) NULL,
    `dosen` VARCHAR(255) NOT NULL,
    `information` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `schedules_room_id_foreign`(`room_id`),
    INDEX `schedules_subject_id_foreign`(`subject_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INTEGER NOT NULL,

    INDEX `sessions_last_activity_index`(`last_activity`),
    INDEX `sessions_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specialities` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_lecturer` BIGINT UNSIGNED NOT NULL,
    `tag` ENUM('Software Engineering', 'Intelligent Gaming', 'Data Science', 'System Security and Cybersecurity', 'Mobile and Responsive App Development', 'Blockchain Technology and Digital Finance', 'Artificial Intelligence and Natural Language Processing', 'IoT') NOT NULL,

    INDEX `specialities_id_lecturer_index`(`id_lecturer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistics` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT UNSIGNED NOT NULL,
    `page_visited` VARCHAR(255) NOT NULL,
    `visit_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `statistics_id_user_index`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT UNSIGNED NOT NULL,
    `NIM` VARCHAR(255) NOT NULL,
    `semester` VARCHAR(255) NOT NULL,
    `IPK` INTEGER NOT NULL,
    `SKS` INTEGER NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `skill` VARCHAR(255) NOT NULL,
    `experience` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `students_id_user_index`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subject_name` VARCHAR(255) NOT NULL,
    `lecturer` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supervisors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_student` BIGINT UNSIGNED NOT NULL,
    `id_lecturer` BIGINT UNSIGNED NOT NULL,

    INDEX `supervisors_id_lecturer_index`(`id_lecturer`),
    INDEX `supervisors_id_student_index`(`id_student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_content` BIGINT UNSIGNED NOT NULL,
    `tag` ENUM('Software Engineering', 'Intelligent Gaming', 'Data Science', 'System Security and Cybersecurity', 'Mobile and Responsive App Development', 'Blockchain Technology and Digital Finance', 'Artificial Intelligence and Natural Language Processing', 'IoT') NOT NULL,

    INDEX `tags_id_content_index`(`id_content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_sessions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `start` TIME NOT NULL,
    `end` TIME NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NULL,
    `identity` VARCHAR(191) NULL,
    `role` ENUM('admin', 'dosen', 'umum', 'kaleb', 'laboran') NULL DEFAULT 'umum',
    `login_status` ENUM('on', 'off') NOT NULL DEFAULT 'off',
    `last_login` TIMESTAMP(0) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `lab_id` BIGINT UNSIGNED NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    INDEX `users_lab_id_foreign`(`lab_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_id_project_foreign` FOREIGN KEY (`id_project`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agreements` ADD CONSTRAINT `agreements_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `bimbingan_id_lecturer_foreign` FOREIGN KEY (`id_lecturer`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bimbingan` ADD CONSTRAINT `bimbingan_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_foreign` FOREIGN KEY (`inventories_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_update_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `booking_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_time_session_foreign` FOREIGN KEY (`session_id`) REFERENCES `time_sessions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_id_content_foreign` FOREIGN KEY (`id_content`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content_images` ADD CONSTRAINT `content_images_id_content_foreign` FOREIGN KEY (`id_content`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_id_user_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_labolatory_id_foreign` FOREIGN KEY (`labolatory_id`) REFERENCES `labolatories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventory_galleries` ADD CONSTRAINT `inventory_galleries_inventory_id_foreign` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventory_reserves` ADD CONSTRAINT `inventory_reserves_inventory_id_foreign` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventory_rooms` ADD CONSTRAINT `inventory_rooms_inventory_id_foreign` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventory_rooms` ADD CONSTRAINT `inventory_rooms_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `item_pengadaans` ADD CONSTRAINT `item_pengadaans_inventory_id_foreign` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `item_pengadaans` ADD CONSTRAINT `item_pengadaans_pengadaan_id_foreign` FOREIGN KEY (`pengadaan_id`) REFERENCES `pengadaans`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `laboratorium_support` ADD CONSTRAINT `laboratorium_support_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `lecturers` ADD CONSTRAINT `lecturers_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_id_content_foreign` FOREIGN KEY (`id_content`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendadaran` ADD CONSTRAINT `pendadaran_id_lecturer_foreign` FOREIGN KEY (`id_lecturer`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pendadaran` ADD CONSTRAINT `pendadaran_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pengadaans` ADD CONSTRAINT `pengadaans_labolatory_id_foreign` FOREIGN KEY (`labolatory_id`) REFERENCES `labolatories`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_id_lecturer_foreign` FOREIGN KEY (`id_lecturer`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_id_period_foreign` FOREIGN KEY (`id_period`) REFERENCES `periods`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `research` ADD CONSTRAINT `research_laboran_id_foreign` FOREIGN KEY (`laboran_id`) REFERENCES `laboran`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `room_reserves` ADD CONSTRAINT `room_reserves_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `specialities` ADD CONSTRAINT `specialities_id_lecturer_foreign` FOREIGN KEY (`id_lecturer`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `statistics` ADD CONSTRAINT `statistics_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `supervisors` ADD CONSTRAINT `supervisors_id_lecturer_foreign` FOREIGN KEY (`id_lecturer`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `supervisors` ADD CONSTRAINT `supervisors_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_id_content_foreign` FOREIGN KEY (`id_content`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lab_id_foreign` FOREIGN KEY (`lab_id`) REFERENCES `labolatories`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
