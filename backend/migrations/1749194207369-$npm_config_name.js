/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class $npmConfigName1749194207369 {
    name = ' $npmConfigName1749194207369'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar NOT NULL,
                "overview" text,
                "poster_path" varchar,
                "genre_ids" text,
                "vote_average" float,
                "type" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "year",
                    "overview",
                    "poster_path",
                    "genre_ids",
                    "vote_average",
                    "type"
                )
            SELECT "id",
                "title",
                "year",
                "overview",
                "poster_path",
                "genre_ids",
                "vote_average",
                "type"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar,
                "overview" text,
                "poster_path" varchar,
                "genre_ids" text,
                "vote_average" float,
                "type" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "title",
                    "year",
                    "overview",
                    "poster_path",
                    "genre_ids",
                    "vote_average",
                    "type"
                )
            SELECT "id",
                "title",
                "year",
                "overview",
                "poster_path",
                "genre_ids",
                "vote_average",
                "type"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar NOT NULL,
                "overview" text,
                "poster_path" varchar,
                "genre_ids" text,
                "vote_average" float,
                "type" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "year",
                    "overview",
                    "poster_path",
                    "genre_ids",
                    "vote_average",
                    "type"
                )
            SELECT "id",
                "title",
                "year",
                "overview",
                "poster_path",
                "genre_ids",
                "vote_average",
                "type"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" varchar NOT NULL,
                "overview" text,
                "poster_path" varchar,
                "genre_ids" text,
                "vote_average" float,
                "type" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "title",
                    "year",
                    "overview",
                    "poster_path",
                    "genre_ids",
                    "vote_average",
                    "type"
                )
            SELECT "id",
                "title",
                "year",
                "overview",
                "poster_path",
                "genre_ids",
                "vote_average",
                "type"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
