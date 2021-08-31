import express from 'express';
// import { signUp } from '../controllers/auth.js';
import { startPage, signUp, signIn, createClass, joinClass, addAssignment, submitAssignment } from '../controllers/auth.js';

const router = express.Router();
//localhost:5000/home
router.get('/', startPage)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/createClass', createClass)
router.post('/joinClass', joinClass)
router.post('/addAssignment', addAssignment)
router.post('/submitAssignment', submitAssignment)
export default router;