const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const listings = [
  {
    id: 1, title: "Sea View Villa", location: "Goa, India", type: "Beach",
    price: 5200, rating: 4.92, reviews: 128, lat: 28, left: 67,
    amenities: ["Pool", "Free Wi-Fi", "Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: 2, title: "Mountain Escape", location: "Manali, India", type: "Mountains",
    price: 3800, rating: 4.88, reviews: 96, lat: 32, left: 39,
    amenities: ["Mountain View", "Fireplace", "Free Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: 3, title: "Lakefront Cottage", location: "Udaipur, India", type: "Countryside",
    price: 4500, rating: 4.95, reviews: 74, lat: 45, left: 55,
    amenities: ["Lake View", "Breakfast", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: 4, title: "Modern City Apartment", location: "Delhi, India", type: "City",
    price: 2900, rating: 4.76, reviews: 211, lat: 37, left: 47,
    amenities: ["Workspace", "Air conditioning", "Free Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: 5, title: "Forest Treehouse", location: "Rishikesh, India", type: "Nature",
    price: 4100, rating: 4.91, reviews: 63, lat: 55, left: 45,
    amenities: ["River View", "Pet Friendly", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    id: 6, title: "Desert Camp", location: "Jaisalmer, India", type: "Trending",
    price: 3300, rating: 4.83, reviews: 52, lat: 66, left: 30,
    amenities: ["Dinner", "Campfire", "Guided tours"],
    images: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85"
    ]
  }
];

app.get("/", (req, res) => res.render("home", { listings }));
app.get("/search", (req, res) => {
  const q = (req.query.destination || "").trim().toLowerCase();
  const filtered = q ? listings.filter(x =>
    `${x.title} ${x.location} ${x.type}`.toLowerCase().includes(q)
  ) : listings;
  res.render("home", { listings: filtered, search: req.query.destination || "" });
});
app.get("/listing/:id", (req, res) => {
  const listing = listings.find(x => x.id === Number(req.params.id));
  if (!listing) return res.status(404).send("Listing not found");
  res.render("listing", { listing });
});

app.listen(PORT, () => console.log(`Travel Helper running at http://localhost:${PORT}`));