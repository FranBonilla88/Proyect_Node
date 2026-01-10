-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-12-2025 a las 13:40:00
-- Versión del servidor: 10.1.21-MariaDB
-- Versión de PHP: 5.6.30
SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
    time_zone = "+00:00";

--
-- Base de datos: `sanidad`
--
CREATE DATABASE IF NOT EXISTS `sanidad` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;

USE `sanidad`;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `medico`
--
DROP TABLE IF EXISTS `medico`;

CREATE TABLE `medico` (
    `idmedico` int(4) NOT NULL,
    `nombre` varchar(50) NOT NULL,
    `especialidad` varchar(50) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

--
-- Volcado de datos para la tabla `medico`
--
INSERT INTO
    `medico` (`idmedico`, `nombre`, `especialidad`)
VALUES
    (1, 'Dr. Francisco Talamino', 'Cardiología'),
    (2, 'Dra. Laura Sánchez', 'Pediatría'),
    (3, 'Dr. Antonio Herrera', 'Dermatología'),
    (4, 'Dra. Elena Márquez', 'Neurología'),
    (5, 'Dr. Javier Romero', 'Medicina General');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `paciente`
--
DROP TABLE IF EXISTS `paciente`;

CREATE TABLE `paciente` (
    `idpaciente` int(5) NOT NULL,
    `nombre` varchar(50) NOT NULL,
    `fecha_nacimiento` date NOT NULL,
    `idmedico` int(4) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

--
-- Volcado de datos para la tabla `paciente`
--
INSERT INTO
    `paciente` (
        `idpaciente`,
        `nombre`,
        `fecha_nacimiento`,
        `idmedico`
    )
VALUES
    (1, 'Joaquín Franco', '1985-03-22', 1),
    (2, 'María López', '1990-07-15', 1),
    (3, 'Carlos Ruiz', '2012-11-05', 2),
    (4, 'Lucía Fernández', '1978-02-10', 1),
    (5, 'Pedro Martín', '1969-09-30', 1),
    (6, 'Sofía Delgado', '2015-04-12', 2),
    (7, 'Álvaro Torres', '2010-01-22', 2),
    (8, 'Marta Jiménez', '1988-06-18', 3),
    (9, 'Raúl Navarro', '1995-12-03', 3),
    (10, 'Isabel Cruz', '1975-08-27', 4),
    (11, 'Hugo Serrano', '1982-11-14', 4),
    (12, 'Nuria Campos', '1999-03-05', 5),
    (13, 'Daniel Pardo', '2001-07-19', 5);

-- --------------------------------------------------------
--
-- Índices para tablas volcadas
--
--
-- Indices de la tabla `medico`
--
ALTER TABLE
    `medico`
ADD
    PRIMARY KEY (`idmedico`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE
    `paciente`
ADD
    PRIMARY KEY (`idpaciente`),
ADD
    KEY `FK_MEDICO` (`idmedico`);

-- --------------------------------------------------------
--
-- AUTO_INCREMENT de las tablas volcadas
--
ALTER TABLE
    `medico`
MODIFY
    `idmedico` int(4) NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 6;

ALTER TABLE
    `paciente`
MODIFY
    `idpaciente` int(5) NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 14;

-- --------------------------------------------------------
--
-- Restricciones para tablas volcadas
--
ALTER TABLE
    `paciente`
ADD
    CONSTRAINT `FK_MEDICO` FOREIGN KEY (`idmedico`) REFERENCES `medico` (`idmedico`) ON DELETE
SET
    NULL;