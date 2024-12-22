CREATE TABLE `user` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `username` varchar(255) UNIQUE NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (NOW()),
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL
  `photo` varchar(255)
);

CREATE TABLE `topic` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `moment` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `userId` integer,
  `createdAt` timestamp NOT NULL DEFAULT (NOW()),
  `expiresAt` timestamp,
  `text` varchar(255) NOT NULL
);

CREATE TABLE `moment_photo` (
  `momentId` integer NOT NULL,
  `path` varchar(255) NOT NULL
);

CREATE TABLE `moment_topic` (
  `momentId` integer NOT NULL,
  `topicId` integer NOT NULL,
  UNIQUE(`momentId`, `topicId`)
);

CREATE TABLE `moment_reaction` (
  `momentId` integer NOT NULL,
  `userId` integer NOT NULL,
  `emoji` varchar(255) NOT NULL,
  UNIQUE(`momentId`, `userId`)
);

ALTER TABLE `moment` ADD FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `moment_photo` ADD FOREIGN KEY (`momentId`) REFERENCES `moment` (`id`) ON DELETE CASCADE;

ALTER TABLE `moment_topic` ADD FOREIGN KEY (`momentId`) REFERENCES `moment` (`id`) ON DELETE CASCADE;

ALTER TABLE `moment_reaction` ADD FOREIGN KEY (`momentId`) REFERENCES `moment` (`id`) ON DELETE CASCADE;

ALTER TABLE `moment_topic` ADD FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`) ON DELETE CASCADE;
