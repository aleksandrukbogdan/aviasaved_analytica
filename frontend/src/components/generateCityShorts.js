const fs = require('fs');

const cities = JSON.parse(fs.readFileSync(__dirname + '/russia-cities.json', 'utf8'));

const shorts = {};
const usedShorts = new Set();

cities.forEach(city => {
  if (city.contentType === 'city') {
    let name = city.name;
    let short = name.slice(0, 3).toUpperCase();
    let origShort = short;
    let i = 1;
    while (usedShorts.has(short)) {
      short = origShort.slice(0, 2) + i;
      i++;
    }
    usedShorts.add(short);
    shorts[name] = short;
  }
});

fs.writeFileSync(__dirname + '/city-shorts.json', JSON.stringify(shorts, null, 2), 'utf8');

console.log('Сгенерировано сокращений:', Object.keys(shorts).length); 