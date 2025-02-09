/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1727619287695 implements MigrationInterface {
    name = 'InitialSetup1727619287695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("points" json NOT NULL, "title" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call" ("text" character varying, "emotional_tone" character varying, "location" character varying, "analysed" boolean NOT NULL DEFAULT false, "transcribed" boolean NOT NULL DEFAULT false, "audio_url" character varying NOT NULL, "name" character varying NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call_categories_category" ("callId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_ca087b3a4a3447add469edccdb7" PRIMARY KEY ("callId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ebd922801ebda8f8ef1710068b" ON "call_categories_category" ("callId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eac2a895ab053bfee9e9107365" ON "call_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "call_categories_category" ADD CONSTRAINT "FK_ebd922801ebda8f8ef1710068b9" FOREIGN KEY ("callId") REFERENCES "call"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "call_categories_category" ADD CONSTRAINT "FK_eac2a895ab053bfee9e9107365f" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_categories_category" DROP CONSTRAINT "FK_eac2a895ab053bfee9e9107365f"`);
        await queryRunner.query(`ALTER TABLE "call_categories_category" DROP CONSTRAINT "FK_ebd922801ebda8f8ef1710068b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eac2a895ab053bfee9e9107365"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ebd922801ebda8f8ef1710068b"`);
        await queryRunner.query(`DROP TABLE "call_categories_category"`);
        await queryRunner.query(`DROP TABLE "call"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
