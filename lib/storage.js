const STORAGE_KEY = 'smilu_user_data';

export const INITIAL_USER_DATA = {
  username: '',
  avatar: '🐒',
  gender: 'male',
  elo: 1200,
  coins: 0,
  streak: 0,
  lastActivityDate: null,
  skillLevel: 'Intermediate',
  matches: { total: 0, wins: 0, losses: 0, draws: 0 },
  performance: {
    blitz: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
    mixed: { correct: 0, total: 0 }
  },
  createdAt: new Date().toISOString()
};

export function getUserData() {
  if (typeof window === 'undefined') return INITIAL_USER_DATA;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUserData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('smilu_data_updated'));
}

export function initializeUser(username, avatar, initialElo, skillLevel, gender) {
  const newUser = {
    ...INITIAL_USER_DATA,
    username,
    avatar,
    elo: initialElo,
    skillLevel,
    gender,
    createdAt: new Date().toISOString()
  };
  saveUserData(newUser);
  return newUser;
}

export function updateMatchStats(results) {
  const data = getUserData() || INITIAL_USER_DATA;
  const { isWin, isDraw, eloDelta, category, questionsAnswered, questionsCorrect } = results;

  // 1. ELO & Matches
  data.elo = Math.max(0, data.elo + eloDelta);
  data.matches.total += 1;
  if (isWin) {
    data.matches.wins += 1;
    data.coins += 20; // 20 coins for win
  } else if (isDraw) {
    data.matches.draws += 1;
    data.coins += 10; // 10 coins for draw
  } else {
    data.matches.losses += 1;
    data.coins += 5; // 5 coins for loss
  }

  // 2. Streak Logic
  const today = new Date().toLocaleDateString();
  const lastDate = data.lastActivityDate ? new Date(data.lastActivityDate).toLocaleDateString() : null;

  let streakUpdated = false;

  if (!lastDate) {
    data.streak = 1;
    streakUpdated = true;
  } else if (today !== lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    if (lastDate === yesterdayStr) {
      data.streak += 1;
      data.coins += 50; // Bonus for keeping streak
      streakUpdated = true;
    } else {
      data.streak = 1;
      streakUpdated = true;
    }
  }

  // 3. Performance
  if (category && data.performance[category]) {
    data.performance[category].correct += questionsCorrect;
    data.performance[category].total += questionsAnswered;
  }

  data.lastActivityDate = new Date().toISOString();
  saveUserData(data);

  return { ...data, streakUpdated };
}

export function getInsights() {
  const data = getUserData();
  if (!data || data.matches.total === 0) return ["Start playing to get personalized insights!"];

  const insights = [];
  const categories = Object.keys(data.performance);
  
  let weakest = null;
  let lowestAccuracy = 1.1;

  categories.forEach(cat => {
    const stats = data.performance[cat];
    if (stats.total >= 5) {
      const accuracy = stats.correct / stats.total;
      if (accuracy < lowestAccuracy) {
        lowestAccuracy = accuracy;
        weakest = cat;
      }
    }
  });

  if (weakest) {
    if (lowestAccuracy < 0.6) {
      insights.push(`Your ${weakest.toUpperCase()} accuracy is low (${Math.round(lowestAccuracy * 100)}%). Focus on basic roots.`);
    } else {
      insights.push(`You're doing well in ${weakest.toUpperCase()}, but there's room for improvement!`);
    }
  }

  if (data.matches.wins / data.matches.total > 0.7) {
    insights.push("You're dominating! Time to push for the 1500+ Pro ranks.");
  }

  return insights;
}
