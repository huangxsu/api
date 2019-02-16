module.exports = {
    apps: [{
        name: 'API',
        script: 'index.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: 1,
        watch: ['src', 'index.js'],
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

};
