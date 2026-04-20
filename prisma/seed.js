const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const initialVocab = require('../real_vocab.json');

async function main() {
  console.log('Clearing old data...');
  await prisma.vocabQuestion.deleteMany();

  console.log(`Seeding ${initialVocab.length} real vocabularies...`);
  for (const q of initialVocab) {
    await prisma.vocabQuestion.create({
      data: {
        word: q.word,
        type: q.type,
        options: JSON.stringify(q.options),
        answer: q.answer,
        hint_hi: q.hint_hi
      }
    });
  }

  console.log('Database successfully seeded with real vocabularies!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
