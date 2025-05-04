import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1746390260333 implements MigrationInterface {
    name = 'InitialMigrations1746390260333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`time_trackings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`task_id\` int NOT NULL, \`start_time\` timestamp NOT NULL, \`end_time\` timestamp NULL, \`duration_hours\` float NULL, \`date\` date NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`is_paused\` tinyint NOT NULL DEFAULT 0, \`pause_time\` timestamp NULL, \`paused_duration_hours\` float NOT NULL DEFAULT '0', \`last_heartbeat\` timestamp NULL, \`auto_paused\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`estimated_time\` float NOT NULL, \`dueDate\` datetime NULL, \`priority\` enum ('low', 'medium', 'high') NOT NULL DEFAULT 'medium', \`status\` enum ('todo', 'in_progress', 'completed') NOT NULL DEFAULT 'todo', \`progress\` int NOT NULL DEFAULT '0', \`project_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`deadline\` datetime NULL, \`priority\` enum ('low', 'medium', 'high') NOT NULL DEFAULT 'medium', \`detail_depth\` enum ('minimal', 'normal', 'detailed') NOT NULL DEFAULT 'normal', \`status\` enum ('planning', 'in_progress', 'delayed', 'completed') NOT NULL DEFAULT 'planning', \`estimated_time\` float NOT NULL, \`accuracy_rating\` float NOT NULL DEFAULT '0', \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tech_stacks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`category\` enum ('frontend', 'backend', 'database', 'devops', 'mobile') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ed42032091d26293136b63a01d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_tech_stacks\` (\`user_id\` int NOT NULL, \`tech_id\` int NOT NULL, \`proficiency_level\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`user_id\`, \`tech_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ai_insights\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`type\` enum ('time_accuracy', 'productivity_pattern', 'task_breakdown', 'tech_performance') NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('Web Developer', 'Mobile Developer', 'Backend Developer', 'Fullstack Developer', 'Software Engineer') NOT NULL DEFAULT 'Software Engineer', \`experience_level\` enum ('beginner', 'intermediate', 'expert') NOT NULL DEFAULT 'intermediate', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` ADD CONSTRAINT \`FK_96e8f764e599e3ac4e7725d479c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` ADD CONSTRAINT \`FK_e17330186abd1eaae651f6c1139\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_9eecdb5b1ed8c7c2a1b392c28d4\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_bd55b203eb9f92b0c8390380010\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_tech_stacks\` ADD CONSTRAINT \`FK_901f0a188a48cea3dfe6b1330ee\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_tech_stacks\` ADD CONSTRAINT \`FK_554f7c46630ca7b38058f8dc337\` FOREIGN KEY (\`tech_id\`) REFERENCES \`tech_stacks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ai_insights\` ADD CONSTRAINT \`FK_4b982463f329037b4b7d2b4cde6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ai_insights\` DROP FOREIGN KEY \`FK_4b982463f329037b4b7d2b4cde6\``);
        await queryRunner.query(`ALTER TABLE \`user_tech_stacks\` DROP FOREIGN KEY \`FK_554f7c46630ca7b38058f8dc337\``);
        await queryRunner.query(`ALTER TABLE \`user_tech_stacks\` DROP FOREIGN KEY \`FK_901f0a188a48cea3dfe6b1330ee\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_bd55b203eb9f92b0c8390380010\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_9eecdb5b1ed8c7c2a1b392c28d4\``);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` DROP FOREIGN KEY \`FK_e17330186abd1eaae651f6c1139\``);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` DROP FOREIGN KEY \`FK_96e8f764e599e3ac4e7725d479c\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`ai_insights\``);
        await queryRunner.query(`DROP TABLE \`user_tech_stacks\``);
        await queryRunner.query(`DROP INDEX \`IDX_ed42032091d26293136b63a01d\` ON \`tech_stacks\``);
        await queryRunner.query(`DROP TABLE \`tech_stacks\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP TABLE \`time_trackings\``);
    }

}
