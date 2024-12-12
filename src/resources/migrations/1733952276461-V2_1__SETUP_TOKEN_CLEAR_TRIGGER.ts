import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733952276461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EVENT IF EXISTS token_clear_event;`);
    await queryRunner.query(`
            CREATE EVENT token_clear_event
            ON SCHEDULE EVERY 1 DAY
            DO
            BEGIN
                DELETE FROM tokens WHERE created_at < DATE_SUB(NOW(), INTERVAL 8 DAY);
            END;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS token_clear_event;
        `);
  }
}
