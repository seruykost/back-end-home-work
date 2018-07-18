module.exports = {
    app: {
        name: 'myKoajsApp',
        version: '0.1.0'
    },
    server: {
        port: 8081
    },
    template: {
        path: 'app/views',
        options: {
            extension: 'ect',
            cache: false
        }
    },
    session: {
        secretKey: 'myKoajsSecretKey'
    },
    memcached: {
        server: '127.0.0.1:11211'
    }
};