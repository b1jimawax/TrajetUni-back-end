-- CreateTable
CREATE TABLE `Passager` (
    `id_passager` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_passager` VARCHAR(191) NOT NULL,
    `prenom_passager` VARCHAR(191) NOT NULL,
    `numero_de_telephone` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(191) NOT NULL,
    `photo_passager` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_passager`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id_de_reservation` INTEGER NOT NULL AUTO_INCREMENT,
    `id_trajet` INTEGER NOT NULL,
    `id_passager` INTEGER NOT NULL,

    PRIMARY KEY (`id_de_reservation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conducteur` (
    `id_conducteur` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_conducteur` VARCHAR(191) NOT NULL,
    `prenom_conducteur` VARCHAR(191) NOT NULL,
    `numero_de_telephone` VARCHAR(191) NOT NULL,
    `modele_du_vehicule` VARCHAR(191) NOT NULL,
    `nombre_de_place_disponible` INTEGER NOT NULL,
    `photo_conducteur` VARCHAR(191) NOT NULL,
    `photo_du_permis_de_conduire` VARCHAR(191) NOT NULL,
    `carte_crise_et_d_assurance` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_conducteur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trajet` (
    `id_trajet` INTEGER NOT NULL AUTO_INCREMENT,
    `id_du_conducteur` INTEGER NOT NULL,
    `destination_d_arrivee` VARCHAR(191) NOT NULL,
    `destination_depart` VARCHAR(191) NOT NULL,
    `heure_de_depart` DATETIME(3) NOT NULL,
    `heure_d_arrivee` DATETIME(3) NOT NULL,
    `prix_du_trajet` DOUBLE NOT NULL,

    PRIMARY KEY (`id_trajet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_passager_fkey` FOREIGN KEY (`id_passager`) REFERENCES `Passager`(`id_passager`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_trajet_fkey` FOREIGN KEY (`id_trajet`) REFERENCES `Trajet`(`id_trajet`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trajet` ADD CONSTRAINT `Trajet_id_du_conducteur_fkey` FOREIGN KEY (`id_du_conducteur`) REFERENCES `Conducteur`(`id_conducteur`) ON DELETE RESTRICT ON UPDATE CASCADE;
