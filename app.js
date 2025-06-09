const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  if (intent === 'lead.capture') {
    const {
      Name,
      Email,
      MobileNo,
      location,
      PropertyType,
      Budget
    } = params;

    // 1. Ask for location
    if (!location || location.length === 0) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['Which city or location are you interested in?']
            }
          },
          {
            payload: {
              richContent: [
                [
                  {
                    type: 'chips',
                    options: [
                      { text: 'Pune' },
                      { text: 'Bangalore' },
                      { text: 'Mumbai' },
                      { text: 'Delhi' }
                    ]
                  }
                ]
              ]
            }
          }
        ]
      });
    }

    // 2. Ask for property type
    if (!PropertyType || PropertyType.length === 0) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What type of property are you looking for?']
            }
          },
          {
            payload: {
              richContent: [
                [
                  {
                    type: 'chips',
                    options: [
                      { text: 'Flat' },
                      { text: 'House' },
                      { text: 'Villa' },
                      { text: 'Studio' }
                    ]
                  }
                ]
              ]
            }
          }
        ]
      });
    }

    // 3. Ask for budget
    if (!Budget) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What’s your budget? (in ₹)']
            }
          }
        ]
      });
    }

    // 4. Ask for full name
    if (!Name) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What is your full name?']
            }
          }
        ]
      });
    }

    // 5. Ask for mobile number
    if (!MobileNo) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What is your phone number?']
            }
          }
        ]
      });
    }

    // 6. Ask for email address
    if (!Email) {
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['What is your email address?']
            }
          }
        ]
      });
    }

    // 7. All parameters collected — Save the lead
    const lead = {
      name: Name,
      email: Email,
      phone: MobileNo,
      location,
      property_type: PropertyType,
      budget: Budget
    };

    console.log('Saving lead:', lead);
    await saveLeadToCRM(lead);

    return res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `Thanks ${Name}! We've noted your interest in a ${PropertyType} at ${location} with a budget of ₹${Budget}. Our agent will contact you soon.`
            ]
          }
        }
      ]
    });
  }

  // Default fallback
  res.json({ fulfillmentText: 'Okay, noted.' });
});

async function saveLeadToCRM(lead) {
  // Replace this with actual logic
  console.log('>> Lead saved to CRM:', lead);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
