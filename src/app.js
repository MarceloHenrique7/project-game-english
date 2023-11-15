import dotenv from "dotenv";
dotenv.config();


import express from "express";
import { openDb } from "./configDB.js";
import { insertPerson, updatePerson, addScore } from "./person.js";

const app = express()
import passport from "passport"
import initializePassport from "./passport-config.js";
import methodOverride from "method-override"
import flash from "express-flash"
import session from "express-session"
import ejs from 'ejs';



app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET || 'asdsafafgffgae',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('public'));
app.use(express.json());


initializePassport(
    passport,
    )

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'));



app.get('/', checkAuthenticated, async (req, res) => {
    try {
        const username = req.user.name;
        const rankedUsers = await getAllUserNamesFromDB();
        console.log(username);
        res.render("dashboard.ejs", { username: username, rankedUsers: rankedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/player-score', (req, res) => {
    const playerData = req.body;

    addScore(playerData)
    console.log(playerData)

    res.status(200).json({ message: 'Dados recebidos com sucesso!' });
})

app.get('/quiz', checkAuthenticated, (req, res) => {
    const username = req.user.name;
    res.render("quiz.ejs", { username: username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
});


app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
            score: 0,
        }
        const userID = await insertPerson(user);

        if (userID !== null) {
            console.log(user);
            res.redirect("/")
        } else {
            req.flash('error', 'User already exists');
            res.redirect("/register");
        }
    }catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

const getAllUserNamesFromDB = async () => {
    const db = await openDb();
    const users = await db.all("SELECT name, score FROM Person ORDER BY score DESC");
    return users;
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

app.listen(3000)