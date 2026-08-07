import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getFoodStationsForJourney,
  getStationFoodMenu,
} from "../services/autoService";
import "./FoodSelection.css";

const LOCAL_FOOD_IMAGE_MAP = {
  "coffee": "/food/coffee.png",
  "south indian thali": "/food/south-indian-thali.png",
  "veg biryani": "/food/veg-biryani.png",
  "chicken biryani": "/food/chicken-biryani.png",
  "veg meals": "/food/veg-meals.png",
  "paneer curry & roti": "/food/paneer-curry.png",
  "paneer butter masala & naan": "/food/paneer-curry.png",
  "masala dosa": "/food/masala-dosa.png",
  "plain dosa": "/food/dosa.png",
  "idli sambar (3 pcs)": "/food/idli-sambar.png",
  "idli": "/food/idli.png",
  "medu vada (2 pcs)": "/food/vada.png",
  "poori masala (3 pcs)": "/food/poori.png",
  "hot samosa (2 pcs)": "/food/samosa.png",
  "veg burger": "/food/burger.png",
  "club sandwich": "/food/sandwich.png",
  "french fries": "/food/fries.png",
  "veg fried rice": "/food/fried-rice.png",
  "masala tea / chai": "/food/tea.png",
  "chilled soft drink": "/food/cooldrink.png",
  "fresh fruit juice": "/food/juice.png",
  "mineral water (1l)": "/food/water.png",
  "water bottle": "/food/water.png",
  "chocolate ice cream": "/food/icecream.png",
  "pastry cake slice": "/food/cake.png",
};

const DEFAULT_IRCTC_PANTRY_MENU = [
  { food_id: 101, food_name: "Chicken Biryani", category: "Biryani", price: 240, image_url: "/food/chicken-biryani.png", available_qty: 85, is_available: true },
  { food_id: 102, food_name: "Veg Biryani", category: "Biryani", price: 180, image_url: "/food/veg-biryani.png", available_qty: 120, is_available: true },
  { food_id: 103, food_name: "South Indian Thali", category: "Meals", price: 160, image_url: "/food/south-indian-thali.png", available_qty: 100, is_available: true },
  { food_id: 104, food_name: "Veg Meals", category: "Meals", price: 150, image_url: "/food/veg-meals.png", available_qty: 150, is_available: true },
  { food_id: 105, food_name: "Paneer Curry & Roti", category: "Meals", price: 210, image_url: "/food/paneer-curry.png", available_qty: 90, is_available: true },
  { food_id: 106, food_name: "Masala Dosa", category: "Breakfast", price: 90, image_url: "/food/masala-dosa.png", available_qty: 110, is_available: true },
  { food_id: 107, food_name: "Plain Dosa", category: "Breakfast", price: 80, image_url: "/food/dosa.png", available_qty: 120, is_available: true },
  { food_id: 108, food_name: "Idli Sambar (3 Pcs)", category: "Breakfast", price: 60, image_url: "/food/idli-sambar.png", available_qty: 140, is_available: true },
  { food_id: 109, food_name: "Medu Vada (2 Pcs)", category: "Breakfast", price: 60, image_url: "/food/vada.png", available_qty: 100, is_available: true },
  { food_id: 110, food_name: "Poori Masala (3 Pcs)", category: "Breakfast", price: 80, image_url: "/food/poori.png", available_qty: 95, is_available: true },
  { food_id: 111, food_name: "Hot Samosa (2 Pcs)", category: "Snacks", price: 40, image_url: "/food/samosa.png", available_qty: 200, is_available: true },
  { food_id: 112, food_name: "Veg Burger", category: "Snacks", price: 99, image_url: "/food/burger.png", available_qty: 80, is_available: true },
  { food_id: 113, food_name: "Club Sandwich", category: "Snacks", price: 89, image_url: "/food/sandwich.png", available_qty: 90, is_available: true },
  { food_id: 114, food_name: "French Fries", category: "Snacks", price: 79, image_url: "/food/fries.png", available_qty: 110, is_available: true },
  { food_id: 115, food_name: "Veg Fried Rice", category: "Meals", price: 140, image_url: "/food/fried-rice.png", available_qty: 100, is_available: true },
  { food_id: 116, food_name: "Hot Filter Coffee", category: "Beverages", price: 30, image_url: "/food/coffee.png", available_qty: 250, is_available: true },
  { food_id: 117, food_name: "Masala Tea / Chai", category: "Beverages", price: 20, image_url: "/food/tea.png", available_qty: 300, is_available: true },
  { food_id: 118, food_name: "Chilled Soft Drink", category: "Beverages", price: 40, image_url: "/food/cooldrink.png", available_qty: 200, is_available: true },
  { food_id: 119, food_name: "Fresh Fruit Juice", category: "Beverages", price: 60, image_url: "/food/juice.png", available_qty: 150, is_available: true },
  { food_id: 120, food_name: "Mineral Water (1L)", category: "Beverages", price: 20, image_url: "/food/water.png", available_qty: 500, is_available: true },
  { food_id: 121, food_name: "Chocolate Ice Cream", category: "Desserts", price: 50, image_url: "/food/icecream.png", available_qty: 120, is_available: true },
  { food_id: 122, food_name: "Pastry Cake Slice", category: "Desserts", price: 70, image_url: "/food/cake.png", available_qty: 90, is_available: true }
];

function FoodSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [stations, setStations] = useState([]);
  const [activeStation, setActiveStation] = useState(null);
  const [menus, setMenus] = useState({});
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [cart, setCart] = useState({});

  const loadStationMenu = async (stationCode) => {
    let apiMenu = [];
    try {
      const response = await getStationFoodMenu(stationCode);
      apiMenu = Array.isArray(response)
        ? response
        : response?.menu || [];
    } catch (err) {
      console.warn("Using default food menu", err);
    }

    const existingNames = new Set(
      apiMenu.map((m) => (m.food_name || "").toLowerCase()),
    );
    const mergedMenu = apiMenu.map((item) => {
      const nameKey = (item.food_name || "").toLowerCase();
      const localImage = LOCAL_FOOD_IMAGE_MAP[nameKey];
      return {
        ...item,
        image_url: localImage || item.image_url,
      };
    });

    for (const defaultItem of DEFAULT_IRCTC_PANTRY_MENU) {
      if (!existingNames.has(defaultItem.food_name.toLowerCase())) {
        mergedMenu.push({
          ...defaultItem,
          station_code: stationCode,
        });
      }
    }

    setMenus((prev) => ({
      ...prev,
      [stationCode]: mergedMenu,
    }));

    return mergedMenu;
  };

  useEffect(() => {
    async function loadStations() {
      if (!bookingData) return;

      setLoadingStations(true);
      try {
        const response = await getFoodStationsForJourney(
          bookingData.train_id,
          bookingData.source_station_id,
          bookingData.destination_station_id,
        );
        const foodStations = response.stations || [];
        setStations(foodStations);
        setActiveStation(foodStations[0]?.station_code || null);

        const preloadStations = foodStations.slice(0, 4);
        Promise.allSettled(
          preloadStations.map((station) =>
            loadStationMenu(station.station_code),
          ),
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load food stations");
      } finally {
        setLoadingStations(false);
      }
    }

    loadStations();
  }, [bookingData]);

  useEffect(() => {
    async function loadMenu() {
      if (!activeStation || menus[activeStation]) return;

      setLoadingMenu(true);
      try {
        await loadStationMenu(activeStation);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load station menu");
      } finally {
        setLoadingMenu(false);
      }
    }

    loadMenu();
  }, [activeStation, menus]);

  const selectedItems = useMemo(() => {
    return Object.values(cart).flatMap((stationCart) =>
      Object.values(stationCart),
    );
  }, [cart]);

  const foodTotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  if (!bookingData) {
    return (
      <div className="fs-page">
        <div className="fs-invalid">
          <h2>Invalid Booking Session</h2>
          <p>Please start your booking again.</p>
          <button type="button" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const activeMenu = menus[activeStation] || [];
  const activeStationDetails = stations.find(
    (station) => station.station_code === activeStation,
  );

  const formattedDate = bookingData.travel_date
    ? new Date(bookingData.travel_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const changeQuantity = (stationCode, item, delta) => {
    setCart((prev) => {
      const stationCart = { ...(prev[stationCode] || {}) };
      const current = stationCart[item.food_id]?.quantity || 0;
      const nextQuantity = Math.max(0, current + delta);

      if (nextQuantity === 0) {
        delete stationCart[item.food_id];
      } else {
        stationCart[item.food_id] = {
          food_id: item.food_id,
          food_name: item.food_name,
          category: item.category,
          price: Number(item.price),
          quantity: nextQuantity,
          delivery_station: stationCode,
          station_name:
            stations.find((station) => station.station_code === stationCode)
              ?.station_name || stationCode,
        };
      }

      const updated = { ...prev };
      if (Object.keys(stationCart).length === 0) {
        delete updated[stationCode];
      } else {
        updated[stationCode] = stationCart;
      }

      return updated;
    });
  };

  const buildFoodOrders = () =>
    Object.entries(cart).map(([stationCode, stationCart]) => ({
      delivery_station: stationCode,
      items: Object.values(stationCart).map((item) => ({
        food_id: item.food_id,
        quantity: item.quantity,
      })),
    }));

  const continueToPayment = () => {
    navigate("/payment", {
      state: {
        ...bookingData,
        food_orders: buildFoodOrders(),
        food_summary: selectedItems,
        food_total: foodTotal,
      },
    });
  };

  const skipFood = () => {
    navigate("/payment", {
      state: {
        ...bookingData,
        food_orders: [],
        food_summary: [],
        food_total: 0,
      },
    });
  };

  return (
    <div className="fs-page">
      <header className="fs-header">
        <div className="fs-header-inner">
          <div>
            <p className="fs-kicker">Journey Food</p>
            <h1>{bookingData.train_name || "Train"} meals</h1>
            <div className="fs-route">
              <strong>{bookingData.source_station_code || "FROM"}</strong>
              <span>to</span>
              <strong>{bookingData.destination_station_code || "TO"}</strong>
              <em>{formattedDate}</em>
            </div>
          </div>
          <button className="fs-skip-top" type="button" onClick={skipFood}>
            Skip Food
          </button>
        </div>
      </header>

      <main className="fs-layout">
        <section className="fs-main">
          <div className="fs-steps">
            <span className="fs-step fs-step--done">Search</span>
            <span className="fs-step fs-step--done">Seat Selection</span>
            <span className="fs-step fs-step--active">Food Selection</span>
            <span className="fs-step">Payment</span>
          </div>

          <div className="fs-panel">
            <div className="fs-panel-head">
              <h2>Delivery Station</h2>
              <span>{stations.length} available</span>
            </div>

            {loadingStations ? (
              <div className="fs-loader">
                <div className="fs-spinner" />
                <p>Finding food stations</p>
              </div>
            ) : stations.length === 0 ? (
              <div className="fs-empty">
                <h3>No food stations found</h3>
                <p>You can continue to payment without adding food.</p>
              </div>
            ) : (
              <div className="fs-station-tabs">
                {stations.map((station) => (
                  <button
                    key={station.station_code}
                    className={`fs-station-tab ${
                      activeStation === station.station_code
                        ? "fs-station-tab--active"
                        : ""
                    }`}
                    type="button"
                    onClick={() => setActiveStation(station.station_code)}
                  >
                    <strong>{station.station_code}</strong>
                    <span>{station.station_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeStation && (
            <div className="fs-panel">
              <div className="fs-panel-head">
                <h2>{activeStationDetails?.station_name || activeStation}</h2>
                <span>Menu</span>
              </div>

              {loadingMenu ? (
                <div className="fs-loader">
                  <div className="fs-spinner" />
                  <p>Loading menu</p>
                </div>
              ) : activeMenu.length === 0 ? (
                <div className="fs-empty">
                  <h3>No menu available</h3>
                  <p>Please select another station or continue without food.</p>
                </div>
              ) : (
                <div className="fs-menu-grid">
                  {activeMenu.map((item) => {
                    const quantity =
                      cart[activeStation]?.[item.food_id]?.quantity || 0;
                    const isMaxed = quantity >= Number(item.available_qty);

                    return (
                      <article className="fs-food-card" key={item.food_id || item.menu_id || item.food_name}>
                        <div className="fs-food-img">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.food_name} />
                          ) : (
                            <span>{item.food_name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="fs-food-body">
                          <span className="fs-food-category">
                            {item.category}
                          </span>
                          <h3>{item.food_name}</h3>
                          <p>{item.available_qty} plates available</p>
                          <div className="fs-food-actions">
                            <strong>
                              Rs {Number(item.price).toLocaleString("en-IN")}
                            </strong>
                            <div className="fs-qty">
                              <button
                                type="button"
                                disabled={quantity === 0}
                                onClick={() =>
                                  changeQuantity(activeStation, item, -1)
                                }
                              >
                                -
                              </button>
                              <span>{quantity}</span>
                              <button
                                type="button"
                                disabled={isMaxed}
                                onClick={() =>
                                  changeQuantity(activeStation, item, 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="fs-summary">
          <div className="fs-summary-card">
            <div className="fs-summary-head">
              <h2>Food Summary</h2>
              <span>{selectedItems.length} item types</span>
            </div>

            {selectedItems.length === 0 ? (
              <div className="fs-cart-empty">
                <p>No food added yet.</p>
              </div>
            ) : (
              <div className="fs-cart-list">
                {selectedItems.map((item) => (
                  <div
                    className="fs-cart-row"
                    key={`${item.delivery_station}-${item.food_id}`}
                  >
                    <div>
                      <strong>{item.food_name}</strong>
                      <span>
                        {item.station_name} x {item.quantity}
                      </span>
                    </div>
                    <b>
                      Rs{" "}
                      {(item.price * item.quantity).toLocaleString("en-IN")}
                    </b>
                  </div>
                ))}
              </div>
            )}

            <div className="fs-total-row">
              <span>Food Total</span>
              <strong>Rs {foodTotal.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="fs-continue"
              type="button"
              onClick={continueToPayment}
            >
              Continue to Payment
            </button>
            <button className="fs-skip" type="button" onClick={skipFood}>
              Skip Food
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default FoodSelection;
