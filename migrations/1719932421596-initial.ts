import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1719932421596 implements MigrationInterface {
    name = 'Initial1719932421596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "time" TIME NOT NULL, "day" integer NOT NULL, "classId" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" text NOT NULL, "tokensId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_cd4405df19c3015591efcc6809" UNIQUE ("tokensId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sport" character varying NOT NULL, "description" character varying NOT NULL, "duration" integer NOT NULL, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_classes_class" ("userId" integer NOT NULL, "classId" integer NOT NULL, CONSTRAINT "PK_5f1ccc7726b555b30184d3e6d1b" PRIMARY KEY ("userId", "classId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd13c4a1a466583651760db61b" ON "user_classes_class" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_71879270b4bca61b330038d6cf" ON "user_classes_class" ("classId") `);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_08aac4a7aad6819197a8ba8f3e8" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd4405df19c3015591efcc6809b" FOREIGN KEY ("tokensId") REFERENCES "tokens"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_classes_class" ADD CONSTRAINT "FK_fd13c4a1a466583651760db61ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_classes_class" ADD CONSTRAINT "FK_71879270b4bca61b330038d6cff" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_classes_class" DROP CONSTRAINT "FK_71879270b4bca61b330038d6cff"`);
        await queryRunner.query(`ALTER TABLE "user_classes_class" DROP CONSTRAINT "FK_fd13c4a1a466583651760db61ba"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd4405df19c3015591efcc6809b"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_08aac4a7aad6819197a8ba8f3e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71879270b4bca61b330038d6cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd13c4a1a466583651760db61b"`);
        await queryRunner.query(`DROP TABLE "user_classes_class"`);
        await queryRunner.query(`DROP TABLE "class"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
