export default () => ({
    environnment: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || '27017'
    },
})