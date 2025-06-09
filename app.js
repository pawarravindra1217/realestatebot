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
    // Destructure parameters
    const {
      Name,
      Email,
      MobileNo,
      location,
      PropertyType,
      Budget
    } = params;

    // Check each required param, prompt with quick replies where applicable

    if (!location || location.length === 0) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['Which city or location are you interested in?']
            }
          },
          {
            quickReplies: {
              title: 'Please select a location:',
              quickReplies: ['Pune', 'Bangalore', 'Mumbai', 'Delhi']
            }
          }
        ]
      });
    }

    if (!PropertyType || PropertyType.length === 0) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What type of property are you looking for?']
            }
          },
          {
            quickReplies: {
              title: 'Choose a property type:',
              quickReplies: ['Flat', 'House', 'Villa', 'Studio']
            }
          }
        ]
      });
    }

    if (!Budget) {
      return res.json({
        fulfillmentText: 'What’s your budget?'
      });
    }

    if (!Name) {
      return res.json({
        fulfillmentText: 'What is your full name?'
      });
    }

    if (!MobileNo) {
      return res.json({
        fulfillmentText: 'What is your phone number?'
      });
    }

    if (!Email) {
      return res.json({
        fulfillmentText: 'What is your email address?'
      });
    }

    // If all parameters present, process lead (save or do other tasks)
    const lead = { Name, Email, MobileNo, location, PropertyType, Budget };
    console.log('Lead info:', lead);
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
