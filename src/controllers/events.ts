import type { RequestHandler } from "express";
import * as events from '../services/events.js'

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll();
  if (items) return res.json({events: items})

  res.json({error: 'Ocorreu um'})
}