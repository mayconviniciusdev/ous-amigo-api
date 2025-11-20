import { Router } from "express";
import * as auth from '../controllers/auth.js'
import * as events from '../controllers/events.js'

const router = Router();
router.post('/login', auth.login)
router.get('/ping', auth.validate, (req, res) => res.json({pong: true, admin: true}));
router.get('/events', auth.validate, events.getAll)

export default router;