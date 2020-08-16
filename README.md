# Acaply

A social media website for high schoolers. Check it out here: https://acaply.com/.

### Demo:

- Check out the functionality demo here: https://www.youtube.com/watch?v=3Sawc7FZLVw.

![Logo](/public/images/logo.png)

### Icon:

- Background: #ebdc87.
- Font: #799351.

### Usage:

- `git clone https://github.com/pillious/acaply.com.git`.
- `npm install`.
- Create a `.env` file and add these credentials:

```
DATABASE_USERNAME
DATABASE_PASSWORD
USER_SESSION_KEY
SENDGRID_API_KEY
RESET_PASSWORD_EMAIL_ID
```

- `npm run dev`.
- Go to localhost:3000.

### Technologies:

- Database: MongoDB, Mongoose, Mongo Atlas.
- Website: HTML, CSS, Bootstrap, Embedded JavaScript Templates.
- Language: JavaScript.
- Email: SendGrid.
- Other: Axios, Express, Node.js.

### Deployment:

- The Node.js web application for Acaply is deployed on Vercel (previously zeit.co).
- The MongoDB database for Acaply is hosted on MongoDB Atlas (free tier: 500 MB).

### Detailed Project Structure:

- `README.md`: provides documentation about Acaply (written in Markdown).
- `package-lock.json`: auto-generated file (you can ignore).
- `package.json`: lists our scripts and dependencies.
- We have a `start` script for production and a `dev` script for development mode.

### Some things I plan on adding:

- Dark mode
- styling error when shrink screen.

### New Features:

- Added a favicon (serve-favicon).
- Added a logo.
- Updated read me file (my favorite).
- When the 'log in' button on the login page is clicked, if both inputs are empty, it tells you to "please enter your username and password".
- When logged in user attempts to submit white-space comment, it just refreshes the page.
- Moved database connection to new configuration folder.
