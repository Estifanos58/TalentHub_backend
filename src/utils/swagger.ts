import {Express, Request, Response} from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {version} from '../../package.json'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TalentHub API with Swagger',
      version,
      description:
        'An API for TalentHub application. This API allows users register post Jobs and Apply for Jobs and follow up there result.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Estifanos Kebede',
        url: 'https://estifanos.dev',
        email: 'estifkebe08@gmail.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000',
        }
    ],
  },
    apis: ['./src/routes/*.ts', './src/models/*.ts', './src/utils/swagger.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export const swaggerDocs = (app: Express, port: number): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.log(`API docs available at http://localhost:${port}/api-docs`)
}

export default swaggerDocs;