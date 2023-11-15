import { Strategy as LocalStrategy } from "passport-local";
import { openDb } from "./configDB.js";

export const getUserByNameFromDB = async (name) => {
    const db = await openDb();
    const user = await db.get("SELECT * FROM Person WHERE name=?", [name]);
    return user;
};

const getUserByIdFromDB = async (id) => {
    const db = await openDb();
    const user = await db.get("SELECT * FROM Person WHERE id = ?", [id]);
    return user;
};




function initialize(passport) {
    const authenticateUsers = async (username, password, done) => {
        try {
            const person = await getUserByNameFromDB(username); // Adicionado await aqui
            if (!person) {
                return done(null, false, { message: "No user found with that name" });
            }

            if (password === person.password) {
                return done(null, person);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (e) {
            console.error(e);
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUsers));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const person = await getUserByIdFromDB(id);
            done(null, person);
        } catch (e) {
            console.error(e);
            done(e);
        }
    });
}

export default initialize;
