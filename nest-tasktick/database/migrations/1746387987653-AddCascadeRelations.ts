import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeRelations1746387987653 implements MigrationInterface {
    name = 'AddCascadeRelations1746387987653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tech_stacks\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tech_stacks\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`start_time\` \`start_time\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`end_time\` \`end_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`duration_hours\` \`duration_hours\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`pause_time\` \`pause_time\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`last_heartbeat\` \`last_heartbeat\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`dueDate\` \`dueDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`deadline\` \`deadline\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`deadline\` \`deadline\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`dueDate\` \`dueDate\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`last_heartbeat\` \`last_heartbeat\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`pause_time\` \`pause_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`duration_hours\` \`duration_hours\` float(12) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`end_time\` \`end_time\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`time_trackings\` CHANGE \`start_time\` \`start_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tech_stacks\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`tech_stacks\` DROP COLUMN \`created_at\``);
    }

}
