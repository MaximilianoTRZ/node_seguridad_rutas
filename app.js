import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import eoidc from "express-openid-connect";
const { auth, requiresAuth } = eoidc;

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
  })
);

// Anyone can access the homepage
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// requiresAuth checks authentication.
app.get("/profile", requiresAuth(), (req, res) =>
  res.send(`Hello ${req.oidc.user.given_name}, this is the profile section.`)
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express on port ${port}`);
});
