import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'mixed';
  
  try {
    // Optimized raw SQLite query for instantly picking 10 random questions out of massive sets
    let query = `SELECT * FROM VocabQuestion ORDER BY RANDOM() LIMIT 10`;
    
    // New structured modes
    if (mode === 'synonyms') query = `SELECT * FROM VocabQuestion WHERE category = 'synonym' ORDER BY RANDOM() LIMIT 10`;
    else if (mode === 'antonyms') query = `SELECT * FROM VocabQuestion WHERE category = 'antonym' ORDER BY RANDOM() LIMIT 10`;
    else if (mode === 'idioms') query = `SELECT * FROM VocabQuestion WHERE category = 'idiom' ORDER BY RANDOM() LIMIT 10`;
    else if (mode === 'ows') query = `SELECT * FROM VocabQuestion WHERE category = 'ows' ORDER BY RANDOM() LIMIT 10`;
    
    // Legacy fallback
    else if (mode === 'blitz') query = `SELECT * FROM VocabQuestion WHERE type = 'blitz' ORDER BY RANDOM() LIMIT 10`;
    else if (mode === 'logic') query = `SELECT * FROM VocabQuestion WHERE type = 'logic' ORDER BY RANDOM() LIMIT 10`;
    
    const questionsRaw = await prisma.$queryRawUnsafe(query);
    
    // Parse the JSON string options stored in the database
    const questions = questionsRaw.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
