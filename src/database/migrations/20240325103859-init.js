"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                "users",
                {
                    id: {
                        allowNull: false,
                        primaryKey: true,
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                    },
                    firstName: {
                        field: "first_name",
                        allowNull: false,
                        type: Sequelize.STRING(70),
                    },
                    lastName: {
                        field: "last_name",
                        allowNull: false,
                        type: Sequelize.STRING(70),
                    },
                    middleName: {
                        field: "middle_name",
                        allowNull: false,
                        type: Sequelize.STRING(70),
                    },
                    email: {
                        unique: true,
                        allowNull: true,
                        type: Sequelize.STRING(255),
                    },
                    phone: {
                        unique: true,
                        allowNull: true,
                        type: Sequelize.STRING(20),
                    },
                    password: {
                        allowNull: false,
                        type: Sequelize.STRING(100),
                    },
                    createdAt: {
                        field: "created_at",
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        field: "updated_at",
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                },
                { transaction: t }
            );

            await queryInterface.createTable(
                "user_sessions",
                {
                    id: {
                        allowNull: false,
                        primaryKey: true,
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                    },
                    userId: {
                        type: Sequelize.UUID,
                        field: "user_id",
                        allowNull: false,
                        unique: true,
                        references: {
                            key: "id",
                            model: "users",
                        },
                        onDelete: "CASCADE",
                    },
                    accessToken: {
                        field: "access_token",
                        allowNull: false,
                        type: Sequelize.STRING(300),
                    },
                    refreshToken: {
                        field: "refresh_token",
                        allowNull: false,
                        type: Sequelize.STRING(300),
                    },
                    createdAt: {
                        field: "created_at",
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        field: "updated_at",
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                },
                { transaction: t }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE IF EXISTS "users" ADD CONSTRAINT "CHK_user_props" CHECK ("phone" <> NULL OR "email" <> NULL);`,
                { transaction: t }
            );
            await queryInterface.sequelize.query(
                `CREATE INDEX IF NOT EXISTS "IX_user_fullname" ON "users" ("first_name","last_name","middle_name");`,
                { transaction: t }
            );
            await queryInterface.sequelize.query(
                `CREATE INDEX IF NOT EXISTS "IX_user_phone" ON "users" ("phone");`,
                { transaction: t }
            );
            await queryInterface.sequelize.query(
                `CREATE INDEX IF NOT EXISTS "IX_user_email" ON "users" ("email");`,
                { transaction: t }
            );
            await queryInterface.sequelize.query(
                `CREATE INDEX IF NOT EXISTS "IX_user_session" ON "user_sessions" ("user_id");`,
                { transaction: t }
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.dropAllTables({ transaction: t });
            await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "IX_user_fullname";`, {
                transaction: t,
            });
            await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "IX_user_phone";`, {
                transaction: t,
            });
            await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "IX_user_email";`, {
                transaction: t,
            });
            await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "IX_user_session";`, {
                transaction: t,
            });
        });
    },
};

