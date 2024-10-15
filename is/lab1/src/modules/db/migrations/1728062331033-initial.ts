/* eslint-disable @cspell/spellchecker -- migrations file */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1728062331033 implements MigrationInterface {
  name = 'Initial1728062331033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "product_characteristic" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "value" character varying NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_c04dc21acc7e299b94b08b5ebcf" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."product_status_enum" AS ENUM(\'new\', \'discontinued\')',
    );
    await queryRunner.query(
      'CREATE TABLE "product" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "productInternalId" character varying NOT NULL, "categoryId" integer, "subCategoryId" integer, "subSubCategoryId" integer, "description" text, "specificationDoc" character varying, "isHidden" boolean NOT NULL DEFAULT false, "status" "public"."product_status_enum", CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"), CONSTRAINT "UQ_6cdb1124e46c17834442f41ff69" UNIQUE ("productInternalId"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "sub_sub_category" ("id" SERIAL NOT NULL, "subCategoryId" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "isHidden" boolean DEFAULT false, CONSTRAINT "PK_8ef528250aa5979e91e31c6cfe9" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "sub_category" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "isHidden" boolean DEFAULT false, CONSTRAINT "PK_59f4461923255f1ce7fc5e7423c" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "category" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "internal_id" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "isHidden" boolean DEFAULT false, "colors" text array NOT NULL DEFAULT \'{#1B98A7,#106169}\', "textColor" text NOT NULL DEFAULT \'#FFFFFF\', CONSTRAINT "UQ_533b0c3e19013b3a0ad199a166c" UNIQUE ("internal_id"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_status_name_enum\" AS ENUM('Bronze', 'Silver', 'Gold')",
    );
    await queryRunner.query(
      'CREATE TABLE "user_status" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" "public"."user_status_name_enum" NOT NULL, "description" character varying NOT NULL, "cost" integer NOT NULL, CONSTRAINT "UQ_db8723222112f20fa5b23e0e626" UNIQUE ("name"), CONSTRAINT "PK_892a2061d6a04a7e2efe4c26d6f" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."user_role_enum" AS ENUM(\'admin\', \'user\')',
    );
    await queryRunner.query(
      'CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "dateOfBirth" TIMESTAMP WITH TIME ZONE, "phone" character varying(255) NOT NULL, "businessName" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "country" character varying(255) NOT NULL DEFAULT \'Uk\', "postalCode" character varying(10) NOT NULL, "address" character varying(500) NOT NULL, "user_status_id" integer NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT \'user\', "device_token" character varying(255), "last_reset_points_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "point_transaction" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "amount" integer NOT NULL, "description" character varying(255) NOT NULL, "invoice_id" integer, CONSTRAINT "REL_0bbbfbc9e2723601d2643fd02c" UNIQUE ("invoice_id"), CONSTRAINT "PK_b56b792bcf7f60a32758005caf7" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"invoice_status_enum\" AS ENUM('open', 'approved', 'rejected')",
    );
    await queryRunner.query(
      'CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "status" "public"."invoice_status_enum" NOT NULL DEFAULT \'open\', "issued_at" TIMESTAMP WITH TIME ZONE, "transaction_id" integer, "rejectionReason" character varying, CONSTRAINT "REL_a32ef5f07283d881032b4fa961" UNIQUE ("transaction_id"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."claim_status_enum" AS ENUM(\'claimed\', \'shipped\')',
    );
    await queryRunner.query(
      'CREATE TABLE "claim" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reward_id" integer NOT NULL, "user_id" integer NOT NULL, "status" "public"."claim_status_enum" NOT NULL DEFAULT \'claimed\', CONSTRAINT "PK_466b305cc2e591047fa1ce58f81" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "reward" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "term_of_use" character varying, "cost" integer NOT NULL, "isHidden" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "attachment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_url" character varying NOT NULL, "category_id" integer, "reward_id" integer, "product_id" integer, "invoice_id" integer, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "reset_password_code" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_3a2d473df1ab15476d9d7c2db5d" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "logs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "record_id" integer NOT NULL, "record_title" text DEFAULT \'\', "difference" jsonb DEFAULT \'{}\', "action" character varying(128) NOT NULL, "resource" character varying(128) NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."notification_status_enum" AS ENUM(\'sent\', \'read\')',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"notification_type_enum\" AS ENUM('reward_claimed', 'reward_shipped', 'newPointTransaction', 'pointsExpirationHeads', 'pointsBurned')",
    );
    await queryRunner.query(
      'CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "message" character varying NOT NULL, "status" "public"."notification_status_enum" NOT NULL DEFAULT \'sent\', "type" "public"."notification_type_enum" NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "shop" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "location" geography(Point,4326) NOT NULL, CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "notification_attachments" ("attachment" integer NOT NULL, "notification" integer NOT NULL, CONSTRAINT "PK_6070af258f0fe4774df9afb27d4" PRIMARY KEY ("attachment", "notification"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_29587cada53aaf62176ba63df5" ON "notification_attachments" ("attachment") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ee961e52cad7238001dee8b69d" ON "notification_attachments" ("notification") ',
    );
    await queryRunner.query(
      'ALTER TABLE "product_characteristic" ADD CONSTRAINT "FK_6cae5983575408134f5d8c16361" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD CONSTRAINT "FK_463d24f6d4905c488bd509164e6" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "product" ADD CONSTRAINT "FK_8236507d7bac23e8ac4a2f31eb3" FOREIGN KEY ("subSubCategoryId") REFERENCES "sub_sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "sub_sub_category" ADD CONSTRAINT "FK_930fb77acc4e81ec8c10b8cfa7a" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "sub_category" ADD CONSTRAINT "FK_51b8c0b349725210c4bd8b9b7a7" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "user" ADD CONSTRAINT "FK_ff77973045555bbcb9290ea2bf4" FOREIGN KEY ("user_status_id") REFERENCES "user_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "point_transaction" ADD CONSTRAINT "FK_4fcd87e4271d658bed337fac5e2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "point_transaction" ADD CONSTRAINT "FK_0bbbfbc9e2723601d2643fd02c2" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "invoice" ADD CONSTRAINT "FK_c14b00795593eafc9d423e7f74d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "invoice" ADD CONSTRAINT "FK_a32ef5f07283d881032b4fa961e" FOREIGN KEY ("transaction_id") REFERENCES "point_transaction"("id") ON DELETE SET NULL ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "claim" ADD CONSTRAINT "FK_e9cdd7ba7b460d77a7dab818159" FOREIGN KEY ("reward_id") REFERENCES "reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "claim" ADD CONSTRAINT "FK_8f1b70dc4e6bd84a4f27de5b76f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" ADD CONSTRAINT "FK_e33dbeabda91be8e674ec0237b6" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" ADD CONSTRAINT "FK_bc0b37e53eeef7c063303a58153" FOREIGN KEY ("reward_id") REFERENCES "reward"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" ADD CONSTRAINT "FK_d82808707e524ee56d0e9c8fc71" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" ADD CONSTRAINT "FK_7ce49105d08d329861497ad4ae2" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "reset_password_code" ADD CONSTRAINT "FK_2e4584a1bec929e54adf8c025d7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "notification_attachments" ADD CONSTRAINT "FK_29587cada53aaf62176ba63df54" FOREIGN KEY ("attachment") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "notification_attachments" ADD CONSTRAINT "FK_ee961e52cad7238001dee8b69d2" FOREIGN KEY ("notification") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "notification_attachments" DROP CONSTRAINT "FK_ee961e52cad7238001dee8b69d2"',
    );
    await queryRunner.query(
      'ALTER TABLE "notification_attachments" DROP CONSTRAINT "FK_29587cada53aaf62176ba63df54"',
    );
    await queryRunner.query(
      'ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"',
    );
    await queryRunner.query(
      'ALTER TABLE "reset_password_code" DROP CONSTRAINT "FK_2e4584a1bec929e54adf8c025d7"',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" DROP CONSTRAINT "FK_7ce49105d08d329861497ad4ae2"',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" DROP CONSTRAINT "FK_d82808707e524ee56d0e9c8fc71"',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" DROP CONSTRAINT "FK_bc0b37e53eeef7c063303a58153"',
    );
    await queryRunner.query(
      'ALTER TABLE "attachment" DROP CONSTRAINT "FK_e33dbeabda91be8e674ec0237b6"',
    );
    await queryRunner.query(
      'ALTER TABLE "claim" DROP CONSTRAINT "FK_8f1b70dc4e6bd84a4f27de5b76f"',
    );
    await queryRunner.query(
      'ALTER TABLE "claim" DROP CONSTRAINT "FK_e9cdd7ba7b460d77a7dab818159"',
    );
    await queryRunner.query(
      'ALTER TABLE "invoice" DROP CONSTRAINT "FK_a32ef5f07283d881032b4fa961e"',
    );
    await queryRunner.query(
      'ALTER TABLE "invoice" DROP CONSTRAINT "FK_c14b00795593eafc9d423e7f74d"',
    );
    await queryRunner.query(
      'ALTER TABLE "point_transaction" DROP CONSTRAINT "FK_0bbbfbc9e2723601d2643fd02c2"',
    );
    await queryRunner.query(
      'ALTER TABLE "point_transaction" DROP CONSTRAINT "FK_4fcd87e4271d658bed337fac5e2"',
    );
    await queryRunner.query(
      'ALTER TABLE "user" DROP CONSTRAINT "FK_ff77973045555bbcb9290ea2bf4"',
    );
    await queryRunner.query(
      'ALTER TABLE "sub_category" DROP CONSTRAINT "FK_51b8c0b349725210c4bd8b9b7a7"',
    );
    await queryRunner.query(
      'ALTER TABLE "sub_sub_category" DROP CONSTRAINT "FK_930fb77acc4e81ec8c10b8cfa7a"',
    );
    await queryRunner.query(
      'ALTER TABLE "product" DROP CONSTRAINT "FK_8236507d7bac23e8ac4a2f31eb3"',
    );
    await queryRunner.query(
      'ALTER TABLE "product" DROP CONSTRAINT "FK_463d24f6d4905c488bd509164e6"',
    );
    await queryRunner.query(
      'ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"',
    );
    await queryRunner.query(
      'ALTER TABLE "product_characteristic" DROP CONSTRAINT "FK_6cae5983575408134f5d8c16361"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_ee961e52cad7238001dee8b69d"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_29587cada53aaf62176ba63df5"',
    );
    await queryRunner.query('DROP TABLE "notification_attachments"');
    await queryRunner.query('DROP TABLE "shop"');
    await queryRunner.query('DROP TABLE "notification"');
    await queryRunner.query('DROP TYPE "public"."notification_type_enum"');
    await queryRunner.query('DROP TYPE "public"."notification_status_enum"');
    await queryRunner.query('DROP TABLE "logs"');
    await queryRunner.query('DROP TABLE "reset_password_code"');
    await queryRunner.query('DROP TABLE "attachment"');
    await queryRunner.query('DROP TABLE "reward"');
    await queryRunner.query('DROP TABLE "claim"');
    await queryRunner.query('DROP TYPE "public"."claim_status_enum"');
    await queryRunner.query('DROP TABLE "invoice"');
    await queryRunner.query('DROP TYPE "public"."invoice_status_enum"');
    await queryRunner.query('DROP TABLE "point_transaction"');
    await queryRunner.query('DROP TABLE "user"');
    await queryRunner.query('DROP TYPE "public"."user_role_enum"');
    await queryRunner.query('DROP TABLE "user_status"');
    await queryRunner.query('DROP TYPE "public"."user_status_name_enum"');
    await queryRunner.query('DROP TABLE "category"');
    await queryRunner.query('DROP TABLE "sub_category"');
    await queryRunner.query('DROP TABLE "sub_sub_category"');
    await queryRunner.query('DROP TABLE "product"');
    await queryRunner.query('DROP TYPE "public"."product_status_enum"');
    await queryRunner.query('DROP TABLE "product_characteristic"');
  }
}
