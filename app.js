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
    // Check for missing params
    if (!params.location || params.location.length === 0) {
      return res.json({
        fulfillmentText: "Which city or location are you interested in?"
      });
    }
    if (!params.PropertyType || params.PropertyType.length === 0) {
      return res.json({
        fulfillmentText: "What type of property are you looking for?"
      });
    }
    if (!params.Budget) {
      return res.json({
        fulfillmentText: "What’s your budget?"
      });
    }
    if (!params.Name) {
      return res.json({
        fulfillmentText: "What is your full name?"
      });
    }
    if (!params.MobileNo) {
      return res.json({
        fulfillmentText: "What is your phone number?"
      });
    }
    if (!params.Email) {
      return res.json({
        fulfillmentText: "What is your email address?"
      });
    }

    // All params present - save lead and respond
    const lead = {
      name: params.Name,
      email: params.Email,
      phone: params.MobileNo,
      location: params.location,
      property_type: params.PropertyType,
      budget: params.Budget
    };

    await saveLeadToCRM(lead);

    return res.json({
      fulfillmentText: `Thanks! We've noted your interest in a ${params.PropertyType} at ${params.location} with a budget of ${params.Budget}. Our agent will contact you soon.`
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
