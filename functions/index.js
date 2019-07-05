
'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const admin=require('firebase-admin');



const {
    dialogflow,
    BasicCard,
    Permission,
    Carousel,
    Suggestions,
    Button,
    SimpleResponse,
    Image,
    Place,
    DeliveryAddress,
    OrderUpdate,
    TransactionDecision,
    TransactionRequirements,
    
    
  } = require('actions-on-google');


const app = dialogflow({debug: true});
app.middleware((conv)=>{
	conv.screen=conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
	conv.hasAudioPlayback=conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
	
});

admin.initializeApp(functions.config().firebase);
const db=admin.firestore();



const calendarId = 'hsv1rjuouqlrmamdln15c1rnrk@group.calendar.google.com'; // looks like "6ujc6j6rgfk02cp02vg6h38cs0@group.calendar.google.com"
const serviceAccount = {
  "type": "service_account",
  "project_id": "bhc-4-nbvqoa",
  "private_key_id": "2014fa0102682e73a77a34c230e5143e0eaabd5f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7UK0QPZb6GyIY\ngG5+6x/XsXork/xM5G6ll/PROaI3WBpl47sBe338gbCUGd5NLCNyHn7oFFDIsEu3\nULTZq01Q+NMAQmrlbtvzlH/588XC5ZmWm32dJm0KwpTcb6zaGiERvx3+sduBwn0b\nPZbHBhtT2vQ8m+M4Bd6ReKYjn//q1+wFzN685EnghvBWBw1qExkNGWLx5uL3ZUhO\nutp/woR4VTQ4xsZtWnGrAJNEs8hUhRSUuAiNQwTBc2Vnq2LSaRWqhXTypvkuNcPv\ngGKWLuPXRftqIHP9+bVaDwyHiMTv/ljPtzMsnR/+ZUgugBzXKYD+JoommcWSwzw9\nJDAs5/GXAgMBAAECgf8W7R5BiUhGqbYtSYrnUzU9MSZthFoHue3RAXLWKOJcjmwC\nDIgsUPEaoW+mBi8vQuJpFVJzFV7N3BtoVHh41n6gFSm+M7g3B1qPIEiJpKHlON+T\nj3R7HOORGD/KuzXCJsXlZimbAtSFt/LtYpxnFQLt6zP5jHBDFcooA/GnFUOSz/pa\ngp/Q5X2mNpWt9NIMXyGqTdIuEOpwpgecEquGG+4m0dcpQT/Sv/3kA+GF8z4GskG7\nzSWjglyNMDPAUYKHoloUwTSL+cCqzr3tWhJ2WUZ8D7tqZBnOn14P0RA1SCdlQ5La\nhH8jDjUaOoE7Smfg1rk4+JJHUccpYOG90MjUNoECgYEA6ffCYzkQZHhK5Gn0RzBd\n5v8pB4YiRUpXwIVPet3694HD3LUufwdM54KVJk1tkpXvuMS8fQ/XCEzigROh2fhs\nWo8xqnMSiz/lAM3FAJn13J4OpFKvZmqQlIMGB1/qZOCTkH8zlchUimsG+uwx5l3o\nIf9wUWzpQZf/SRkZ3UjF3WECgYEAzPRD2uRW1g4Oj4WcTluK4A0arp22N3+XTzWE\nUpX3lbn45Umf0adrpZq+/lqyVp5nePsVB+T/DEyrakTj/zKut/x/v91r2w/dwpNZ\nWJwwRzkwH3MIEWdfiC9nUTUjlnDE6Aj13CEiXdErCtx8v/y0SLTz0euaRCJWqKEQ\n65Us+fcCgYEArm8uuUVJKG7a/1LTcePojpk8IMTrdheINxvs9uDbBH715O4b/U8X\nEh+0TXs6rygkMvBSyzbtDd4snSli6RyixB2wXLEwaSs49BF1yA4BVPtuVSrkZIoc\nwuywqPzkx1L8EaYUcp6KESzcZmWEiokG0ZodRkfZ3DKTfQ8+zlE8W+ECgYEApVJj\naa3GXeP42sxryMkOvKvVWgTddub0pnAEzJkrnRrmKg25XOQvcOXiKkn+kOA1luDx\nleyhzsoJey8WukOnq8GBSsLQvWOO/eTdrRxP1SPMLZIcb+1yoeea72ZtzmwoaQLR\nTz9q+UI/9gLknfi5c+yCwFHLnioUvPEvNNif7wECgYEA3CP9FTXk5dPOIaSN4DI4\nKv3kD2P1VqtlleJxkJgOELBDrIcBn9u1SHVtmI1WMAZlKRqw2o2O8mUS4Je95H2f\nBNFNRvv/QF7QUZliXnviwM1cpOYBeuicpvAlrRKXlFmjtNBvz3KE+Gyp2hI4WboH\nQbn1BFnP3G9cm3Ki/tAxSiA=\n-----END PRIVATE KEY-----\n",
  "client_email": "calendar2019@bhc-4-nbvqoa.iam.gserviceaccount.com",
  "client_id": "103293965112132586747",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/calendar2019%40bhc-4-nbvqoa.iam.gserviceaccount.com"
}; // Starts with {"type": "service_account",...

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
//process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'America/New_York';
const timeZoneOffset = '-05:00';

