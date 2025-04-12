import express from 'express';
import * as teamsJson from './example-responses/teams.json';
import * as fs from 'fs';
import { ILeaderboardJson } from './update-leaderboard.ts';

const app = express();
const port = 8080;

app.get('/', async(req, res) => {
    res.send(`<p>${await getScoreboard()}</p>`);
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})

async function getScoreboard() {
    let response: string = ""

    let leaderboardFile = fs.readFileSync('leaderboard.json', 'utf8')
    let leaderboardJson = JSON.parse(leaderboardFile) as ILeaderboardJson

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
            player.position >= 54 ? response += `${player.first_name} ${player.last_name}: CUT<br>` : response += `${player.first_name} ${player.last_name}: ${player.position}<br>`
        });
        response += `<br>`
    });

    return response;
}