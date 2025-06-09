const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;
// Handle Default Welcome Intent to show suggestion chips
if (intent === 'Default Welcome Intent') {
  return res.json({
    fulfillmentMessages: [
      {
        text: { text: ['Hi there! How can I assist you today?'] }
      },
      {
        payload: {
          richContent: [
            [
              {
                type: 'chips',
                options: [
                  { text: 'I want to buy a flat' },
                  { text: 'I\'m looking for a property' },
                  { text: 'I want a house in Bangalore' },
                  { text: 'Need a 2BHK in Pune' }
                ]
              }
            ]
          ]
        }
      }
    ]
  });
}

  if (intent === 'lead.capture') {
    const {
      Name,
      Email,
      MobileNo,
      location,
      PropertyType,
      Budget
    } = params;

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

   // Validate mobile number
const mobileRegex = /^[6-9]\d{9}$/;
if (!MobileNo || !mobileRegex.test(MobileNo)) {
  return res.json({
    fulfillmentText: 'Please enter a valid 10-digit Indian mobile number.'
  });
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!Email || !emailRegex.test(Email)) {
  return res.json({
    fulfillmentText: 'Please enter a valid email address.'
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
  res.json({
  fulfillmentText: 'Sorry, I didn’t quite get that. Could you please rephrase or try again?'
});
});

async function saveLeadToCRM(lead) {
  // Replace this with actual logic
  console.log('>> Lead saved to CRM:', lead);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
