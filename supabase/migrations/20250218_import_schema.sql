

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_credentials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "password" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_credentials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "medium_url" "text" NOT NULL,
    "author" "text" NOT NULL,
    "published_date" "date" NOT NULL,
    "featured_image_url" "text",
    "tags" "text"[] DEFAULT ARRAY[]::"text"[]
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bulletin_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "has_attachment" boolean DEFAULT false,
    "attachment_type" "text",
    "attachment_url" "text",
    "attachment_name" "text"
);


ALTER TABLE "public"."bulletin_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gallery_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "date" "date" NOT NULL,
    "image_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."gallery_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."member_social_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid" NOT NULL,
    "icon" "text" NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."member_social_links" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "position" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "batch_year" "text" DEFAULT '2024-25'::"text" NOT NULL
);


ALTER TABLE "public"."team_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "message" "text" NOT NULL,
    "image_url" "text",
    "position" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_credentials"
    ADD CONSTRAINT "admin_credentials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_credentials"
    ADD CONSTRAINT "admin_credentials_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bulletin_items"
    ADD CONSTRAINT "bulletin_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gallery_items"
    ADD CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."member_social_links"
    ADD CONSTRAINT "member_social_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_team_members_batch_year" ON "public"."team_members" USING "btree" ("batch_year");



CREATE OR REPLACE TRIGGER "update_admin_credentials_updated_at" BEFORE UPDATE ON "public"."admin_credentials" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bulletin_items_updated_at" BEFORE UPDATE ON "public"."bulletin_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_gallery_items_updated_at" BEFORE UPDATE ON "public"."gallery_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_team_members_updated_at" BEFORE UPDATE ON "public"."team_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_testimonials_updated_at" BEFORE UPDATE ON "public"."testimonials" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."member_social_links"
    ADD CONSTRAINT "member_social_links_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."team_members"("id") ON DELETE CASCADE;



CREATE POLICY "Allow insert of default admin credentials" ON "public"."admin_credentials" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Allow public read access to admin_credentials" ON "public"."admin_credentials" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow update of admin credentials" ON "public"."admin_credentials" FOR UPDATE TO "anon" USING (true);



CREATE POLICY "Enable all operations for all users" ON "public"."blog_posts" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for all users" ON "public"."bulletin_items" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for all users" ON "public"."gallery_items" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for all users" ON "public"."member_social_links" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for all users" ON "public"."team_members" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for all users" ON "public"."testimonials" USING (true) WITH CHECK (true);



ALTER TABLE "public"."admin_credentials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bulletin_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gallery_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."member_social_links" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_credentials" TO "anon";
GRANT ALL ON TABLE "public"."admin_credentials" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_credentials" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."bulletin_items" TO "anon";
GRANT ALL ON TABLE "public"."bulletin_items" TO "authenticated";
GRANT ALL ON TABLE "public"."bulletin_items" TO "service_role";



GRANT ALL ON TABLE "public"."gallery_items" TO "anon";
GRANT ALL ON TABLE "public"."gallery_items" TO "authenticated";
GRANT ALL ON TABLE "public"."gallery_items" TO "service_role";



GRANT ALL ON TABLE "public"."member_social_links" TO "anon";
GRANT ALL ON TABLE "public"."member_social_links" TO "authenticated";
GRANT ALL ON TABLE "public"."member_social_links" TO "service_role";



GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






