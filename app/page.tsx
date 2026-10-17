"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Category =
  | "All products"
  | "Audio"
  | "Phones"
  | "Computing"
  | "Wearables"
  | "Home tech";

type Product = {
  id: number;
  sku: number;
  name: string;
  category: Exclude<Category, "All products">;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  color: string;
  image: string;
  description: string;
  features: string[];
  inventoryBalance: number;
  databaseReady: boolean;
};

const products: Product[] = [
  {
    id: 1,
    sku: 40001,
    name: "SonicPods Pro",
    category: "Audio",
    price: 3999,
    oldPrice: 5999,
    rating: 4.8,
    reviews: 284,
    badge: "BESTSELLER",
    color: "#eae7df",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=85",
    description:
      "Your own little pocket of quiet. These wireless earbuds bring rich, balanced sound and all-day comfort wherever the day takes you.",
    features: ["Active noise cancellation", "30-hour total battery", "Clear-call microphones"],
    inventoryBalance: 10,
    databaseReady: true,
  },
  {
    id: 2,
    sku: 40002,
    name: "Astra One 5G",
    category: "Phones",
    price: 24999,
    oldPrice: 29999,
    rating: 4.7,
    reviews: 196,
    badge: "NEW ARRIVAL",
    color: "#e6eaf0",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85",
    description:
      "A bright, brilliant display, dependable 5G speed and a camera that catches the little things beautifully. Made for your everyday.",
    features: ["120Hz AMOLED display", "50MP dual camera", "All-day 5000mAh battery"],
    inventoryBalance: 55,
    databaseReady: true,
  },
  {
    id: 3,
    sku: 40003,
    name: "StudioLite Headphones",
    category: "Audio",
    price: 6499,
    oldPrice: 7999,
    rating: 4.6,
    reviews: 153,
    badge: "SAVE 19%",
    color: "#e9e5e1",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=85",
    description:
      "Big, beautiful sound that goes wherever you do. Settle into your favourite album with soft ear cushions and effortless wireless listening.",
    features: ["Up to 40-hour playtime", "Soft memory-foam cushions", "Fast USB-C charging"],
    inventoryBalance: 0,
    databaseReady: false,
  },
  {
    id: 4,
    sku: 40004,
    name: "PixelWatch Active",
    category: "Wearables",
    price: 8999,
    oldPrice: 11999,
    rating: 4.5,
    reviews: 98,
    color: "#e6e9e2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
    description:
      "A little nudge towards feeling your best. Keep an eye on your activity, sleep and notifications without missing a beat.",
    features: ["Heart-rate & sleep tracking", "Water resistant to 5 ATM", "7-day battery life"],
    inventoryBalance: 0,
    databaseReady: false,
  },
  {
    id: 5,
    sku: 40005,
    name: "AeroBook Air 14",
    category: "Computing",
    price: 58990,
    oldPrice: 64990,
    rating: 4.9,
    reviews: 124,
    badge: "STAFF PICK",
    color: "#e9e7e1",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",
    description:
      "Light in your bag, ready for the big ideas. A crisp display and smooth performance make this your perfect work-from-anywhere companion.",
    features: ["14-inch full-HD display", "16GB memory, 512GB SSD", "Up to 12 hours battery"],
    inventoryBalance: 0,
    databaseReady: false,
  },
  {
    id: 6,
    sku: 40006,
    name: "Breeze Mini Speaker",
    category: "Audio",
    price: 2499,
    oldPrice: 3299,
    rating: 4.4,
    reviews: 211,
    color: "#eee6dc",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85",
    description:
      "Small speaker, big weekend energy. Bring your favourite sounds to the balcony, the beach or just the kitchen.",
    features: ["360° room-filling sound", "Water resistant (IPX7)", "12-hour wireless playtime"],
    inventoryBalance: 0,
    databaseReady: false,
  },
  {
    id: 7,
    sku: 40007,
    name: "HomeHub Smart Display",
    category: "Home tech",
    price: 5499,
    oldPrice: 6999,
    rating: 4.5,
    reviews: 87,
    badge: "SMART HOME",
    color: "#e8e8e5",
    image:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=85",
    description:
      "A helpful little screen for the heart of your home. See your reminders, play a playlist or check who's at the door.",
    features: ["Voice assistant built in", "8-inch touch display", "Control compatible smart devices"],
    inventoryBalance: 0,
    databaseReady: false,
  },
  {
    id: 8,
    sku: 40008,
    name: "ChargeMate 65W",
    category: "Computing",
    price: 1899,
    rating: 4.7,
    reviews: 342,
    color: "#ebe9e3",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=85",
    description:
      "One neat little charger, fewer things to pack. Power your phone, tablet and laptop from one travel-friendly plug.",
    features: ["65W fast charging", "Dual USB-C ports", "Built-in surge protection"],
    inventoryBalance: 0,
    databaseReady: false,
  },
];