const SELECTION_KEY_HOME='HOME';
const SELECTION_KEY_LIBRARY='LIBRARY';
const SELECTION_KEY_CAFETERIA='CAFETERIA';
const SELECTION_KEY_BOOKSTORE='BOOKSTORE';
const SELECTION_KEY_ONE='TITLE';


const IMG_URL_AOG="";
const IMG_URL_HOME='';
const IMG_URL_CAFETERIA='#';
const IMG_URL_BOOKSTORE='#';
const IMG_URL_LIBRARY='#';
const IMG_URL_MEDIA='';
const IMG_URL_MEDIA_SRC='';


const SELECTED_ITEM_RESPONSES={
    [SELECTION_KEY_ONE]:'You selected FIRST item',
    [SELECTION_KEY_HOME]:'You selected HOME item',
    [SELECTION_KEY_LIBRARY]:'You selected LIBRARY item',
    [SELECTION_KEY_CAFETERIA]:'You selected CAFETERIA item',
    [SELECTION_KEY_BOOKSTORE]:'You selected BOOKSTORE item',
    
}
 
const colorMap = {
  'interior': {
    title: 'Interior Detail',
    text: 'Interior Detail is a subtle bluish tone.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
      accessibilityText: 'Interior Detail',
    },
    display: 'WHITE',
  },
  'exterior': {
    title: 'Exterior Detail',
    text: 'Exterior Detail Pink Unicorn is an imaginative reddish hue.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
      accessibilityText: 'Exterior Detail',
    },
    display: 'WHITE',
  },
  'full': {
    title: 'FUll DETAIL',
    text: 'Full detail, Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
      accessibilityText: 'Full Detail',
    },
    display: 'WHITE',
  },
};
const colorMap2 = {
  'pethair': {
   title: 'Pet Hair Removal',
   text: 'Included with your detail, is pet hair removal service, removing from rear, mats, seats, headrests, seat belts,  including under and between cracks of seats, I also attack odors,.',
   image: {
     url: 'https://s3.amazonaws.com/insurancehelperimages/2019pethair.jpg',
     accessibilityText: 'Pet Hair Removal and Detail',
   },
   display: 'WHITE',
 },
 'mats': {
   title: 'Mats Clean and Wash',
   text: 'Included with your detail, Mats Clean and Wash.',
   image: {
     url: 'https://s3.amazonaws.com/insurancehelperimages/2019washingMats.png',
     accessibilityText: 'Mats Clean and Detail',
   },
   display: 'WHITE',
 },
 'stains': {
   title: 'Stain Removal',
   text: 'Included with your detail, Stain Removal, removing from rear, mats, seats, headrests, seat belts,  including under and between cracks of seats, I also attack odors,.',
   image: {
     url: 'https://s3.amazonaws.com/insurancehelperimages/2019stains1.png',
     accessibilityText: 'Stain Removal and Detail',
   },
   display: 'WHITE',
 },
};
// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const fakeColorCarousel = () => {
  const carousel = new Carousel({
    items: {
      'interior': {
        title: 'Interior Detail',
        synonyms: ['interior', 'inside detail'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019interior.png',
          alt: 'Interior Detail',
        }),
      },
      'exterior': {
        title: 'Exterior Detail',
        synonyms: ['exterior', 'outside detail'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019exterior.png',
          alt: 'Exterior Detail',
        }),
      },
      'full': {
        title: 'Full Detail',
        synonyms: ['full', 'detail', 'full detail'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019complete.png',
          alt: 'Full Detail',
        }),
      },
      'pet hair': {
        title: 'Pet Hair',
        synonyms: ['pet hair', 'pethair'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019exterior.png',
          alt: 'Pet Hair Detail',
        }),
      },
      'mats': {
        title: 'Mats',
        synonyms: ['mats', 'mats detail'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019washingMats.png',
          alt: 'Mats Detail',
        }),
      },
      'stains': {
        title: 'Stains Detail',
        synonyms: ['stains', 'stains detail'],
        image: new Image({
          url: 'https://s3.amazonaws.com/insurancehelperimages/2019stains.png',
          alt: 'Stains Detail',
        }),
      },
  }});
  return carousel;
};
app.intent('Default Welcome Intent', (conv) => {
  if (!conv.screen) {
    conv.ask(' ' +
      'TGood afternoon! Thank you for calling Boston Business. What issue can I revive and treat for you? ');
    return;
  }
  conv.ask('Welcome To Boston HotCars smart screen response built by Victor at Boston HotCars. Please choose Interior, Exterior, Hours, or Book appointment or say exactly what is bothering you about your vehicle everytime you see it or step inside.');
  conv.ask(new Suggestions('Interior', 'Exterior', 'Hours', 'Make Appointment'));
  // Create a basic card
  conv.ask(new BasicCard({
    text: ` Victor "treats every vehicle as if it were his own"**Kirk T** and
    Victor "takes the time to listen to the customer and delivers consistantly"**Joey C** emoji ðŸ“±. 
    Focusing on *scratch removal*,*polish*,*wax*, *interior* or _italics_, **strong** or
    __bold__, and ***trustworthy and dependable*** using less water and environmentally friendly products___ as well as other
    vehicles we specialize  \nTesla`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'Reviving your vehicle to as close to new as possible',
    title: 'Thank you for visiting, Boston HotCars honest, reliable car-detailing. Victor aims to put a smile on your face.',
    buttons: new Button({
      title: 'Boston HotCars Website',
      url: 'https://bostonhotcars.com/',
    }),
    image: new Image({
      url: 'https://s3.amazonaws.com/insurancehelperimages/mar23BostonHOTCARS4LargeTOPBOTTOMsun.png',
      alt: 'Logo Boston HotCars',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'Thank you for calling, Victor works hard for Boston HotCars customers and how I can assist you with your detailing needs.',
    text: 'Victor works hard for Boston HotCars customers and I can assist you with your detailing needs.',
  }));
});

  app.intent('TestWelcomeIntent',(conv)=>{
    if (!conv.screen) {
      conv.ask(' ' +
        'Hello! Thank you for calling Boston HotCars Detail. What issue can I revive and treat for you? ');
      return;
    }
    
    if(goodMorning()){
        conv.ask('Good morning.');
    }else if (goodAfternoon()){
      conv.ask('Good afternoon');
    }else if(goodEvening()){
      conv.ask('Good evening.');
    }else if(goodOvernight()){
      conv.ask('Hello, yes I answer all hours!');

    };
});

app.intent('Hours',(conv)=>{
  if(currentlyOpen()){
      conv.ask('we are detailing now. close at 8pm. you can also ask me for tips or you can schedule an appointment also.');
  }else{
      conv.ask('we are closed or detailing for a customer, please try scheduling an appointment.')
  }
});


app.intent('Make Appointment', (conv)=>{
  const dateTimeStart = new Date(Date.parse(conv.parameters.date.split('T')[0] + 'T' + conv.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
  const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
  const appointmentTimeString = dateTimeStart.toLocaleString(
      'en-US',
      {month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone}
  );
  return createCalendarEvent(dateTimeStart, dateTimeEnd).then(()=>{
      conv.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!. Do you need a repair or just a tune-up?`);
  }).catch(()=>{
      conv.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
  });
});

app.intent('WriteToFirestore',(conv)=>{
  const databaseEntry=conv.parameters.databaseEntry;
  const dialogflowAgentRef=db.collection('dialogflow').doc('agent');
  return db.runTransaction(t=>{
    t.set(dialogflowAgentRef, {entry:databaseEntry});
    return Promise.resolve('Write complete');
  }).then(doc=>{
    conv.add(`Wrote "${databaseEntry}" to the Firestore database.`);
  }).catch(err=>{
    console.log(`Error writing to Firestore: ${err}`);
    conv.add(`Failed to write "${databaseEntry}" to the Firestore database.`)
  });
});
app.intent('WriteNameFirestore',(conv)=>{
  const any=conv.parameters.any;
  const dialogflowAgentRef=db.collection('dialogflowName').doc('agent1');
  return db.runTransaction(t=>{
    t.set(dialogflowAgentRef, {entry:any});
    return Promise.resolve('Write complete');
  }).then(doc=>{
    conv.add(`Wrote "${any}" to the Firestore database.`);
  }).catch(err=>{
    console.log(`Error writing to Firestore: ${err}`);
    conv.add(`Failed to write "${any}" to the Firestore database.`)
  });
});

app.intent('WritePhoneFirestore',(conv)=>{
  const anyPhone=conv.parameters.anyPhone;
  const dialogflowAgentRef=db.collection('dialogflowName').doc('agent2');
  return db.runTransaction(t=>{
    t.set(dialogflowAgentRef, {entry:anyPhone});
    return Promise.resolve('Write complete');
  }).then(doc=>{
    conv.add(`Wrote "${anyPhone}" to the Firestore database.`);
  }).catch(err=>{
    console.log(`Error writing to Firestore: ${err}`);
    conv.add(`Failed to write "${anyPhone}" to the Firestore database.`)
  });
});

app.intent('ReadNameFirestore',(conv)=>{
  const dialogflowAgentDoc=db.collection('dialogflowName').doc('agent1');
  return dialogflowAgentDoc.get()
  .then(doc=>{
    if(!doc.exists){
      conv.add('No data found');
    }else{
      conv.add(doc.data().entry);
    }
    return Promise.resolve('Read complete');
  }).catch(()=>{
    conv.add('error reading');
    conv.add('Please add a entry to the database first by saying, "Write <your phrase> to the database"')
  })
});

app.intent('ReadFromFirestore',(conv)=>{
  const dialogflowAgentDoc=db.collection('dialogflow').doc('agent');
  return dialogflowAgentDoc.get()
  .then(doc=>{
    if(!doc.exists){
      conv.add('No data found');
    }else{
      conv.add(doc.data().entry);
    }
    return Promise.resolve('Read complete');
  }).catch(()=>{
    conv.add('error reading');
    conv.add('Please add a entry to the database first by saying, "Write <your phrase> to the database"')
  })
});
app.intent('ReadPhoneFirestore',(conv)=>{
  const dialogflowAgentDoc=db.collection('dialogflowName').doc('agent2');
  return dialogflowAgentDoc.get()
  .then(doc=>{
    if(!doc.exists){
      conv.add('No data found');
    }else{
      conv.add(doc.data().entry);
    }
    return Promise.resolve('Read complete');
  }).catch(()=>{
    conv.add('error reading');
    conv.add('Please add a entry to the database first by saying, "Write <your phrase> to the database"')
  })
});

app.intent('fav-type-detail', (conv, {AppointmentType}) => {
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';

  AppointmentType = conv.arguments.get('OPTION') || AppointmentType;
  // Present user with the corresponding basic card and ensd the conversation.
  if (!conv.screen) {
    conv.ask(colorMap[AppointmentType].text);
  } else {
    conv.ask(`Here you go. `, new BasicCard(colorMap[AppointmentType]));
  }
  conv.ask('Do you want to hear about another or schedule an appointment?');
  conv.ask(new Suggestions('Yes', 'No'));
});


app.intent(['favorite-color - yes', 'fav-type-detail - yes'], (conv) => {
  conv.ask('Which type, interior, exterior or full?');
  // If the user is using a screened device, display the carousel
  if (conv.screen) return conv.ask(new Suggestions('Interior', 'Exterior', 'Hours','Make Appointment'));
});


app.intent('actions_intent_NO_INPUT', (conv)=>{
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if(repromptCount===0){
      conv.ask('Which exactly did you want?');
      }else if (repromptCount===1){
          conv.ask('Please say how I can assist you.');
      }else if(conv.arguments.get('IS_FINAL_REPROMPT')){
          conv.close('Sorry we are having trouble, try again later.  Goodbye.');
      }
});

app.intent('normal ask', (conv) => {
  conv.ask('Ask me to show you a list, carousel, or basic card.');
});

app.intent('HowMuchIntent', (conv) => {
  if (!conv.screen) {
    conv.ask('A detail cost $209 and takes 4.5 hours to complete ' +
      'what info here exactly?');
    return;
  }
  conv.ask('A detail cost $209 and takes 4.5 hours to complete.');
  conv.ask(new Suggestions('Interior', 'Exterior', 'Hours', 'Make Appointment'));
  // Create a basic card
  conv.ask(new BasicCard({
    text: ` Victor "treats every vehicle as if it were his own"**Kirk T** and
    Victor "takes the time to listen to the customer and delivers consistantly"**Joey C** emoji ðŸ“±. 
    Focusing on *scratch removal*,*polish*,*wax*, *interior* or _italics_, **strong** or
    __bold__, and ***trustworthy and dependable*** using less water and environmentally friendly products___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'what subtitle in regards to cost details',
    title: 'detail title for cost',
    buttons: new Button({
      title: 'Boston HotCars Website',
      url: 'https://bostonhotcars.com/',
    }),
    image: new Image({
      url: 'https://s3.amazonaws.com/insurancehelperimages/2019complete.png',
      alt: 'detail Boston HotCars',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'then what info goes here.',
    text: 'what info goes here.',
  }));
});

app.intent('HowMuchInteriorIntent', (conv) => {
  if (!conv.screen) {
    conv.ask('An interior detail cost $99 and takes 2.5 hours to complete ' +
      'what info here exactly?');
    return;
  }
  conv.ask('An interior detail cost $99 and takes 2.5 hours to complete.');
  conv.ask(new Suggestions('Mats', 'Exterior', 'Hours', 'Make Appointment'));
  // Create a basic card
  conv.ask(new BasicCard({
    text: ` Victor "treats every vehicle as if it were his own"**Kirk T** and
    Victor "takes the time to listen to the customer and delivers consistantly"**Joey C** emoji ðŸ“±. 
    Focusing on *scratch removal*,*polish*,*wax*, *interior* or _italics_, **strong** or
    __bold__, and ***trustworthy and dependable*** using less water and environmentally friendly products___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'what subtitle in regards to cost details',
    title: 'detail title for cost',
    buttons: new Button({
      title: 'Boston HotCars Website',
      url: 'https://bostonhotcars.com/',
    }),
    image: new Image({
      url: 'https://s3.amazonaws.com/insurancehelperimages/2019interior.png',
      alt: 'interior detail Boston HotCars',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'interior then what info goes here.',
    text: 'interior what info goes here.',
  }));
});

app.intent('HowMuchExteriorIntent', (conv) => {
  if (!conv.screen) {
    conv.ask('An exterior detail cost $109 and takes 2.5 hours to complete ' +
      'this is why an exterior is the best');
    return;
  }
  conv.ask('An exterior detail cost $109 and takes 2.5 hours to complete.');
  conv.ask(new Suggestions('Interior', 'Exterior', 'Hours', 'Make Appointment'));
  // Create a basic card
  conv.ask(new BasicCard({
    text: ` Victor "treats every vehicle as if it were his own"**Kirk T** and
    Victor "takes the time to listen to the customer and delivers consistantly"**Joey C** emoji ðŸ“±. 
    Focusing on *scratch removal*,*polish*,*wax*, *interior* or _italics_, **strong** or
    __bold__, and ***trustworthy and dependable*** using less water and environmentally friendly products___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'what subtitle in regards to cost details',
    title: 'detail title for cost',
    buttons: new Button({
      title: 'Boston HotCars Website',
      url: 'https://bostonhotcars.com/',
    }),
    image: new Image({
      url: 'https://s3.amazonaws.com/insurancehelperimages/2019exterior.png',
      alt: 'interior detail Boston HotCars',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'exterior then what info goes here.',
    text: 'exterior what info goes here.',
  }));
});

app.intent('WriteAddressFirestore',(conv)=>{
  const anyAddress=conv.parameters.anyAddress;
  const dialogflowAgentRef=db.collection('dialogflowName').doc('agent3');
  return db.runTransaction(t=>{
    t.set(dialogflowAgentRef, {entry:anyAddress});
    return Promise.resolve('Write complete');
  }).then(doc=>{
    conv.add(`Wrote "${anyAddress}" to the Firestore database.`);
  }).catch(err=>{
    console.log(`Error writing to Firestore: ${err}`);
    conv.add(`Failed to write "${anyAddress}" to the Firestore database.`)
  });
});

app.intent('fave-type-interior', (conv, {probsInterior}) => {
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';

  probsInterior = conv.arguments.get('OPTION') || probsInterior;
  // Present user with the corresponding basic card and ensd the conversation.
  if (!conv.screen) {
    conv.ask(colorMap2[probsInterior].text);
  } else {
    conv.ask(`Here you go. `, new BasicCard(colorMap2[probsInterior]));
  }
  conv.ask('Ask me about another issue or question you have in regards to your interior, or schedule an appointment?');
  conv.ask(new Suggestions('Yes', 'No', 'Mats'));
});

app.intent(['shampooInteriorIntent - yes', 'fave-type-interior - yes'], (conv) => {
  conv.ask('Which service would you like more info, for example, pet hair, dirty mats or stains?');
  // If the user is using a screened device, display the carousel
  if (conv.screen) return conv.ask(new Suggestions('PetHair', 'Stains', 'Mats','Make Appointment'));
});


app.intent('shampooInteriorIntent', (conv) => {
  if (!conv.screen) {
    conv.ask('Victor does shampoo the interior, including seats and carpets using steamvac 5000, which leaves your interior with a fresh smell and odor free. ' +
      'this is why Victor can remove many types of stains that build up on your seats, carpets, visors and headliner.');
    return;
  }
  conv.ask('Victor does shampoo the interior, including seats and carpets using steamvac 5000, which leaves your interior with a fresh smell and odor free. this is why Victor can remove many types of stains that build up on your seats, carpets, visors and headliner.');
  conv.ask(new Suggestions('Mats', 'Exterior', 'Hours', 'Make Appointment'));
  // Create a basic card
  conv.ask(new BasicCard({
    text: ` Victor "treats every vehicle as if it were his own"**Kirk T** and
    Victor "takes the time to listen to the customer and delivers consistantly"**Joey C** emoji ðŸ“±. 
    Focusing on *scratch removal*,*polish*,*wax*, *interior* or _italics_, **strong** or
    __bold__, and ***trustworthy and dependable*** using less water and environmentally friendly products___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'this is subtitle?',
    title: 'Shampoo',
    buttons: new Button({
      title: 'Boston HotCars Website',
      url: 'https://bostonhotcars.com/',
    }),
    image: new Image({
      url: 'https://s3.amazonaws.com/insurancehelperimages/2019exterior.png',
      alt: 'interior detail Boston HotCars',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'shampoo would you like to hear another topic?',
    text: 'shampoo what info goes here.',
  }));
});



// React to list or carousel selection
app.intent('item selected', (conv, params, option) => {
  let response = 'You did not select any item from the list or carousel';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  } else {
    response = 'You selected an unknown item from the list or carousel';
  }
  conv.ask(response);
});
app.intent('cancelIntent', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Okay ' +
      'see you next time.');
    return;
  }
  conv.ask('Goodbye, World!');
  conv.close(new BasicCard({
    text: 'This is a goodbye card.',
  }));
});



exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function currentlyOpen () {
  let date = new Date();
  date.setHours(date.getHours() + parseInt(timeZoneOffset.split(':')[0]));
  date.setMinutes(date.getMinutes() + parseInt(timeZoneOffset.split(':')[0][0] + timeZoneOffset.split(':')[1]));

  return date.getDay() >= 1 &&
        date.getDay() <= 6 &&
        date.getHours() >= 8 &&
        date.getHours() <= 20;
}

function goodMorning () {
  let date = new Date();
  date.setHours(date.getHours() + parseInt(timeZoneOffset.split(':')[0]));
  date.setMinutes(date.getMinutes() + parseInt(timeZoneOffset.split(':')[0][0] + timeZoneOffset.split(':')[1]));

  return date.getDay() >= 1 &&
        date.getDay() <= 7 &&
        date.getHours() >= 4 &&
        date.getHours() <= 11;
}

function goodAfternoon () {
  let date = new Date();
  date.setHours(date.getHours() + parseInt(timeZoneOffset.split(':')[0]));
  date.setMinutes(date.getMinutes() + parseInt(timeZoneOffset.split(':')[0][0] + timeZoneOffset.split(':')[1]));

  return date.getDay() >= 1 &&
        date.getDay() <= 7 &&
        date.getHours() >= 11 &&
        date.getHours() <= 18;
}

function goodEvening () {
  let date = new Date();
  date.setHours(date.getHours() + parseInt(timeZoneOffset.split(':')[0]));
  date.setMinutes(date.getMinutes() + parseInt(timeZoneOffset.split(':')[0][0] + timeZoneOffset.split(':')[1]));

  return date.getDay() >= 1 &&
        date.getDay() <= 7 &&
        date.getHours() >= 18 &&
        date.getHours() <= 23;
}

function goodOvernight () {
  let date = new Date();
  date.setHours(date.getHours() + parseInt(timeZoneOffset.split(':')[0]));
  date.setMinutes(date.getMinutes() + parseInt(timeZoneOffset.split(':')[0][0] + timeZoneOffset.split(':')[1]));

  return date.getDay() >= 1 &&
        date.getDay() <= 7 &&
        date.getHours() >= 23 &&
        date.getHours() <= 4;
}



function createCalendarEvent (dateTimeStart, dateTimeEnd) {
    return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      }, (err, calendarResponse) => {
        // Check if there is a event already on the Bike Shop Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(err || new Error('Requested time conflicts with another appointment'));
        } else {
          // Create event for the requested time period
          calendar.events.insert({ auth: serviceAccountAuth,
            calendarId: calendarId,
            resource: {summary: 'Bike Appointment',
              start: {dateTime: dateTimeStart},
              end: {dateTime: dateTimeEnd}}
          }, (err, event) => {
            err ? reject(err) : resolve(event);
          }
          );
        }
      });
    });
  }