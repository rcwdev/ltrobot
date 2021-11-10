const fs = require("fs");
const fetch = require("node-fetch");
const moment = require("moment-timezone");

let config = JSON.parse(fs.readFileSync("./storage/chat/lastfm/config.json").toString());

exports.time = (location) => {
    let x = new Date();
    let y = moment(x);
    return y.tz(location).format("LT");
}

exports.randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

exports.lastFM = (username) => {
    return fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${config.api_key}&format=json&limit=1`)
    .catch(err => { if (err) throw err })
    .then(res => res.json())
}