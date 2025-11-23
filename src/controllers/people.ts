import type { RequestHandler } from "express";
import * as people from '../services/people.js';
import z from "zod";
import { decryptMatch } from "../utils/match.js";

export const getAll: RequestHandler = async (req, res) => {
  const {id_event, id_group} = req.params;
  const items = await people.getAll({id_event: parseInt(id_event!), id_group: parseInt(id_group!)});
  if (items) return res.json({people: items});

  res.json({error: 'Ocorreu um erro!'})
}

export const getPerson: RequestHandler = async (req, res) => {
  const {id, id_event, id_group} = req.params;
  const personItem = await people.getOne({
    id: parseInt(id!),
    id_event: parseInt(id_event!),
    id_group: parseInt(id_group!)
  });
  if(personItem) return res.json({person: personItem})

  res.json({error: 'Ocorreu um erro!'})
}

export const addPerson: RequestHandler = async (req, res) => {
  const {id_event, id_group} = req.params;
  const addPersonSchema = z.object({
    name: z.string(),
    cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
  })

  const body = addPersonSchema.safeParse(req.body);
  if(!body.success) return res.json({error: 'Dados inválidos'});

  const newPerson = await people.add({
    ...body.data,
    id_event: parseInt(id_event!),
    id_group: parseInt(id_group!)
  });
  if(newPerson) return res.status(201).json({person: newPerson})

  res.json({error: 'Ocorreu um erro!'})
}

export const updatePerson: RequestHandler = async (req, res) => {
  const {id, id_event, id_group} = req.params;
  const updatePersonSchema = z.object({
    name: z.string().optional(),
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
    matched: z.string().optional()
  });

  const body = updatePersonSchema.safeParse(req.body);
  if(!body.success) return res.json({error: 'Dados Inválidos'});

  const data = Object.fromEntries(Object.entries(body.data).filter(([_, v]) => v !== undefined));
  const updatedPerson = await people.update({
    id: parseInt(id!),
    id_event: parseInt(id_event!),
    id_group: parseInt(id_group!)
  }, data);
  if(updatedPerson) {
    const personItem = await people.getOne({id: parseInt(id!), id_event: parseInt(id_event!)})
    return res.json({person: personItem})
  };

  res.json({error: 'Ocorreu um erro!'})
}

export const deletePerson: RequestHandler = async (req, res) => {
  const {id, id_event, id_group} = req.params;

  const deletedPerson = await people.remove({
    id: parseInt(id!),
    id_event: parseInt(id_event!),
    id_group: parseInt(id_group!)
  });
  if(deletedPerson) return res.json({person: deletedPerson});

  res.json({error: 'Ocorreu um erro!'})
}

export const searchPerson: RequestHandler = async (req, res) => {
  const {id_event} = req.params;

  const searchPersonSchema = z.object({cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))});
  const query = searchPersonSchema.safeParse(req.query);
  if(!query.success) return res.json({error: 'Dados inválidos'})

    console.log("query.data.cpf:", query.data.cpf);
  const personItem = await people.getOne({
    id_event: parseInt(id_event!),
    cpf: query.data.cpf
  });

  console.log("personItem encontrado:", personItem);
  if(personItem && personItem.matched) {
    console.log("matched value:", personItem.matched);
    const matchedId = decryptMatch(personItem.matched);
 console.log("matchedId:", matchedId);
    const personMatched = await people.getOne({
      id_event: parseInt(id_event!),
      id: matchedId
    })

    console.log("personMatched encontrado:", personMatched);
    if(personMatched) {
      return res.json({
        person: {id: personItem.id, name: personItem.name},
        personMatched: {id: personMatched.id, name: personMatched.name}
      })
    }
  }

  res.json({error: 'Ocorreu um erro!'})
}