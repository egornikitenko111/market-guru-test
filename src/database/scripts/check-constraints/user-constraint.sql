ALTER TABLE "users" ADD CONSTRAINT "CHK_user_props" CHECK ("phone" <> NULL OR "email" <> NULL);
