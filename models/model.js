const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:db');


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_current_location: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});
const Message = sequelize.define('mesasage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    id_from: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_image: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    // time: {
    //     type: ,
    //     allowNull: false
    // },
    id_conversation: {
        type: Sequelize.INTEGER
    }
});

const Location = sequelize.define('location', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    latitude: {
        type: Sequelize.REAL,
        allowNull: false
    },
    longitude: {
        type: Sequelize.REAL,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

const Image = sequelize.define('image', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    image: {
        type: Sequelize.BLOB('long'),
        allowNull: false
    }
});

const Conversation = sequelize.define('conversation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


const Participation = sequelize.define('participation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    id_user: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_conversation: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// foreign keys
User.belongsTo(Location, {
   foreignKey: 'id_current_location',
   targetKey: 'id'
});
Message.belongsTo(User, {
    foreignKey: 'id_from',
    targetKey: 'id'
});
Message.belongsTo(Image, {
    foreignKey: 'id_image',
    targetKey: 'id'
});
Message.belongsTo(Conversation, {
    foreignKey: 'id_conversation',
    targetKey: 'id'
});
Participation.belongsTo(User, {
    foreignKey: 'id_user',
    targetKey: 'id'
});
Participation.belongsTo(Conversation, {
    foreignKey: 'id_conversation',
    targetKey: 'id'
});


const createTables = function() {

    sequelize.sync({ logging: console.log }).then(fullfil => {

        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');

            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

    });
};

module.exports.User = User;
module.exports.Conversation = Conversation;
module.exports.Message = Message;
module.exports.Participation = Participation;
module.exports.Location = Location;
module.exports.Image = Image;

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
module.exports.createTables = createTables;