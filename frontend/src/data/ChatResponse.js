export const chatResponses = [
  // Greetings
  {
    keywords: ["hi", "hello", "hey", "hii", "good morning", "good evening"],
    reply: "Hello! Welcome to Subbu IRCTC AI. How can I help you today?",
    action: null,
  },

  {
    keywords: ["who are you", "about you"],
    reply:
      "I'm Subbu's IRCTC AI, your personal railway assistant. I can help with train search, bookings, PNR status and food ordering.",
    action: null,
  },

  {
    keywords: ["help", "support", "what can you do"],
    reply:
      "I can help you with Train Search, My Bookings, PNR Status, Food Ordering, seat selection, payment and railway information.",
    action: null,
  },

  // Railway General Knowledge
  {
    keywords: [
      "railway minister",
      "current railway minister",
      "railway minister of india",
      "minister of railways",
      "rail minister",
    ],
    reply:
      "The Railway Minister of India is Ashwini Vaishnaw. The Ministry of Railways manages Indian Railways and railway policy in India.",
    action: null,
  },

  {
    keywords: [
      "railway history",
      "train history",
      "history of train",
      "history of railway",
      "indian railway history",
      "first train",
    ],
    reply:
      "Indian Railways started passenger service in 1853 between Mumbai and Thane. Today, it is one of the largest railway networks in the world.",
    action: null,
  },

  {
    keywords: ["vande bharat", "vande bharat express", "modern train"],
    reply:
      "Vande Bharat Express is a modern semi-high-speed train in India with better seating, automatic doors, faster acceleration and improved passenger comfort.",
    action: "Search Trains",
  },

  {
    keywords: ["bullet train", "high speed train", "high speed rail"],
    reply:
      "A bullet train is a high-speed rail system built for very fast travel on special tracks. India is developing high-speed rail projects for faster city-to-city travel.",
    action: null,
  },

  {
    keywords: [
      "coach types",
      "types of coach",
      "sleeper coach",
      "ac coach",
      "general coach",
      "chair car",
      "3 tier",
      "2 tier",
    ],
    reply:
      "Common coach types are General, Sleeper, AC Chair Car, AC 3 Tier, AC 2 Tier and AC First Class. Sleeper is budget-friendly, while AC coaches offer more comfort.",
    action: "Search Trains",
  },

  {
    keywords: ["tatkal", "tatkal ticket", "tatkal booking"],
    reply:
      "Tatkal is an urgent ticket booking option. It usually opens closer to the journey date and has limited seats with high demand.",
    action: "Search Trains",
  },

  {
    keywords: ["railway board", "who manages indian railways"],
    reply:
      "Indian Railways is managed by the Ministry of Railways and the Railway Board. The Railway Board handles major administration and operations.",
    action: null,
  },

  // Train Search
  {
    keywords: [
      "train",
      "search train",
      "find train",
      "available train",
      "railway train",
      "book train",
      "train booking",
      "express train",
      "search trains",
      "find trains",
    ],
    reply: "Sure! Click below to search available trains.",
    action: "Search Trains",
  },

  {
    keywords: ["availability", "seat availability", "available seats"],
    reply: "You can check seat availability after selecting a train.",
    action: "Search Trains",
  },

  // Seat Selection
  {
    keywords: [
      "select seat",
      "select seats",
      "seat selection",
      "choose seat",
      "choose seats",
      "how to select seats",
      "berth",
      "lower berth",
      "upper berth",
      "middle berth",
    ],
    reply:
      "To select seats, search trains, open train details, check availability and then choose available seats from the coach layout. Booked seats cannot be selected.",
    action: "Search Trains",
  },

  // Bookings
  {
    keywords: [
      "booking",
      "bookings",
      "my booking",
      "my bookings",
      "reservation",
      "reservation history",
      "booking history",
      "ticket history",
      "booked tickets",
      "my tickets",
    ],
    reply: "Opening your bookings.",
    action: "My Bookings",
  },

  // PNR
  {
    keywords: [
      "pnr",
      "pnr status",
      "ticket status",
      "reservation status",
      "rac",
      "waiting list",
      "wl",
      "confirm ticket",
      "confirmation",
    ],
    reply: "You can check your ticket status using PNR Search.",
    action: "PNR Status",
  },

  {
    keywords: ["what is pnr", "pnr means", "pnr number", "meaning of pnr"],
    reply:
      "PNR means Passenger Name Record. It is a unique number used to check ticket status and journey details.",
    action: "PNR Status",
  },

  {
    keywords: ["what is rac", "rac ticket", "what is waiting list", "wl meaning"],
    reply:
      "Confirmed means your seat is allotted. RAC means you can travel but may share seating. Waiting List means the ticket is not confirmed yet.",
    action: "PNR Status",
  },

  // Food
  {
    keywords: [
      "food",
      "meal",
      "meals",
      "order food",
      "breakfast",
      "lunch",
      "dinner",
      "veg",
      "non veg",
      "hungry",
      "restaurant",
      "menu",
    ],
    reply:
      "Food ordering is available during your journey. Choose food items, adjust quantity and continue to payment.",
    action: "Order Food",
  },

  // Profile
  {
    keywords: ["profile", "account", "my account", "user profile"],
    reply: "Your profile page is available from the navigation menu.",
    action: "Home",
  },

  {
    keywords: ["login", "sign in"],
    reply: "Please login to access all railway services.",
    action: null,
  },

  {
    keywords: ["register", "signup", "sign up"],
    reply: "Create an account to start booking train tickets.",
    action: null,
  },

  {
    keywords: ["logout", "sign out"],
    reply: "You can logout anytime from the navigation bar.",
    action: null,
  },

  // Payment
  {
    keywords: ["payment", "pay", "upi", "credit card", "debit card"],
    reply: "Secure payment options are available during booking.",
    action: "Payment",
  },

  {
    keywords: ["payment failed", "payment issue", "payment problem", "transaction"],
    reply:
      "If payment fails, check your details and try again. Do not refresh the page while payment is processing.",
    action: "Payment",
  },

  // Cancellation
  {
    keywords: [
      "cancel",
      "cancel booking",
      "refund",
      "refund status",
      "ticket cancellation",
    ],
    reply: "You can cancel booked tickets from My Bookings.",
    action: "My Bookings",
  },

  // Travel Help
  {
    keywords: ["luggage", "baggage", "carry luggage"],
    reply:
      "Keep your luggage compact, label your bags and keep valuables with you. Place bags safely below seats or in luggage areas.",
    action: null,
  },

  {
    keywords: ["safety", "train safety", "travel safety", "safe journey"],
    reply:
      "For a safe journey, verify coach and seat, keep ticket and ID ready, avoid sharing OTPs and watch your belongings.",
    action: null,
  },

  // Developer
  {
    keywords: ["developer", "created you", "made you"],
    reply:
      "This Railway Reservation System was built using React, Node.js, Express and PostgreSQL.",
    action: "About Developer",
  },

  // Thanks
  {
    keywords: ["thanks", "thank you", "thankyou"],
    reply: "You're welcome! Happy to help.",
    action: null,
  },

  // Goodbye
  {
    keywords: ["bye", "goodbye", "see you"],
    reply: "Have a safe journey. See you again!",
    action: null,
  },
];
