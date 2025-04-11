import express from 'express';
import fetch, { RequestInit } from 'node-fetch';
import * as teamsJson from './example-responses/teams.json';
// import * as leaderboardJson from './example-responses/leaderboardExample.json'

const api_key = 'vD3urcvxnjo9o8tBayfwbLE0mS7tRswQPDaHaK0O';

const app = express();

app.get('/', async(req, res) => {
    res.send(`<p>${await getScoreboard()}</p>`);
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})

interface IPlayer {
    id: string;
    position: number
}
interface ILeaderboardJson {
    leaderboard: IPlayer[]
}

async function getScoreboard() {
    let response: string = ""

    const test = await fetch(`https://api.sportradar.com/golf/trial/pga/v3/en/2025/tournaments/2cba1945-dc1c-4131-92f4-cfdac8c45060/leaderboard.json?api_key=${api_key}`);
    const data = await test.json()

    let leaderboardJson: ILeaderboardJson = data as ILeaderboardJson
    // console.log(data)

    teamsJson.teams.forEach(team => {
        team.players.forEach(player => {
            player.position = leaderboardJson.leaderboard.find(i => i.id === player.id)?.position || 999
        });
        team.players.sort((a, b) => a.position - b.position)
        team.team_score = team.players.slice(0, 3).reduce((a, c) => a + c.position, 0);
    });

    teamsJson.teams.sort((a, b) => a.team_score - b.team_score)

    response += `<br>`
    teamsJson.teams.forEach(team => {
        response += `${team.manager}: ${team.team_score}<br>`
        response += `----------------------------------<br>`
        team.players.forEach(player => {
            response += `${player.first_name} ${player.last_name}: ${player.position}<br>`
        });
        response += `<br>`
    });

    return response;
}