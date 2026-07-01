import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getFoodStationsForJourney,
  getStationFoodMenu,
} from "../services/autoService";
import "./FoodSelection.css";

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
    const response = await getStationFoodMenu(stationCode);
    const menu = response.menu || [];

    setMenus((prev) => ({
      ...prev,
      [stationCode]: menu,
    }));

    return menu;
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
                      <article className="fs-food-card" key={item.menu_id}>
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