const categories: Category[] = [
  "All products",
  "Audio",
  "Phones",
  "Computing",
  "Wearables",
  "Home tech",
];

type CartItem = { productId: number; quantity: number };
type PaymentMethod = "upi" | "card" | "cod";

function Icon({
  name,
  size = 20,
}: {
  name: "search" | "bag" | "arrow" | "close" | "plus" | "minus" | "trash" | "check" | "back";
  size?: number;
}) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "search":
      return <svg {...shared}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
    case "bag":
      return <svg {...shared}><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
    case "arrow":
      return <svg {...shared}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
    case "close":
      return <svg {...shared}><path d="m18 6-12 12M6 6l12 12" /></svg>;
    case "plus":
      return <svg {...shared}><path d="M12 5v14m-7-7h14" /></svg>;
    case "minus":
      return <svg {...shared}><path d="M5 12h14" /></svg>;
    case "trash":
      return <svg {...shared}><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" /></svg>;
    case "check":
      return <svg {...shared}><path d="m5 12 4 4L19 6" /></svg>;
    case "back":
      return <svg {...shared}><path d="M19 12H5m6 6-6-6 6-6" /></svg>;
  }
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function Home() {
  const [catalog, setCatalog] = useState(products);
  const [catalogHydrated, setCatalogHydrated] = useState(false);
  const [view, setView] = useState<"shop" | "admin">("shop");
  const [adminKey, setAdminKey] = useState("");
  const [inventoryMessage, setInventoryMessage] = useState("");
  const [category, setCategory] = useState<Category>("All products");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("aarohan-catalog");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              Number.isInteger(item.id) &&
              Number.isInteger(item.sku) &&
              typeof item.name === "string" &&
              Number.isFinite(item.price) &&
              Number.isInteger(item.inventoryBalance) &&
              typeof item.databaseReady === "boolean",
          )
        ) {
          setCatalog(parsed as Product[]);
        }
      }
    } catch (error) {
      console.error("Unable to restore saved inventory.", error);
    } finally {
      setCatalogHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (catalogHydrated) {
      window.localStorage.setItem("aarohan-catalog", JSON.stringify(catalog));
    }
  }, [catalog, catalogHydrated]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("aarohan-cart");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              Number.isInteger(item.productId) &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0,
          )
        ) {
          setCart(parsed as CartItem[]);
        }
      }
    } catch (error) {
      console.error("Unable to restore the saved cart.", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("aarohan-cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = catalog.filter((product) => {
      const matchesCategory = category === "All products" || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    if (sort === "price-low") return result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return result.sort((a, b) => b.price - a.price);
    if (sort === "rating") return result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [catalog, category, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = catalog.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const shipping = cartSubtotal === 0 || cartSubtotal >= 1999 ? 0 : 99;
  const total = cartSubtotal + shipping;
  const cartProducts = cart.flatMap((item) => {
    const product = catalog.find((entry) => entry.id === item.productId);
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });

  function addToCart(productId: number, quantity = 1) {
    const product = catalog.find((entry) => entry.id === productId);
    if (!product || product.inventoryBalance <= 0) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      const nextQuantity = Math.min(product.inventoryBalance, (existing?.quantity ?? 0) + quantity);
      return existing
        ? current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity }
              : item,
          )
        : [...current, { productId, quantity: nextQuantity }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function updateQuantity(productId: number, change: number) {
    const product = catalog.find((entry) => entry.id === productId);
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(product?.inventoryBalance ?? 0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: number) {
    setCart((current) => current.filter((item) => item.productId !== productId));
  }

  async function submitInventoryAction(action: "INSERT" | "UPDATE" | "DELETE", product: Product) {
    const response = await fetch("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-inventory-admin-key": adminKey,
      },
      body: JSON.stringify({
        action,
        sku: product.sku,
        itemName: product.name,
        itemPrice: product.price,
        inventoryBalance: product.inventoryBalance,
      }),
    });
    if (response.status === 503) return false;
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error ?? "The inventory database update failed.");
    return true;
  }

  async function saveProduct(product: Product, previousProduct?: Product) {
    setInventoryMessage("");
    try {
      const action = previousProduct?.databaseReady ? "UPDATE" : "INSERT";
      const savedToDatabase = await submitInventoryAction(action, product);
      const updatedProduct = { ...product, databaseReady: savedToDatabase || product.databaseReady };
      setCatalog((current) => previousProduct
        ? current.map((item) => item.sku === previousProduct.sku ? updatedProduct : item)
        : [...current, updatedProduct]);
      setInventoryMessage(savedToDatabase
        ? `SKU ${product.sku} saved to the database.`
        : `SKU ${product.sku} saved in this browser only. Configure SQL Server to sync it.`);
    } catch (error) {
      setInventoryMessage(error instanceof Error ? error.message : "Unable to save this item.");
    }
  }

  async function deleteProduct(product: Product) {
    setInventoryMessage("");
    try {
      const savedToDatabase = product.databaseReady
        ? await submitInventoryAction("DELETE", product)
        : false;
      setCatalog((current) => current.filter((item) => item.sku !== product.sku));
      setCart((current) => current.filter((item) => item.productId !== product.id));
      setInventoryMessage(savedToDatabase
        ? `SKU ${product.sku} deleted from the database.`
        : `SKU ${product.sku} removed from this browser only.`);
    } catch (error) {
      setInventoryMessage(error instanceof Error ? error.message : "Unable to delete this item.");
    }
  }

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sku = Number(form.get("sku"));
    const name = String(form.get("name") ?? "").trim();
    const price = Number(form.get("price"));
    const inventoryBalance = Number(form.get("inventoryBalance"));
    if (!Number.isInteger(sku) || sku <= 0 || catalog.some((product) => product.sku === sku)) {
      setInventoryMessage("Enter a unique positive whole-number SKU.");
      return;
    }
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(inventoryBalance) || inventoryBalance < 0) {
      setInventoryMessage("Enter a name, valid price, and whole-number stock balance.");
      return;
    }
    const product: Product = {
      id: Math.max(0, ...catalog.map((item) => item.id)) + 1,
      sku,
      name,
      category: "Home tech",
      price,
      rating: 0,
      reviews: 0,
      color: "#e8e8e5",
      image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=85",
      description: "A thoughtful everyday tech essential.",
      features: [],
      inventoryBalance,
      databaseReady: false,
    };
    void saveProduct(product);
    event.currentTarget.reset();
  }

  async function syncCatalog() {
    setInventoryMessage("");
    const pending = catalog.filter((product) => !product.databaseReady);
    if (pending.length === 0) {
      setInventoryMessage("All catalog items are marked as synced.");
      return;
    }
    const synced: number[] = [];
    try {
      for (const product of pending) {
        if (!await submitInventoryAction("INSERT", product)) break;
        synced.push(product.sku);
      }
      if (synced.length) {
        setCatalog((current) => current.map((product) =>
          synced.includes(product.sku) ? { ...product, databaseReady: true } : product,
        ));
      }
      setInventoryMessage(synced.length === pending.length
        ? `Synced ${synced.length} catalog items to the database.`
        : synced.length
          ? `Synced ${synced.length} items. Configure SQL Server to sync the rest.`
          : "Database settings are missing. The catalog is available in this browser only.");
    } catch (error) {
      setInventoryMessage(error instanceof Error ? error.message : "Unable to sync the catalog.");
    }
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.length === 0) return;
    const inventoryUpdates = cart.flatMap((item) => {
      const product = catalog.find((entry) => entry.id === item.productId);
      return product ? [{ ...product, inventoryBalance: product.inventoryBalance - item.quantity }] : [];
    });
    if (inventoryUpdates.length !== cart.length || inventoryUpdates.some((item) => item.inventoryBalance < 0)) {
      setInventoryMessage("Some items no longer have enough stock. Please review your bag.");
      return;
    }
    try {
      const databaseResults = await Promise.all(inventoryUpdates.map((product) =>
        product.databaseReady && adminKey
          ? submitInventoryAction("UPDATE", product)
          : Promise.resolve(false),
      ));
      setCatalog((current) => current.map((product) => {
        const updateIndex = inventoryUpdates.findIndex((item) => item.sku === product.sku);
        if (updateIndex < 0) return product;
        return { ...inventoryUpdates[updateIndex], databaseReady: databaseResults[updateIndex] || product.databaseReady };
      }));
    } catch (error) {
      setInventoryMessage(error instanceof Error ? error.message : "Unable to update inventory.");
      return;
    }
    setOrderNumber(`AR${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);
  }

  function closeCheckout() {
    setCheckoutOpen(false);
    setOrderPlaced(false);
  }

  return (
    <main>
      <div className="announcement">
        <span>Little joys, delivered free</span>
        <span className="announcement-separator">✳</span>
        <span>on orders above ₹1,999</span>
        <span className="announcement-right">Thoughtful tech. Honest prices. Always.</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Aarohan home">
          <span className="brand-mark">a<span>.</span></span>
          <span className="brand-name">aarohan<span>electronics, thoughtfully.</span></span>
        </a>
        <nav className="header-categories" aria-label="Main categories">
          {categories.slice(1, 5).map((item) => (
            <button
              className={category === item ? "nav-link active" : "nav-link"}
              key={item}
              onClick={() => {
                setCategory(item);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="mobile-search-trigger"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            <Icon name={searchOpen ? "close" : "search"} size={19} />
          </button>
          <label className={searchOpen ? "search-box mobile-search-open" : "search-box"}>
            <Icon name="search" size={19} />
            <input
              aria-label="Search products"
              placeholder="Find your next favourite"
              autoFocus={searchOpen}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          </label>
          <div className="view-switch" role="group" aria-label="Choose view">
            <button className={view === "shop" ? "view-option selected" : "view-option"} onClick={() => setView("shop")}>Shop</button>
            <button className={view === "admin" ? "view-option selected" : "view-option"} onClick={() => setView("admin")}>Admin</button>
          </div>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}>
            <Icon name="bag" size={20} />
            <span className="cart-label">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {view === "admin" ? (
        <section className="admin-section">
          <div className="admin-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> STORE MANAGEMENT</div>
              <h1>Inventory <em>control.</em></h1>
              <p>Update prices and stock, or sync the catalog with the inventory database.</p>
            </div>
            <button className="primary-button" onClick={() => void syncCatalog()}>Sync catalog to database <Icon name="arrow" size={17} /></button>
          </div>
          <p className="inventory-message" role="status">{inventoryMessage || "Database sync is available when SQL Server settings are configured."}</p>
          <label className="admin-key-field">Admin access key<input type="password" autoComplete="off" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} /></label>

          <form className="new-product-form" onSubmit={addProduct}>
            <h2>Add an item</h2>
            <label>SKU<input name="sku" type="number" min="1" step="1" required /></label>
            <label>Item name<input name="name" maxLength={200} required /></label>
            <label>Price (₹)<input name="price" type="number" min="0" step="0.01" required /></label>
            <label>Opening stock<input name="inventoryBalance" type="number" min="0" step="1" required /></label>
            <button className="primary-button" type="submit">Add item <Icon name="plus" size={17} /></button>
          </form>

          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead><tr><th>SKU</th><th>Item</th><th>Price and stock</th><th>Availability</th><th>Database</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {catalog.map((product) => (
                  <tr key={product.sku}>
                    <td className="inventory-sku">{product.sku}</td>
                    <td>{product.name}</td>
                    <td>
                      <form className="inventory-row-form" onSubmit={(event) => {
                        event.preventDefault();
                        const form = new FormData(event.currentTarget);
                        void saveProduct({
                          ...product,
                          price: Number(form.get("price")),
                          inventoryBalance: Number(form.get("inventoryBalance")),
                        }, product);
                      }}>
                        <label><span>₹</span><input aria-label={`${product.name} price`} name="price" type="number" min="0" step="0.01" defaultValue={product.price} required /></label>
                        <label><span>Qty</span><input aria-label={`${product.name} inventory balance`} name="inventoryBalance" type="number" min="0" step="1" defaultValue={product.inventoryBalance} required /></label>
                        <button className="text-button" type="submit">Save</button>
                      </form>
                    </td>
                    <td><span className={product.inventoryBalance > 0 ? "stock-status available" : "stock-status unavailable"}>{product.inventoryBalance > 0 ? "In stock" : "Out of stock"}</span></td>
                    <td><span className={product.databaseReady ? "database-status synced" : "database-status"}>{product.databaseReady ? "Synced" : "Browser only"}</span></td>
                    <td><button className="remove-item inventory-delete" onClick={() => void deleteProduct(product)} aria-label={`Delete ${product.name}`}><Icon name="trash" size={17} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="storefront-content">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> A little more you, every day</div>
          <h1>Good things.<br /><em>Good energy.</em></h1>
          <p>Thoughtful tech for all the little things that make your day.</p>
          <a className="primary-button hero-button" href="#shop">
            Find your thing <Icon name="arrow" size={17} />
          </a>
          <div className="hero-footnote"><span className="tiny-sparkle">✳</span> Handpicked with a little extra heart</div>
        </div>
        <div className="hero-art" aria-label="Headphones, phone and smartwatch">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90"
              alt="Premium headphones in a warm, sunlit studio"
            />
            <div className="photo-wash" />
          </div>
          <div className="hero-note"><span className="note-star">✳</span><span>MAKE SPACE<br />FOR A LITTLE<br /><em>ME-TIME</em></span></div>
          <div className="hero-sticker"><span>made for</span><strong>your<br />everyday</strong></div>
          <div className="hero-caption"><span className="caption-dash" /> SOUND THAT<br />TAKES YOU THERE</div>
          <div className="hero-big-number">01</div>
        </div>
      </section>

      <section className="promise-strip" aria-label="Why shop Aarohan">
        <div><span className="promise-icon">✳</span><span>Good tech, thoughtfully picked</span></div>
        <span className="promise-divider" />
        <div><span className="promise-icon">♡</span><span>Easy 7-day returns</span></div>
        <span className="promise-divider" />
        <div><span className="promise-icon">↗</span><span>Free delivery over ₹1,999</span></div>
        <span className="promise-divider" />
        <div><span className="promise-icon">☼</span><span>Here for you, always</span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> THE GOOD STUFF</div>
            <h2>A little something <em>for you.</em></h2>
            <p className="section-subtitle">The everyday upgrades you didn&apos;t know you needed.</p>
          </div>
          <div className="sort-wrap">
            <label htmlFor="sort-products">Sort by</label>
            <select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Our favourites</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        <div className="category-tabs" role="tablist" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={category === item}
              className={category === item ? "category-tab selected" : "category-tab"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
          <span className="result-count">{filteredProducts.length} little joys</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article className="product-card" key={product.id} style={{ animationDelay: `${index * 55}ms` }}>
                <button className="product-image-button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name} details`}>
                  <div className="product-image" style={{ backgroundColor: product.color }}>
                    {(product.inventoryBalance <= 0 || product.badge) && <span className={product.inventoryBalance <= 0 ? "product-badge out-of-stock-badge" : "product-badge"}>{product.inventoryBalance <= 0 ? "OUT OF STOCK" : product.badge}</span>}
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="quick-view">A closer look <Icon name="arrow" size={15} /></span>
                  </div>
                </button>
                <div className="product-meta"><span>{product.category}</span><span className={product.inventoryBalance > 0 ? "rating stock-in-meta" : "rating stock-out-meta"}>{product.inventoryBalance > 0 ? `In stock · ${product.inventoryBalance}` : "Out of stock"}</span></div>
                <button className="product-title" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                <div className="product-bottom">
                  <div className="product-price">{formatPrice(product.price)}{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div>
                  <button className="add-button" onClick={() => addToCart(product.id)} aria-label={product.inventoryBalance > 0 ? `Add ${product.name} to bag` : `${product.name} is out of stock`} disabled={product.inventoryBalance <= 0}>
                    {product.inventoryBalance > 0 ? <Icon name="plus" size={19} /> : <span className="unavailable-dash">−</span>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <span className="empty-sparkle">✳</span>
            <h3>No little joys found just yet.</h3>
            <p>Try another search or explore all of our good stuff.</p>
            <button className="text-button" onClick={() => { setSearch(""); setCategory("All products"); }}>Show me everything <Icon name="arrow" size={16} /></button>
          </div>
        )}
      </section>

      <section className="closing-note">
        <span className="closing-mark">a.</span>
        <p>Because good tech should feel <em>like you.</em></p>
        <span className="closing-sun">☼</span>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#">aarohan<span>®</span></a>
        <span>Thoughtful tech. Honest prices. Made for your everyday.</span>
        <span>© 2026 Aarohan Electronics</span>
      </footer>
        </div>
      )}

      {cartOpen && (
        <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="side-drawer" aria-label="Shopping bag">
            <div className="drawer-header">
              <div><span className="eyebrow"><span className="eyebrow-line" /> YOUR GOOD STUFF</span><h2>Your bag <span>({cartCount})</span></h2></div>
              <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><Icon name="close" /></button>
            </div>
            {cartProducts.length ? (
              <>
                <div className="cart-list">
                  {cartProducts.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image" style={{ backgroundColor: item.color }}><img src={item.image} alt="" /></div>
                      <div className="cart-item-info">
                        <span className="cart-item-category">{item.category}</span>
                        <h3>{item.name}</h3>
                        <strong>{formatPrice(item.price)}</strong>
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Icon name="minus" size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Icon name="plus" size={14} /></button>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Icon name="trash" size={17} /></button>
                    </div>
                  ))}
                </div>
                <div className="shipping-hint">
                  {cartSubtotal >= 1999 ? <><span>✳</span> You&apos;ve unlocked free delivery!</> : <>Add {formatPrice(1999 - cartSubtotal)} more for free delivery.</>}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
                  <div><span>Delivery</span><span>{shipping ? formatPrice(shipping) : <b className="free-label">FREE</b>}</span></div>
                  <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                  <button className="primary-button checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                    On to the good part <Icon name="arrow" size={17} />
                  </button>
                  <p className="secure-note">♡ &nbsp;A safe, secure checkout. Always.</p>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-bag"><Icon name="bag" size={31} /></span>
                <h3>Your bag is feeling a little light.</h3>
                <p>Let&apos;s find something to make your day.</p>
                <button className="primary-button" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the good stuff <Icon name="arrow" size={16} /></button>
              </div>
            )}
          </aside>
        </div>
      )}

      {selectedProduct && (
        <div className="overlay modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} details`}>
            <button className="icon-button modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><Icon name="close" /></button>
            <div className="modal-image" style={{ backgroundColor: selectedProduct.color }}><img src={selectedProduct.image} alt={selectedProduct.name} /></div>
            <div className="modal-details">
              <div className="eyebrow"><span className="eyebrow-line" /> {selectedProduct.category}</div>
              <h2>{selectedProduct.name}</h2>
              <div className="modal-rating"><span>★ {selectedProduct.rating}</span> &nbsp;·&nbsp; {selectedProduct.reviews} happy customers</div>
              <div className="modal-price">{formatPrice(selectedProduct.price)} {selectedProduct.oldPrice && <del>{formatPrice(selectedProduct.oldPrice)}</del>}</div>
              <p className="modal-description">{selectedProduct.description}</p>
              <ul className="feature-list">{selectedProduct.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
              {selectedProduct.inventoryBalance > 0 ? (
                <button className="primary-button modal-add" onClick={() => addToCart(selectedProduct.id)}>Add to bag <Icon name="arrow" size={17} /></button>
              ) : (
                <p className="modal-out-of-stock">Out of stock</p>
              )}
              <p className="modal-delivery">✳ &nbsp;Free delivery on orders over ₹1,999</p>
            </div>
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay modal-overlay checkout-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCheckout(); }}>
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">
            {orderPlaced ? (
              <div className="order-success">
                <span className="success-mark"><Icon name="check" size={32} /></span>
                <div className="eyebrow"><span className="eyebrow-line" /> IT&apos;S OFFICIALLY YOURS</div>
                <h2>A little joy<br /><em>is on its way.</em></h2>
                <p>Thanks for choosing Aarohan. Your demo order is all set — we can&apos;t wait for it to find its way to you.</p>
                <div className="order-reference"><span>YOUR ORDER NUMBER</span><strong>{orderNumber}</strong></div>
                <button className="primary-button" onClick={closeCheckout}>Back to the good stuff <Icon name="arrow" size={17} /></button>
                <span className="demo-disclaimer">This is a demo store. No payment was collected and no order will be shipped.</span>
              </div>
            ) : (
              <>
                <div className="checkout-heading">
                  <button className="back-button" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}><Icon name="back" size={17} /> Back to bag</button>
                  <button className="icon-button" onClick={closeCheckout} aria-label="Close checkout"><Icon name="close" /></button>
                  <div className="eyebrow"><span className="eyebrow-line" /> ALMOST THERE</div>
                  <h2>Make it <em>yours.</em></h2>
                </div>
                <form className="checkout-form" onSubmit={placeOrder}>
                  <div className="checkout-fields">
                    <h3>Where should we send the good stuff?</h3>
                    <div className="field-row">
                      <label>Full name<input name="name" placeholder="Your name" autoComplete="name" required /></label>
                      <label>Phone number<input name="phone" type="tel" inputMode="numeric" placeholder="10-digit mobile number" autoComplete="tel" pattern="[0-9]{10}" title="Enter a 10-digit mobile number" required /></label>
                    </div>
                    <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
                    <label>Address<input name="address" placeholder="House no., street, area" autoComplete="street-address" required /></label>
                    <div className="field-row">
                      <label>City<input name="city" placeholder="City" autoComplete="address-level2" required /></label>
                      <label>PIN code<input name="pin" inputMode="numeric" placeholder="6-digit PIN" autoComplete="postal-code" pattern="[0-9]{6}" title="Enter a 6-digit PIN code" required /></label>
                    </div>

                    <h3 className="payment-heading">How would you like to pay?</h3>
                    <div className="payment-options">
                      <button type="button" className={paymentMethod === "upi" ? "payment-option chosen" : "payment-option"} onClick={() => setPaymentMethod("upi")}><span className="payment-radio" />UPI<span className="payment-detail">GPay, PhonePe & more</span></button>
                      <button type="button" className={paymentMethod === "card" ? "payment-option chosen" : "payment-option"} onClick={() => setPaymentMethod("card")}><span className="payment-radio" />Card<span className="payment-detail">Credit or debit</span></button>
                      <button type="button" className={paymentMethod === "cod" ? "payment-option chosen" : "payment-option"} onClick={() => setPaymentMethod("cod")}><span className="payment-radio" />Pay on delivery<span className="payment-detail">Cash when it arrives</span></button>
                    </div>
                    {paymentMethod === "upi" && <label className="payment-input">UPI ID<input name="upi" placeholder="yourname@bank" required /></label>}
                    {paymentMethod === "card" && (
                      <div className="card-fields">
                        <label>Card number<input name="card-number" inputMode="numeric" placeholder="1234  5678  9012  3456" pattern="[0-9 ]{16,23}" required /></label>
                        <div className="field-row">
                          <label>Expiry date<input name="expiry" placeholder="MM / YY" pattern="(0[1-9]|1[0-2])\\s*/\\s*[0-9]{2}" required /></label>
                          <label>CVV<input name="cvv" inputMode="numeric" placeholder="•••" pattern="[0-9]{3,4}" required /></label>
                        </div>
                      </div>
                    )}
                    <div className="demo-payment-note">Demo checkout — payment details are not processed or stored.</div>
                  </div>
                  <aside className="checkout-summary">
                    <h3>A little recap</h3>
                    <div className="checkout-items">
                      {cartProducts.map((item) => (
                        <div className="checkout-item" key={item.id}>
                          <div className="checkout-item-image" style={{ backgroundColor: item.color }}><img src={item.image} alt="" /></div>
                          <span>{item.name} <small>× {item.quantity}</small></span>
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="checkout-totals"><div><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div><div><span>Delivery</span><span>{shipping ? formatPrice(shipping) : "FREE"}</span></div><div className="checkout-grand-total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div></div>
                    <button className="primary-button place-order" type="submit">Place my demo order <Icon name="arrow" size={17} /></button>
                    <p className="checkout-secure">♡ &nbsp;Safe, secure & made with care.</p>
                  </aside>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
