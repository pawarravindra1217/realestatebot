const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
require('dotenv').config();


app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  if (intent === 'lead.capture') {
    const leadData = {
      name: "Lead from Bot",
      location: params.location,
      property_type: params.property_type,
      budget: params.budget
    };

    // Save to CRM (Your own DB or API)
    await saveLeadToCRM(leadData);

    return res.json({
      fulfillmentText: `Thanks! We've noted your interest in a ${params.property_type} at ${params.location} with a budget of ${params.budget}. Our agent will contact you soon.`
    });
  }

  res.json({ fulfillmentText: "OK" });
});

async function saveLeadToCRM(lead) {
  // Replace with your actual CRM logic (DB insert or API call)
  console.log('Saving lead:', lead);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Webhook server running on port 3000'));
