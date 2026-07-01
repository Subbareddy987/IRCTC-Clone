import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { chatActions, chatResponses } from "../../data/ChatResponse.js";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

const fallbackReply = {
  text: "I did not understand that yet. Try asking about trains, bookings, PNR, food, payment, login, or registration.",
  action: null,
};

const routeIntentWords = [
  "train",
  "trains",
  "journey",
  "travel",
  "ticket",
  "book",
  "from",
  "to",
];

const dateWords = ["today", "tomorrow", "date", "on"];

const monthNumbers = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

const formatDate = (date) => date.toISOString().split("T")[0];

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

const isPastDate = (dateText) => {
  if (!dateText) return false;

  return dateText < formatDate(new Date());
};

const parseDate = (text) => {
  const lowerMessage = text.toLowerCase();

  if (lowerMessage.includes("tomorrow")) return addDays(1);
  if (lowerMessage.includes("today")) return addDays(0);

  const isoMatch = lowerMessage.match(/\b(20\d{2}-\d{1,2}-\d{1,2})\b/);
  if (isoMatch) return isoMatch[1];

  const slashMatch = lowerMessage.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const monthNames = Object.keys(monthNumbers).join("|");
  const monthFirstMatch = lowerMessage.match(
    new RegExp(`\\b(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?\\s+(20\\d{2})\\b`, "i"),
  );
  if (monthFirstMatch) {
    const [, monthName, day, year] = monthFirstMatch;
    return `${year}-${monthNumbers[monthName.toLowerCase()]}-${day.padStart(2, "0")}`;
  }

  const dayFirstMatch = lowerMessage.match(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthNames})(?:,)?\\s+(20\\d{2})\\b`, "i"),
  );
  if (dayFirstMatch) {
    const [, day, monthName, year] = dayFirstMatch;
    return `${year}-${monthNumbers[monthName.toLowerCase()]}-${day.padStart(2, "0")}`;
  }

  return "";
};

const cleanStationName = (station = "") =>
  station
    .replace(/\b(today|tomorrow|on|date|please|train|trains|ticket|book|search|find)\b/gi, "")
    .replace(/\b\d{1,2}[/-]\d{1,2}[/-]20\d{2}\b/g, "")
    .replace(/\b20\d{2}-\d{1,2}-\d{1,2}\b/g, "")
    .replace(
      /\b(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,)?\s+20\d{2}\b/gi,
      "",
    )
    .replace(
      /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)(?:,)?\s+20\d{2}\b/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

const parseRoute = (text) => {
  const lowerMessage = text.toLowerCase();
  const route = {};
  const fromToMatch = lowerMessage.match(/\bfrom\s+(.+?)\s+to\s+(.+?)(?:\s+(?:on|today|tomorrow|date)\b|$)/i);

  if (fromToMatch) {
    route.source = cleanStationName(fromToMatch[1]);
    route.destination = cleanStationName(fromToMatch[2]);
  } else {
    const simpleToMatch = lowerMessage.match(/\b([a-z][a-z\s]+?)\s+to\s+([a-z][a-z\s]+?)(?:\s+(?:on|today|tomorrow|date)\b|$)/i);
    if (simpleToMatch) {
      route.source = cleanStationName(simpleToMatch[1]);
      route.destination = cleanStationName(simpleToMatch[2]);
    }
  }

  const date = parseDate(text);
  if (date) route.date = date;

  return route;
};

const hasRouteIntent = (text) => {
  const lowerMessage = text.toLowerCase();
  return (
    routeIntentWords.some((word) => lowerMessage.includes(word)) ||
    dateWords.some((word) => lowerMessage.includes(word))
  );
};

const getMissingRouteParts = (route) => {
  const missing = [];
  if (!route.source) missing.push("source station");
  if (!route.destination) missing.push("destination station");
  if (!route.date) missing.push("journey date");
  return missing;
};

const ChatBot = () => {
  const navigate = useNavigate();
  const actionMap = useMemo(
    () => new Map(chatActions.map((action) => [action.label, action])),
    [],
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi Subbu! I am RailMate AI. Choose a quick action or ask me about trains, bookings, PNR, food, or payment.",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [draftRoute, setDraftRoute] = useState({});

  const getBotReply = (text, routeDraft) => {
    const parsedRoute = parseRoute(text);
    const nextRoute = {
      ...routeDraft,
      ...Object.fromEntries(
        Object.entries(parsedRoute).filter(([, value]) => Boolean(value)),
      ),
    };
    const missingRouteParts = getMissingRouteParts(nextRoute);

    if (
      (hasRouteIntent(text) || parsedRoute.date || Object.keys(routeDraft).length) &&
      (parsedRoute.source ||
        parsedRoute.destination ||
        parsedRoute.date ||
        Object.keys(routeDraft).length)
    ) {
      if (nextRoute.date && isPastDate(nextRoute.date)) {
        return {
          text: `${nextRoute.date} is in the past. Please share today or a future journey date.`,
          action: null,
          nextDraftRoute: {
            ...nextRoute,
            date: "",
          },
        };
      }

      if (missingRouteParts.length === 0) {
        return {
          text: `Got it. I found a trip from ${nextRoute.source} to ${nextRoute.destination} on ${nextRoute.date}.`,
          action: "Search Trains",
          payload: {
            route: nextRoute,
          },
          nextDraftRoute: {},
        };
      }

      return {
        text: `I have ${nextRoute.source || "source pending"} to ${nextRoute.destination || "destination pending"}. Please share ${missingRouteParts.join(" and ")}.`,
        action: null,
        nextDraftRoute: nextRoute,
      };
    }

    const lowerMessage = text.toLowerCase();
    const response = chatResponses.find((item) =>
      item.keywords.some((keyword) => lowerMessage.includes(keyword)),
    );

    if (!response) {
      return {
        ...fallbackReply,
        nextDraftRoute: routeDraft,
      };
    }

    return {
      text: response.reply,
      action: response.action,
      nextDraftRoute: routeDraft,
    };
  };

  const addBotReply = (reply) => {
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: "bot",
          text: reply.text,
          action: reply.action,
          payload: reply.payload,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isTyping) return;

    const reply = getBotReply(trimmedMessage, draftRoute);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: "user",
        text: trimmedMessage,
      },
    ]);
    setMessage("");
    setDraftRoute(reply.nextDraftRoute || {});
    addBotReply(reply);
  };

  const handleAction = (actionLabel, payload) => {
    const action = actionMap.get(actionLabel);
    if (!action) return;
    const routePayload = payload?.route;
    const path = routePayload
      ? `${action.path}?${new URLSearchParams({
          from: routePayload.source,
          to: routePayload.destination,
          date: routePayload.date,
        }).toString()}`
      : action.path;

    setOpen(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: "bot",
        text: action.reply,
      },
    ]);
    navigate(path);
  };

  return (
    <>
      <ChatButton onClick={() => setOpen(true)} />
      {open && (
        <ChatWindow
          onClose={() => setOpen(false)}
          message={message}
          setMessage={setMessage}
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onAction={handleAction}
        />
      )}
    </>
  );
};

export default ChatBot;
