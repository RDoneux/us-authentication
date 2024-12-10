import { MigrationInterface, QueryRunner } from 'typeorm';

export class V10_SETUPEVENTSCHEMA1733245587326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(38) PRIMARY KEY NOT NULL,
                event_date TIMESTAMP NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS events`);
  }
}
