import express from 'express';
import middleware from '../middleware/auth.js';
import login from '../controllers/authController.js';


// rutas publicas 
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ruta protegidas 
router.get('/me', middleware, me);





//www.casa.com/api/auth/register // ruta para registrar un usuario
//www.casa.com/api/auth/register // post 
//www.casa.com/user=samuel$password=1234 //get 
