export const chatActions = [
  {
    label: "Search Trains",
    path: "/trains/search",
    reply: "Taking you to train search. Choose your source and destination there.",
  },
  {
    label: "PNR Status",
    path: "/pnr-search",
    reply: "Opening PNR search. Enter your PNR number to check ticket status.",
  },
  {
    label: "My Bookings",
    path: "/mybookings",
    reply: "Opening your bookings. You can view ticket details or manage trips there.",
  },
  {
    label: "Order Food",
    path: "/food-selection",
    reply: "Opening food selection. You can choose meals for your journey there.",
  },
  {
    label: "Payment",
    path: "/payment",
    reply: "Opening payment. Use this after confirming your booking details.",
  },
  {
    label: "Home",
    path: "/home",
    reply: "Taking you back to the home page.",
  },
  {
    label: "Login",
    path: "/",
    reply: "Opening login so you can access your railway services.",
  },
  {
    label: "Register",
    path: "/register",
    reply: "Opening registration so you can create a new account.",
  },
  {
    label: "About Developer",
    path: "/about-developer",
    reply: "Opening the developer page.",
  },
];

export const quickActions = [
  "Search Trains",
  "PNR Status",
  "My Bookings",
  "Order Food",
];

export const chatResponses = [
  {
    keywords: ["hi", "hello", "hey", "hii", "good morning", "good evening"],
    reply: "Hello! I am RailMate AI. I can help you search trains, check PNR, open bookings, and order food.",
    action: null,
  },
  {
    keywords: ["who are you", "about you", "railmate"],
    reply: "I am RailMate AI, your railway assistant inside this reservation system.",
    action: null,
  },
  {
    keywords: ["help", "support", "what can you do", "options"],
    reply: "I can guide you to train search, PNR status, bookings, food ordering, payment, login, registration, and the developer page.",
    action: null,
  },
  {
    keywords: [
      "train",
      "search train",
      "find train",
      "available train",
      "book train",
      "train booking",
      "search trains",
      "find trains",
      "availability",
      "seat availability",
      "available seats",
    ],
    reply: "Sure. Click below to search available trains.",
    action: "Search Trains",
  },
  {
    keywords: [
      "booking",
      "bookings",
      "my booking",
      "my bookings",
      "reservation",
      "booking history",
      "ticket history",
      "booked tickets",
      "my tickets",
      "cancel",
      "refund",
    ],
    reply: "You can manage your tickets from My Bookings.",
    action: "My Bookings",
  },
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
      "menu",
    ],
    reply: "You can choose meals for your journey from the food selection page.",
    action: "Order Food",
  },
  {
    keywords: ["payment", "pay", "upi", "credit card", "debit card"],
    reply: "Payment is available after booking details are confirmed.",
    action: "Payment",
  },
  {
    keywords: ["home", "dashboard", "main page"],
    reply: "I can take you to the home page.",
    action: "Home",
  },
  {
    keywords: ["login", "sign in"],
    reply: "Please login to access all railway services.",
    action: "Login",
  },
  {
    keywords: ["register", "signup", "sign up", "create account"],
    reply: "Create an account to start booking train tickets.",
    action: "Register",
  },
  {
    keywords: ["developer", "created you", "made you", "about developer"],
    reply: "This Railway Reservation System was built using React, Node.js, Express, and PostgreSQL.",
    action: "About Developer",
  },
  {
    keywords: ["thanks", "thank you", "thankyou"],
    reply: "You are welcome. Happy to help.",
    action: null,
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    reply: "Have a safe journey. See you again.",
    action: null,
  },
];
