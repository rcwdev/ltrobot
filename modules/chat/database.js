const fs = require("fs");
const fetch = require("node-fetch");

let config = JSON.parse(fs.readFileSync("./storage/chat/database/config.json").toString());
let db;

function getCommands() {
    fetch(config.url + "commands", {
        method: "GET",
        headers: {
            "x-apikey": config.api_key
        }
    })
    .catch(err => { if (err) throw err })
    .then(res => res.json())
    .then(body => { db = body })
}

getCommands();

module.exports.list = () => {
    if (!db) { return null } else { return db }
};

module.exports.create = (data) => {
    fetch(config.url + "commands", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": config.api_key
        },
        body: JSON.stringify(data)
    })
    .catch(err => { if (err) throw err })
    .then(res => res.json())
    .then(body => {
        let x = {
            "_id": body._id,
            "trigger": body.trigger,
            "response": body.response,
            "enabled": body.enabled,
            "created-by": body["created-by"],
            "edited-by": undefined
        };
        db.push(x);
    })
};

module.exports.remove = (id) => {
    fetch(config.url + "commands" + "/" + id, {
        method: "DELETE",
        headers: {
            "x-apikey": config.api_key
        }
    })
    .catch(err => { if (err) throw err })

    db.forEach((c, i) => { if (c._id === id) { db.splice(i, 1) } });
};

module.exports.update = (id, data) => {
    fetch(config.url + "commands" + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": config.api_key
        },
        body: JSON.stringify(data)
    })
    .catch(err => { if (err) throw err })
};

module.exports.refresh = () => {
    getCommands()
}