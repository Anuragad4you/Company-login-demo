let schemaConfig = {
    schema : 'company-login',
    
    /**
     * @param {string} schema
     */
    set schemaSetter(schema) {
        this.schema = schema;
    },

    get schemaGetter() {
        return this.schema;
    }
}

module.exports = schemaConfig;