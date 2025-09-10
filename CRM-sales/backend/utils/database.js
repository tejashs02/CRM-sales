const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/db.json');
const BACKUP_PATH = path.join(__dirname, '../database/backup.json');

const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {
      users: [],
      leads: [],
      opportunities: []
    };
  }
};

const writeDatabase = (data) => {
  try {
    // const currentData = readDatabase();
    // fs.writeFileSync(BACKUP_PATH, JSON.stringify(currentData, null, 2));
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

const generateId = (collection) => {
  const prefix = collection === 'users' ? 'u' :
                 collection === 'leads' ? 'l' : 'o';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

module.exports = {
  readDatabase,
  writeDatabase,
  generateId
};