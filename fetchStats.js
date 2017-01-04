'use strict';

require('dotenv').config();

const co = require('co');
const GitHub = require('github');
const fs = require('fs');

const github = new GitHub({
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com',
    headers: {
        'user-agent': 'Targos - Node.js stats'
    }
});

github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
});

co(function*() {
    const repos = yield getRepos();
    for (const repo of repos) {
        const views = yield getViews(repo.name);
        repo.viewCount = views.count;
        repo.viewUnique = views.uniques;
    }
    fs.writeFileSync('stats.json', JSON.stringify(repos, null, '  '));
});

function* getRepos() {
    let page = 1;
    let repos = [];
    while (true) {
        const list = yield github.repos.getForOrg({
            org: 'nodejs',
            type: 'public',
            page: page++,
            per_page: 100
        });
        repos.push(...list.map((repo) => {
            return {
                name: repo.name,
                stars: repo.stargazers_count,
                watchers: repo.watchers_count,
                forks: repo.forks_count
            };
        }));
        if (list.length < 100) {
            break;
        }
    }
    return repos;
}

function* getViews(repo) {
    return yield github.repos.getViews({
        owner: 'nodejs',
        repo: repo,
        page: 1
    });
}