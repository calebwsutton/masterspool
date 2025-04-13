import  fetch from 'node-fetch';
import * as fs from 'fs';

interface IPlayer {
    id: string;
    position: number
}
export interface ILeaderboardJson {
    leaderboard: IPlayer[]
}

const api_key = '8u3Kbn0ce8lLfXurVGKBFT3FdbsVVq97tFdDQDLr';

async function updateLeaderBoard() {
    const test = await fetch(`https://api.sportradar.com/golf/trial/pga/v3/en/2025/tournaments/2cba1945-dc1c-4131-92f4-cfdac8c45060/leaderboard.json?api_key=${api_key}`);
    const data = await test.json()

    let leaderboardJson: ILeaderboardJson = data as ILeaderboardJson

    
    fs.writeFile('./leaderboard.json', JSON.stringify(leaderboardJson), (err) => {
        if (err) {
            console.error('Error updating file:', err);
        } else {
            console.log('File updated successfully at:', new Date().toISOString());
        }
    });
}

setInterval(updateLeaderBoard, 150000);