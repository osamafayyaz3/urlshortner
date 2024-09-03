import 'dotenv/config';
import { onDatabaseConnect } from './config/knex';

onDatabaseConnect()
    .then(() => console.log('database is connected'))
    .catch((e) => {
        console.log('error with connection');
        console.log(e);
    });
