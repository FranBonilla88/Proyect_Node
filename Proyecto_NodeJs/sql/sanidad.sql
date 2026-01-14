-- Database: sanidad
CREATE DATABASE IF NOT EXISTS `sanidad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `sanidad`;

-- --------------------------------------------------------
-- Doctor table
-- --------------------------------------------------------
DROP TABLE IF EXISTS `doctor`;

CREATE TABLE `doctor` (
    `id` INT(4) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `surname` VARCHAR(50) NOT NULL,
    `specialty` VARCHAR(50) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Sample data
INSERT INTO
    `doctor` (
        `id`,
        `name`,
        `surname`,
        `specialty`,
        `email`,
        `phone`
    )
VALUES
    (
        1,
        'Francisco',
        'Talamino',
        'Cardiology',
        'francisco.talamino@hospital.com',
        '600123123'
    ),
    (
        2,
        'Laura',
        'Sanchez',
        'Pediatrics',
        'laura.sanchez@hospital.com',
        '600456456'
    ),
    (
        3,
        'Antonio',
        'Herrera',
        'Dermatology',
        'antonio.herrera@hospital.com',
        '600789789'
    ),
    (
        4,
        'Elena',
        'Marquez',
        'Neurology',
        'elena.marquez@hospital.com',
        '600987987'
    ),
    (
        5,
        'Javier',
        'Romero',
        'General Medicine',
        'javier.romero@hospital.com',
        '600654654'
    );

-- --------------------------------------------------------
-- Patient table
-- --------------------------------------------------------
DROP TABLE IF EXISTS `patient`;

CREATE TABLE `patient` (
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `surname` VARCHAR(50) NOT NULL,
    `birth_date` DATE NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `doctor_id` INT(4) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_DOCTOR` (`doctor_id`),
    CONSTRAINT `FK_DOCTOR` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`) ON DELETE
    SET
        NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Sample data
INSERT INTO
    `patient` (
        `id`,
        `name`,
        `surname`,
        `birth_date`,
        `email`,
        `phone`,
        `doctor_id`
    )
VALUES
    (
        1,
        'Joaquin',
        'Franco',
        '1985-03-22',
        'joaquin.franco@mail.com',
        '611111111',
        1
    ),
    (
        2,
        'Maria',
        'Lopez',
        '1990-07-15',
        'maria.lopez@mail.com',
        '622222222',
        1
    ),
    (
        3,
        'Carlos',
        'Ruiz',
        '2012-11-05',
        'carlos.ruiz@mail.com',
        '633333333',
        2
    ),
    (
        4,
        'Lucia',
        'Fernandez',
        '1978-02-10',
        'lucia.fernandez@mail.com',
        '644444444',
        1
    ),
    (
        5,
        'Pedro',
        'Martin',
        '1969-09-30',
        'pedro.martin@mail.com',
        '655555555',
        1
    ),
    (
        6,
        'Sofia',
        'Delgado',
        '2015-04-12',
        'sofia.delgado@mail.com',
        '666666666',
        2
    ),
    (
        7,
        'Alvaro',
        'Torres',
        '2010-01-22',
        'alvaro.torres@mail.com',
        '677777777',
        2
    ),
    (
        8,
        'Marta',
        'Jimenez',
        '1988-06-18',
        'marta.jimenez@mail.com',
        '688888888',
        3
    ),
    (
        9,
        'Raul',
        'Navarro',
        '1995-12-03',
        'raul.navarro@mail.com',
        '699999999',
        3
    ),
    (
        10,
        'Isabel',
        'Cruz',
        '1975-08-27',
        'isabel.cruz@mail.com',
        '611222333',
        4
    ),
    (
        11,
        'Hugo',
        'Serrano',
        '1982-11-14',
        'hugo.serrano@mail.com',
        '622333444',
        4
    ),
    (
        12,
        'Nuria',
        'Campos',
        '1999-03-05',
        'nuria.campos@mail.com',
        '633444555',
        5
    ),
    (
        13,
        'Daniel',
        'Pardo',
        '2001-07-19',
        'daniel.pardo@mail.com',
        '644555666',
        5
    );