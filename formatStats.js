'use strict';

const fs = require('fs');

const stats = JSON.parse(fs.readFileSync('stats.json', 'utf8'));

stats.sort(function (stat1, stat2) {
    return stat2.viewUnique - stat1.viewUnique;
});

const result = [];


result.push('| Repo | Stars | Watchers | Forks | Total views | Unique views |');
result.push('| ---- | ----: | -------: | ----: | ----------: | -----------: |');

for (const stat of stats) {
    result.push(`| ${stat.name} | ${stat.stars} | ${stat.watchers} | ${stat.forks} | ${stat.viewCount} | ${stat.viewUnique} |`);
}

fs.writeFileSync('stats.md', result.join('\n'));
