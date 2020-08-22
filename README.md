# Acaply

A social media website for high schoolers. Check it out here: https://acaply.com/.

### Info:

- Acaply is an academic internet forum for NNHS high schoolers. Students can discuss a variety of topics, ranging from classes to clubs to fundraisers.

### Demo:

- Check out the functionality demo here: https://www.youtube.com/watch?v=3Sawc7FZLVw.

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

### Some things for adding:

- styling error when shrink screen.
- Decrease comment count on comment delete
- other mail sending thing
- updating a comment

### New Features:

- Added a favicon (serve-favicon).
- Added a logo.
- When the 'log in' button on the login page is clicked, if both inputs are empty, it tells you to "please enter your username and password".
- When logged in user attempts to submit white-space comment, it just refreshes the page.
- Moved database connection to new configuration folder.
