export const vocabDatabase = [
  { id: 1, word: 'Abate', type: 'blitz', options: ['Intensify', 'Decrease', 'Observe', 'Halt'], answer: 'Decrease', hint_hi: 'कम करना' },
  { id: 2, word: 'Bellicose', type: 'blitz', options: ['Peaceful', 'Aggressive', 'Loud', 'Clumsy'], answer: 'Aggressive', hint_hi: 'लड़ाकू' },
  { id: 3, word: 'Cacophony', type: 'blitz', options: ['Melody', 'Harsh Noise', 'Silence', 'Rhythm'], answer: 'Harsh Noise', hint_hi: 'कोलाहल' },
  { id: 4, word: 'Ephemeral', type: 'blitz', options: ['Temporary', 'Eternal', 'Rapid', 'Slow'], answer: 'Temporary', hint_hi: 'अल्पकालिक' },
  { id: 5, word: 'Lucid', type: 'blitz', options: ['Confusing', 'Clear', 'Dark', 'Heavy'], answer: 'Clear', hint_hi: 'स्पष्ट' },
  { id: 6, word: 'Meticulous', type: 'blitz', options: ['Careful', 'Sloppy', 'Fast', 'Angry'], answer: 'Careful', hint_hi: 'सूक्ष्म/सावधान' },
  { id: 7, word: 'Alleviate', type: 'blitz', options: ['Worsen', 'Relieve', 'Complicate', 'Analyze'], answer: 'Relieve', hint_hi: 'कम करना' },
  { id: 8, word: 'Candid', type: 'blitz', options: ['Secretive', 'Frank', 'Deceptive', 'Quiet'], answer: 'Frank', hint_hi: 'स्पष्टवादी' },
  { id: 9, word: 'Diligent', type: 'blitz', options: ['Lazy', 'Hardworking', 'Careless', 'Passive'], answer: 'Hardworking', hint_hi: 'परिश्रमी' },
  { id: 10, word: 'Erudite', type: 'blitz', options: ['Ignorant', 'Scholarly', 'Foolish', 'Simple'], answer: 'Scholarly', hint_hi: 'विद्वान' },
  { id: 11, word: 'Burn Midnight Oil', type: 'logic', options: ['To waste fuel', 'To work late into night', 'To start a fire', 'To be angry'], answer: 'To work late into night', hint_hi: 'देर रात तक काम करना' },
  { id: 12, word: 'A person who hates mankind', type: 'logic', options: ['Philanthropist', 'Misanthrope', 'Extrovert', 'Optimist'], answer: 'Misanthrope', hint_hi: 'मानवद्वेषी' },
  { id: 13, word: 'Hit the roof', type: 'logic', options: ['Repair a house', 'Reach the top', 'Become extremely angry', 'Go to sleep'], answer: 'Become extremely angry', hint_hi: 'बहुत गुस्सा होना' },
  { id: 14, word: 'One who knows everything', type: 'logic', options: ['Omnipresent', 'Omnipotent', 'Omniscient', 'Ignorant'], answer: 'Omniscient', hint_hi: 'सर्वज्ञ' },
  { id: 15, word: 'Bite the bullet', type: 'logic', options: ['Taste metal', 'Face a difficult situation', 'Start a fight', 'Run away'], answer: 'Face a difficult situation', hint_hi: 'कठिन परिस्थिति का सामना करना' },
  { id: 16, word: 'A remedy for all diseases', type: 'logic', options: ['Antibiotic', 'Panacea', 'Placebo', 'Vaccine'], answer: 'Panacea', hint_hi: 'रामबाण' },
  { id: 17, word: 'Spill the beans', type: 'logic', options: ['Drop food', 'Reveal a secret', 'Make a mess', 'Start cooking'], answer: 'Reveal a secret', hint_hi: 'रहस्य खोलना' },
  { id: 18, word: 'A place where coins are made', type: 'logic', options: ['Bank', 'Mint', 'Treasury', 'Factory'], answer: 'Mint', hint_hi: 'टकसाल' },
  { id: 19, word: 'Piece of cake', type: 'logic', options: ['A sweet dessert', 'Something very easy', 'A small portion', 'A reward'], answer: 'Something very easy', hint_hi: 'बहुत आसान काम' },
  { id: 20, word: 'Study of ancient things', type: 'logic', options: ['Biology', 'Archaeology', 'History', 'Geology'], answer: 'Archaeology', hint_hi: 'पुरातत्व' },
];

export const getMatchQuestions = (mode = 'mixed') => {
  let pool = [...vocabDatabase];
  if (mode === 'blitz') pool = pool.filter(q => q.type === 'blitz');
  if (mode === 'logic') pool = pool.filter(q => q.type === 'logic');
  
  // Shuffle and take up to 10
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};
