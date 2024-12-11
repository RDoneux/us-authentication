import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733925191951 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS tokens (
                id VARCHAR(38) PRIMARY KEY NOT NULL,
                token VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()            )    
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS tokens`);
    }

}
