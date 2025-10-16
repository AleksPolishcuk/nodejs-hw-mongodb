import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());

    const options = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Contacts Hub API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    };

    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc, options)];
  } catch (error) {
    console.error('Error loading swagger docs:', error);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
