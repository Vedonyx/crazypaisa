import { User } from '../types';

const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

interface GameLogData {
  userId: string;
  username: string;
  game: 'Limbo' | 'Mines' | 'Blackjack';
  result: 'win' | 'lose' | 'push';
  betAmount: number;
  pointsChange: number;
  finalPoints: number;
  multiplier?: number;
}

export const sendGameLog = async (data: GameLogData) => {
  try {
    const color = data.result === 'win' ? 0x00ff00 : data.result === 'lose' ? 0xff0000 : 0xffff00;
    
    const embed = {
      title: `${data.game} Game Result`,
      color: color,
      fields: [
        {
          name: 'Player',
          value: data.username,
          inline: true
        },
        {
          name: 'Result',
          value: data.result.toUpperCase(),
          inline: true
        },
        {
          name: 'Bet Amount',
          value: `${data.betAmount} points`,
          inline: true
        },
        {
          name: 'Points Change',
          value: `${data.result === 'win' ? '+' : '-'}${Math.abs(data.pointsChange)} points`,
          inline: true
        },
        {
          name: 'Final Balance',
          value: `${data.finalPoints} points`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    if (data.multiplier) {
      embed.fields.push({
        name: 'Multiplier',
        value: `${data.multiplier}x`,
        inline: true
      });
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });
  } catch (error) {
    console.error('Failed to send game log to Discord:', error);
  }
};