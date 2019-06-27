const fs = require('fs');
const orm = require('../models/model');


const getUserID = async function (user) {
    const result = await orm.User.findAll({
        where: {
            username: user
        },
        limit: 1
    }).then(user => {
        return user;
    });
    return result[0].dataValues.id;
};
const getUsername = async function (user_id) {
    const result = await orm.User.findAll({
        where: {
            id: user_id
        },
        limit: 1
    }).then( user => {
        return user;
    }).catch(err => {
        console.log(err);
    });
    return result[0].dataValues.username;
};


const verifyUser = async function (user, password) {
    return true;
};


const generateConversationName = async function (user_ids) {
    let usernames = user_ids.map(async function (id) {
        const username = await getUsername(id);
        return username;
    });
    return Promise.all(usernames).then((completed) => {
        let names = "";
        completed.forEach(name => {
            names += name + " ";
        });
        console.log("IME: ", names, " ZA: ", user_ids);
        return names;
    })
};


const getCurrentUserLocations = async function () {
    return await orm.sequelize.query(
        'SELECT U.id, username, latitude, longitude, title, description ' +
        'FROM users U INNER JOIN locations L ' +
        'ON U.id_current_location = L.id'
    ).then( result => {
        console.log(result);
        return result[0];
    })
};

const addLocation = async function (location) {
    return await orm.Location.create({
        latitude: location.latitude,
        longitude: location.longitude,
        title: location.title,
        description: location.description
    }).then(result => {
        return result.dataValues.id; //ima result.id
    }).catch( err => {
        return console.log(err.message);
    });
};


const getAllConversationsForUser = async function (user) {
    const user_id = await getUserID(user);
    const conversation_models = await orm.sequelize.query(
        'SELECT * FROM conversations C ' +
        'WHERE EXISTS (' +
            'SELECT * FROM participations P ' +
            'WHERE P.id_conversation = C.id ' +
            'AND P.id_user = ?)',
        {
            replacements: [user_id]
        }
    ).then(results => {
        return results;
    });
    console.log(conversation_models);
    return conversation_models;
};


const getUsersParticipatingInConversation = async function (conversation_id) {
    orm.Participation.findAll({
        where: {
            id_conversation: conversation_id
        }
    }).then(rows => {
        console.log(rows);
        return rows;
    })
};

// const getConversationID = async function (id_user1, id_user2) {
//     orm.sequelize.query(
//         'SELECT * FROM participations P1, participations P2' +
//         'WHERE P1.id_conversation = P2.id_conversation AND' +
//         'P1.id_user = ? AND P2.id_user = ? AND' +
//         'P1.id_conversation IS NULL',
//         {
//             replacements: [id_user1, id_user2],
//             type: orm.sequelize.QueryTypes.SELECT
//         }
//     ).then(participations => {
//         // odabere se prava participacija
//         // ?? logika ??
//
//     })
// };


const startConversation = async function (user_ids, name) {

    // kreacija grupnog chata sa navedenim userima, yey

    const conversation = await orm.Conversation.create({
        name: name
    }).then(result => {
        return result;
    });

    const id_conversation = conversation.id;
    user_ids.forEach(async function (id_user) {
        const par = await addParticipation(id_user, id_conversation);
        if(par){
            // ide lepo brate
        }
    });
    return id_conversation;

    //hendlati izuzetke eventualno brt
};


const getAllUsers = async function () {
    return await orm.User
        .findAll()
        .then( rows => {
            var users = [];
            rows.forEach(function (row) {
                users.push(row.dataValues.id);
            });
            return users;
        });
};

const addUser = async function (username, password) {
    return await orm.User.create({
        username: username,
        password: password,
        id_current_location: null
    }).then( result => {
        return result.dataValues.id;
    }).catch(err => {
        return console.log(err.message + err);
    });
};

const generateConversations = async function (main_user_id) {
    const user_ids = await getAllUsers();

    user_ids.forEach(async function (user_id) {
        var list = [main_user_id, user_id];
        const name = await generateConversationName(list);
        console.log(name);
        if(await startConversation(list, name)){

        }
    });
};

const updateUserLocation = async function (username, location) {
    const user_id = await getUserID(username);
    const new_location_id = await addLocation(location);

    return await orm.User.update({
        id_current_location: new_location_id
    }, {
        where: {
            id: user_id
        }
    }).then(rowsUpdated => {
        console.log(rowsUpdated);
        return new_location_id;
    }).catch(err => {
        return console.log(err.message);
    })
};

const addImage = async function (image_path) {
    if(image_path){
        const image_data = fs.readFileSync(image_path);
        return await orm.Image.create({
            image: image_data
        }).then(image => {
            return image.dataValues.id;
        });
    } else {
        return null;
    }
};

const addMessage = async function (id_user, text, image_path, conversation_id) {
    return await orm.Message.create({
        id_from: id_user,
        text: text,
        image_path: await addImage(image_path),
        id_conversation: conversation_id
    }).then(result => {
        return result.dataValues.id;
    });
};

const addParticipation = async function (id_user, id_conversation) {
    return await orm.Participation.create({
        id_user: id_user,
        id_conversation: id_conversation
    }).then(result => {
        return result.dataValues.id;
    });
};

const getAllMessagesFromConversation = async function(id_conversation){
    return await orm.Message.findAll({
        where: {
            id_conversation: id_conversation
        }
    }).then(result => {
        return result;

        // udji u dataValues po atribute
    });
};

module.exports = {
    "addUser": addUser,
    "addMessage": addMessage,
    "addParticipation": addParticipation,
    "addImage": addImage,
    "addLocation": addLocation,

    "startConversation": startConversation,
    "getUsersParticipatingInConversation": getUsersParticipatingInConversation,
    "getUserID": getUserID,
    "verifyUser": verifyUser,
    "updateUserLocation": updateUserLocation,
    "getAllUsers": getAllUsers,
    "getAllConversationsForUser": getAllConversationsForUser,
    "getCurrentUserLocations": getCurrentUserLocations,
    "getAllMessagesFromConversation": getAllMessagesFromConversation,

    "generateConversations": generateConversations
};