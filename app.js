const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient

prisma.passager.findMany().then(console.log)


// prisma
require('dotenv').config();



module.exports = { prisma };
