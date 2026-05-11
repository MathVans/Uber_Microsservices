import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTrip1778511125083 implements MigrationInterface {
    name = 'InitTrip1778511125083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."trip_status_enum" AS ENUM('requested', 'accepted', 'in_progress', 'completed', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "trip" ("id" character varying(36) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "origin" text NOT NULL, "destination" text NOT NULL, "distanceInMeters" integer NOT NULL, "durationInSeconds" integer NOT NULL, "passengerId" character varying(36) NOT NULL, "driverId" character varying(36), "status" "public"."trip_status_enum" NOT NULL DEFAULT 'requested', "estimatedPrice" numeric(10,2), "finalPrice" numeric(10,2), CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_trip_status" ON "trip" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_trip_driver_id" ON "trip" ("driverId") `);
        await queryRunner.query(`CREATE INDEX "idx_trip_passenger_id" ON "trip" ("passengerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_trip_passenger_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trip_driver_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trip_status"`);
        await queryRunner.query(`DROP TABLE "trip"`);
        await queryRunner.query(`DROP TYPE "public"."trip_status_enum"`);
    }

}
