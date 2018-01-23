import electron from 'electron'
import path from 'path'

let userDataPath = (electron.app || electron.remote.app).getPath('userData');
userDataPath = path.join(userDataPath, 'zen-wallet-db.json');

import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync(userDataPath)
const db = low(adapter)

export default db
