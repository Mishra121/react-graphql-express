const bcrypt = require('bcryptjs');

const Event = require('../../models/events');
const User = require('../../models/user')
const Booking = require('../../models/booking')

const events =async eventIds => {
    try{
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
                return {
                    ...event._doc, 
                    _id: event.id, 
                    creator: user.bind(this, creator)
                };
        });
    }
    catch(err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event
                .find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try{
            const boookings = await Booking.find();
            return boookings.map(booking => {
                return { 
                    ...booking._doc, 
                    _id: booking.id,
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        }
        catch (err){
            throw err;
        }
    },
    createEvent: (args) => {
        
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date().toISOString(),
            creator: "5d32a2ef130a7725f1c8700c"
        });
        let createdEvent;
        return event
        .save()
        .then(result => {
            createdEvent = {
                ...result._doc, _id: event._doc._id.toString(),
                creator: user.bind(this, result._doc.creator)   
            };
            return User.findById('5d32a2ef130a7725f1c8700c')
        })
        .then(user => {
            if(!user) {
                throw new Error('User not found')
            }
            user.createdEvents.push(event);
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err => {
            throw err;
        });
    },
    createUser: (args) => {
        return User
        .findOne({email: args.userInput.email})
        .then(user => {
            if(user) {
                throw new Error('User exists already.')
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            return user.save();
        })
        .then(result => {
            return {...result._doc, password: null}
        })
        .catch(err => {
            throw err;
        })
    },
    bookEvent: async args => {
        
        const fetchedEvent = await Event.findOne({_id: args.eventId});

        const booking = new Booking({
            user: '5d32a2ef130a7725f1c8700c',
            event: fetchedEvent
        });

        const result = await booking.save();
        return {
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    }
}