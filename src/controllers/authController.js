import { pool } from "../db.js";
import jwt from "jsonwebtoken";

// Use the environment variables for JWT configuration
const jwtKey = process.env.SECRET_KEY || 'docbuddyKey';
const expiresLimit = process.env.EXPIRES_IN || '3000s';

export const registerUser = async (req, res) => {
  const newDoc = req.body;

  try {
    // Check if the user with the provided email already exists
    const [existingDocs] = await pool.query('SELECT * FROM docbuddy.doc WHERE doc_email = ?', [newDoc.doc_email]);


    if (existingDocs.length > 0) {
      // User with the provided email already exists
      // Logger.info(`Registration failed - User with email ${newDoc.doc_email} already exists.`);
      res.render('register', { error: 'User with this email already exists.' });
    } else {
      // User is not registered, insert the new record
      await pool.query('INSERT INTO docbuddy.doc SET ?', [newDoc]);

      // Redirect to the login page after successful registration
      // Logger.info(`Registration successful - User with email ${newDoc.doc_email} registered.`);
      res.render('login', { success: 'Registration successful. Please log in.' });
    }
  } catch (error) {
    // Logger.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
};


export const loginUser = async (req, res) => {
  const { doc_email, doc_password } = req.body;

  try {
    // Query the user from the database based on the provided email
    const [docRows] = await pool.query('SELECT * FROM docbuddy.doc WHERE doc_email = ?', [doc_email]);

    // Check if the user exists
    if (docRows.length === 1) {
      const doc = docRows[0];

      // Compare the provided password with the password from the database
      if (doc_password === doc.doc_password) {
        jwt.sign({ doc }, jwtKey, { expiresIn: expiresLimit }, (err, token) => {
          if (err) {
            console.error('Error during JWT signing:', err);
            res.status(500).send('Internal Server Error');
            return;
          }

          // Set the JWT token in a cookie named 'docbuddy_authToken'
          res.cookie('docbuddy_authToken', token);

          // Redirect to the search-customers page after successful authentication
          res.redirect('/patientlist');
        });
      } else {
        // Incorrect password
        // Logger.info(`Login failed - Incorrect password.`);
        res.render('login', { error: 'Incorrect password.' });
      }
    } else {
      // Account doesn't exist
      // Logger.info(`Login failed - User with email ${doc_email} does not exist.`);
      res.render('login', { error: 'Account does not exist.' });
    }
  } catch (error) {
    // Logger.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const renderLogin = async (req, res) => {
  // Check if the docbuddy_authToken cookie is present
  if ('docbuddy_authToken' in req.cookies) {
    // Redirect to /patientlist if the token is present
    res.redirect('/patientlist');
  } else {
    // Render the login page
    res.render("login");
  }
};

export const renderRegister = async (req, res) => {
  // Check if the docbuddy_authToken cookie is present
  if ('docbuddy_authToken' in req.cookies) {
    // Redirect to /patientlist if the token is present
    res.redirect('/patientlist');
  } else {
    // Render the register page
    res.render("register");
  }
};



export const logoutUser = async (req, res) => {
  try {
    // Clear the docbuddy_authToken cookie to log the user out
    res.clearCookie('docbuddy_authToken');
    // Redirect to the login page with success message
    res.render("login" , { success : 'Successfully Logout'});
  } catch (error) {
    // Logger.error('Error during logout:', error);
    res.status(500).send('Internal Server Error');
  }
};

