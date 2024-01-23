const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient


prisma.passager.create({
  data: {
    
    nom_passager: 'Mounguengui',
    prenom_passager: 'lucette',
    numero_de_telephone: '076328520',
    mot_de_passe: 'luce1219',
    photo_passager: 'image',
  }
}).then(result => {
    console.log(result);
  }).catch(error => {
    console.error(error);
  }).finally(async () => {
    await prisma.$disconnect();
  });
prisma.passager.findMany().then(console.log)


// prisma
require('dotenv').config();


