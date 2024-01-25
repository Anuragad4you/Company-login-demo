let dbConfig = {};

exports.dbSetter = (config) => {
    dbConfig = config;
    console.log(dbConfig);
};

exports.dbGetter = () => {
    return dbConfig;
}