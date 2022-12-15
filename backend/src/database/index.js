import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';
import glob from 'glob';

import seed from './seeds';

const models = {
    User: null,
};

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { DB_PORT, DB_USER, DB_NAME, DB_PASSWORD, DB_HOST, DB_SOCKET_PATH, DB_DIALECT } = process.env;

const dbDialect = DB_DIALECT?.toLowerCase() || 'mysql';

let config = {};

if (dbDialect === 'postgres') {
    config = {
        dialect: 'postgres',
        dialectModule: pg,
    };
} else {
    config = {
        dialect: 'mysql',
    };
}

const initializeDatabaseConnection = async () => {
    const options = {
        host: DB_HOST,
        port: DB_PORT,
        ...config,
        dialectOptions: {
            supportBigNumbers: true,
            bigNumberStrings: true,
        },
    };
    if (DB_SOCKET_PATH) {
        options['dialectOptions']['socketPath'] = DB_SOCKET_PATH;
    }
    let sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, options);
    await sequelize.authenticate();
    return sequelize;
};

const initModels = async (sequelize) => {
    try {
        return new Promise((resolve, reject) => {
            const modelsDirectory = __dirname + '/models/';
            glob(modelsDirectory + '/**/*.model.js', function (err, files) {
                if (err) return reject(err);
                files
                    .filter((fileName) => {
                        return fileName.indexOf('.') !== 0 && fileName.slice(-9) === '.model.js' && fileName !== 'index.js';
                    })
                    .forEach((fileName) => {
                        const modelFile = require(path.join(fileName));
                        if (typeof modelFile.default === 'function') {
                            const model = modelFile.default(sequelize);
                            models[model.name] = model;
                        }
                    });

                sequelize.sync();
                models['_sequelize'] = sequelize;
                return resolve(models);
            });
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

const getModels = () => models;

const seedDatabase = seed.run;

export { initializeDatabaseConnection, seedDatabase, initModels, getModels };
