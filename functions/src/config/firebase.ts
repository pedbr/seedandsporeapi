import * as admin from 'firebase-admin'
import secrets from './secrets'

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: secrets.private_key.replace(/\\n/g, '\n'),
    projectId: secrets.project_id,
    clientEmail: secrets.client_email,
  }),
  databaseURL: 'https://seedandsporept.firebaseio.com',
})

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })
export { admin, db }
