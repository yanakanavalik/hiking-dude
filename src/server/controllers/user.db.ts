// @ts-nocheck

import Koa from 'koa';
import mongoose from 'mongoose';
import { UsersModel } from '../models/user';

//const url = 'mongodb://Admin:<hikingAdmin345951>@hikingdude-shard-00-00-vzz28.mongodb.net:27017,hikingdude-shard-00-01-vzz28.mongodb.net:27017,hikingdude-shard-00-02-vzz28.mongodb.net:27017/test?ssl=true&replicaSet=HikingDude-shard-0&authSource=admin&retryWrites=true&w=majority\n';
const url =
    'mongodb+srv://@hikingdude-vzz28.mongodb.net/test?retryWrites=true&w=majority';
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        user: 'Owner',
        pass: 'Owner1345951',
        dbName: 'HikingDude',
        serverSelectionTimeoutMS: 3000,
    })
    .catch(err => console.log(err.reason));

export const getUserDb = async id => await UsersModel.findOne({ _id: id });

export const addNewUser = (ctx: Koa.Context) => {
    const newUser = new UsersModel({
        name: 'Vasiliy',
        surname: 'Jhons',
        trips: [{ name: 'Trip 1' }],
    });

    newUser.save(function(err, user) {
        if (err) return console.error(err);
        console.log(user);
    });
};
