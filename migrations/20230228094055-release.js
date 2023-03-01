'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        provider: {
            type: Sequelize.STRING,
            allowNull: false
        },
        community: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    await queryInterface.createTable('notification_channel', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        channel_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        platform: {
            type: Sequelize.STRING,
            allowNull: false
        },
        provider: {
            type: Sequelize.STRING,
            allowNull: false
        },
        community: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    await queryInterface.createTable('twitter_clients', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        consumer_key: {
            type: Sequelize.STRING,
            allowNull: false
        },
        consumer_secret: {
            type: Sequelize.STRING,
            allowNull: false
        },
        access_token: {
            type: Sequelize.STRING,
            allowNull: false
        },
        access_token_secret: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bearer_token: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('articles');
    await queryInterface.dropTable('notification_channel');
    await queryInterface.dropTable('twitter_clients');
  }
};
