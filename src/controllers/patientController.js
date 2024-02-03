import { pool } from "../db.js";
import jwt from "jsonwebtoken";

// Use the environment variables for JWT configuration
const jwtKey = process.env.SECRET_KEY || 'docbuddyKey';

/**
 * Middleware to verify the JWT token in the request headers.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function verifyToken(req, res, next) {
  // Retrieve the token from the cookie
  const authToken = req.cookies.docbuddy_authToken;

  // Check if the token is present
  if (authToken) {
    req.token = authToken;
    next();
  } else {
    // Token is missing, redirect to login
    res.render('login', { error: 'Please login to continue.'});
  }
}

/**
 * Handles JWT token verification and executes the callback with authData.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} callback - Callback function to execute with authData
 */
const handleTokenVerification = (req, res, callback) => {
  jwt.verify(req.token, jwtKey, (err, authData) => {
    if (err) {
      // Invalid token
      res.render('login', { error: 'Please login to continue.'});
    } else {
      callback(authData);
    }
  });
};

/**
 * Retrieves a list of patients for the authenticated doctor.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const patientList = async (req, res) => {
  verifyToken(req, res, (authData) => {
    handleTokenVerification(req, res, (authData) => {
      pool.query("SELECT * FROM docbuddy.patient WHERE doc_id = ? ORDER BY patient_update_date DESC LIMIT 9", [authData.doc.doc_id])
        .then(([rows]) => res.render("patientlist", { patients: rows }))
        .catch((error) => res.status(500).send({ result: error.message }));
    });
  });
};

/**
 * Searches for patients based on name and phone for the authenticated doctor.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchPatient = async (req, res) => {
  verifyToken(req, res, (authData) => {
    handleTokenVerification(req, res, (authData) => {
      const { patient_name, patient_whatsapp_number } = req.query;
      pool.query("SELECT * FROM docbuddy.patient WHERE doc_id = ? AND patient_name LIKE '%"+patient_name+"%' AND patient_whatsapp_number LIKE '%"+patient_whatsapp_number+"%' ORDER BY patient_update_date DESC LIMIT 9",
        [authData.doc.doc_id])
        .then(([rows]) => res.render("patientlist", { patients: rows }))
        .catch((error) => res.status(500).send({ result: error.message }));
    });
  });
};

/**
 * Retrieves details of a single patient for the authenticated doctor.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const singlePatient = async (req, res) => {
  verifyToken(req, res, (authData) => {
    handleTokenVerification(req, res, (authData) => {
      const { patient_id } = req.params; 
      pool.query("SELECT * FROM docbuddy.patient WHERE doc_id = ? AND patient_id = ?", [authData.doc.doc_id, patient_id])
        .then(([result]) => {
          if (result.length > 0) {
            res.render("single-patient", { patient: result[0] });
          } else {
            // Patient not found
            res.status(404).send({ result: "Patient not found" });
          }
        })
        .catch((error) => res.status(500).send({ result: error.message }));
    });
  });
};

/**
 * Renders the addPatient form.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const renderAddPatient = async (req, res) => {
  verifyToken(req, res, () => {
    // Rendering the addPatient form
    res.render("addpatient");
  });
};

/**
 * Adds a new patient for the authenticated doctor.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addPatient = async (req, res) => {
  // Use the verifyToken middleware to authenticate the request
  verifyToken(req, res, async (authData) => {
    // Use the handleTokenVerification utility for additional verification
    handleTokenVerification(req, res, async (authData) => {
      try {
        // Extract patient data from the request body
        const {
          patient_name,
          patient_age,
          patient_gender,
          patient_bloodgroup,
          patient_whatsapp_number,
          patient_email,
          patient_address,
        } = req.body;

        // Construct the SQL query to insert a new patient into the database
        const insertQuery = `
          INSERT INTO docbuddy.patient
          (patient_name, patient_age, patient_gender, patient_bloodgroup, patient_whatsapp_number, patient_email, patient_address, patient_creation_date, patient_update_date, doc_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
        `;

        // Execute the query with the provided patient data
        const result = await pool.query(insertQuery, [
          patient_name,
          patient_age,
          patient_gender,
          patient_bloodgroup,
          patient_whatsapp_number,
          patient_email,
          patient_address,
          authData.doc.doc_id, // Assuming doc_id is derived from the authenticated user
        ]);

        // Check if the insertion was successful
        if (result[0].affectedRows > 0) {
          // Patient added successfully
          res.render("addpatient", { success: "Patient Added Successfully" });
        } else {
          // Failed to add patient
          res.render("addpatient", { error: "Failed to Add Patient" });
        }
      } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).send('Internal Server Error');
      }
    });
  });
};

export const getPatientInfo = async (req, res) => {
  verifyToken(req, res, (authData) => {
    handleTokenVerification(req, res, async (authData) => {
      try {
        const { patient_id } = req.body || {};

        // Fetch patient details from the database
        const [patientResult] = await pool.query("SELECT * FROM docbuddy.patient WHERE doc_id = ? AND patient_id = ?", [authData.doc.doc_id, patient_id]);

        if (patientResult.length > 0) {
          const patient = patientResult[0];

          // Combine patient details with form data
          const combinedData = {
            patient,
            formData: req.body, // Assuming form data is sent in the request body
          };

          console.log(combinedData)

          // Render a new page with combined data
          res.render("print-patient", combinedData);
        } else {
          // Patient not found
          res.status(404).send({ result: "Patient not found" });
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        res.status(500).send({ result: "Internal server error" });
      }
    });
  });
};

export const renderEditPatient = async (req, res) => {
  verifyToken(req, res, (authData) => {
    handleTokenVerification(req, res, (authData) => {
      const { patient_id } = req.params; 
      pool.query("SELECT * FROM docbuddy.patient WHERE doc_id = ? AND patient_id = ?", [authData.doc.doc_id, patient_id])
        .then(([result]) => {
          if (result.length > 0) {
            res.render("edit-patient", { patient: result[0] });
          } else {
            // Patient not found
            res.status(404).send({ result: "Patient not found" });
          }
        })
        .catch((error) => res.status(500).send({ result: error.message }));
    });
  });
};


export const editPatient = async (req, res) => {
  // Use the verifyToken middleware to authenticate the request
  verifyToken(req, res, async (authData) => {
    // Use the handleTokenVerification utility for additional verification
    handleTokenVerification(req, res, async (authData) => {
      try {
        // Extract patient data from the request body
        const {
          patient_id,
          patient_name,
          patient_age,
          patient_gender,
          patient_bloodgroup,
          patient_whatsapp_number,
          patient_email,
          patient_address,
        } = req.body;

        // Construct the SQL query to insert a new patient into the database
        const insertQuery = `
          UPDATE docbuddy.patient SET
          patient_name = ?, patient_age = ?, patient_gender = ?, patient_bloodgroup = ?, patient_whatsapp_number = ?, patient_email = ?, patient_address = ?, patient_update_date = NOW()
          WHERE doc_id = ? AND patient_id = ?          
        `;

        // Execute the query with the provided patient data
        const result = await pool.query(insertQuery, [
          patient_name,
          patient_age,
          patient_gender,
          patient_bloodgroup,
          patient_whatsapp_number,
          patient_email,
          patient_address,
          authData.doc.doc_id, // Assuming doc_id is derived from the authenticated user
          patient_id
        ]);

        //Fetch Patient again
        const resultPatient = await pool.query(
          "SELECT * FROM docbuddy.patient WHERE doc_id = ? AND patient_id = ?", 
          [authData.doc.doc_id, patient_id]);

        // Check if the edit was successful
        if (result[0].affectedRows > 0) {
          // Patient edit successfully
          res.render("edit-patient", { patient: resultPatient[0][0], success: "Patient updated Successfully." });
        } else {
          // Failed to add patient
          res.render("edit-patient", { patient: resultPatient[0][0], error: "Failed to update patient details." });
        }
      } catch (error) {
        console.error("Error editing patient:", error);
        res.status(500).send('Internal Server Error');
      }
    });
  });
};

export const deletePatient = async (req, res) => {
  // Use the verifyToken middleware to authenticate the request
  verifyToken(req, res, async (authData) => {
    // Use the handleTokenVerification utility for additional verification
    handleTokenVerification(req, res, async (authData) => {
      try {
        // Extract patient data from the request body
        const {patient_id} = req.params;

        // Construct the SQL query to insert a new patient into the database
        const insertQuery = `
          DELETE FROM docbuddy.patient WHERE doc_id = ? AND patient_id = ?          
        `;

        // Execute the query with the provided patient data
        const result = await pool.query(insertQuery, [
          authData.doc.doc_id, // Assuming doc_id is derived from the authenticated user
          patient_id
        ]);

        // Check if the edit was successful
        if (result[0].affectedRows > 0) {
          // Patient edit successfully
          res.redirect("/patientlist");
        } else {
          // Failed to add patient
          console.log("Failed to delete patient")
          res.redirect("/patientlist");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        res.redirect("/patientlist");
      }
    });
  });
};