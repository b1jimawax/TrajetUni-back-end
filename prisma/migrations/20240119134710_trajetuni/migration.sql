/*
  Warnings:

  - Added the required column `status` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Reservation_id_passager_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_id_trajet_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Trajet_id_du_conducteur_fkey` ON `trajet`;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_passager_fkey` FOREIGN KEY (`id_passager`) REFERENCES `Passager`(`id_passager`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_trajet_fkey` FOREIGN KEY (`id_trajet`) REFERENCES `Trajet`(`id_trajet`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trajet` ADD CONSTRAINT `Trajet_id_du_conducteur_fkey` FOREIGN KEY (`id_du_conducteur`) REFERENCES `Conducteur`(`id_conducteur`) ON DELETE RESTRICT ON UPDATE CASCADE;
