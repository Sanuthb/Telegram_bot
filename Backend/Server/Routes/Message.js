import express from 'express';
import getMessage_db from '../Controllers/getMessage.js';

const Messageroute = express.Router();

Messageroute.get('/',getMessage_db)

export default Messageroute;