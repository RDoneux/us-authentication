import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733952276461 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS token_clear_trigger;`);
        await queryRunner.query(`
            CREATE TRIGGER token_clear_trigger
            BEFORE INSERT ON tokens
            FOR EACH ROW
            BEGIN
                DELETE FROM tokens WHERE created_at < DATE_SUB(NOW(), INTERVAL 8 DAY);
            END;
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS token_clear_trigger;
        `);
    }

}
