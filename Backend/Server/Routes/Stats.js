import express from 'express';
import getStats_db from '../Controllers/getStats.js';

const Statsroute = express.Router();

Statsroute.get('/',getStats_db)

export default Statsroute;