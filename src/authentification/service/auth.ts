// @ts-nocheck
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UsersModel} from '../../server/db/models/user';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// passport.deserializeUser((id, done) => {
//     if (mongoose.Types.ObjectId.isValid(id)) {
//         User.findById(id, (err, user) => {
//             done(err, user);
//         });
//     } else {
//         done({}, {});
//     }
// });

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        UsersModel.findOne({ email: email.toLowerCase() }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, 'Invalid Credentials');
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, 'Invalid credentials.');
            });
        });
    })
);

export function signup({ name, surname, residence, email, password, req }) {
    const user = new UsersModel({ name, surname, residence, email, password });
    if (!email || !password) {
        throw new Error('You must provide an email and password.');
    }

    return UsersModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                throw new Error('Email in use');
            }
            return user.save();
        })
        .then(user => {
            return new Promise((resolve, reject) => {
                req.logIn(user, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve(user);
                });
            });
        });
}

export function login({ email, password, req }) {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user) => {
            if (!user) {
                reject('Invalid credentials.');
            }

            req.login(user, () => resolve(user));
        })({
            body: { email, password },
            request: { body: { email, password } },
            set: () => {},
        });
    });
}
