import newrelic from 'newrelic'
import express from 'express'
const app = express();
const port = 4000;

import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();

import connect from 'knex'

const knex = connect({
  client: 'postgres',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
});

const res = knex.queryBuilder().select('2+2')
console.log('res', res.toQuery())

// Define the GET /products/{productId} route
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = {
        id: productId,
        name: `${productId} name`
    };
    res.json(product);
});


app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.get('/api-call', async (_req, res) => {
  newrelic.startSegment('External API Call', true, async () => {
    // Make API request here
    const response = await fetch('https://swapi.dev/api/people/1');

    const data = await response.json();

    res.send(data)
    return data
  });
});

app.get('/db', async (_req, res) => {
  newrelic.startSegment('Database Query', true, async () => {
    try {
      
      const result = await knex.raw('SELECT 2+2')
      
      console.log('result', result.rows[0])
      
      res.send(result.rows[0])
      
      return result.rows[0];
    } catch (error) {
      console.error(error)
      res.send('Error when making query to db') 

      return null;
    }
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});