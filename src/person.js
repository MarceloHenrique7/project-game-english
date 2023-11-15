import { openDb } from './configDB.js';
import { getUserByNameFromDB } from "./passport-config.js";


export async function createTable() {
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Person (id INTEGER PRIMARY KEY, name TEXT, password TEXT)')
    })
}

export async function insertPerson(person) {
    const db = await openDb();
    const userExist = await getUserByNameFromDB(person.username)

    if ( userExist ) {
        console.error('Error: User already exists ')
        return null;
        }
    const result = await db.run('INSERT INTO Person (name, password, score) VALUES (?, ?, ?)', [person.username, person.password, person.score]);
    
    if (result.lastID) {
        return result.lastID;

    }


    return null; 
}


export async function updatePerson(person) {
    openDb().then(db=>{
        db.run('UPDATE Person SET name=?, password=? WHERE id=? ', [person.username, person.password, person.id]);
    })
}


export async function updateScoreInDB(nameUser, newScore) {

    try {
        const db = await openDb();
        db.run('UPDATE Person SET score=? WHERE name=?', [newScore, nameUser]);
    } catch (error) {
        console.error('Error the update new score', error);
    }
}


export async function addScore (playerData) {
    try {
        const user = await getUserByNameFromDB(playerData.name);

        if (!user) {
            throw new Error('Usúario não encontrado');
        }

        const updateScore = Number(user.score) + Number(playerData.score);

        await updateScoreInDB(playerData.name, updateScore)

        return updateScore;
    } catch (error) {
        console.error('Erro ao adicionar pontuação:', error.message);
        throw error;
    }
}






