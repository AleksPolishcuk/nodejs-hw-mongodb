import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '2020'));

export const setupServer = () => {
  const app = express();

  app.use(pino());

  app.use(cors());

  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    const data = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: data,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params; 

    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use( (req, res,) => {
    res.status(404).json({

      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


};
