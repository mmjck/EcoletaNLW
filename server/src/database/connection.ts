import knex from  'knex'
import path from 'path';


const connection = knex({
    useNullAsDefault:true,
    client: 'sqlite3',
    connection : {
        filename: path.resolve(__dirname, 'database.sqlite')
    }
      
})

export default connection;
