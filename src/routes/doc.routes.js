import { Router } from "express";
import {
  // createCustomers,
  // deleteCustomer,
  // editCustomer,
  patientList,
  // renderCustomers,
  searchPatient,
  singlePatient,
  renderAddPatient,
  addPatient,
  getPatientInfo,
  renderEditPatient,
  editPatient,
  deletePatient
  // updateCustomer,
} from "../controllers/patientController.js";
import { loginUser, registerUser, renderLogin, renderRegister, logoutUser } from "../controllers/authController.js";
const router = Router();

// router.get("/", renderCustomers);
// router.post("/add", createCustomers);
// router.get("/update/:id", editCustomer);
// router.post("/update/:id", updateCustomer);
// router.get("/delete/:id", deleteCustomer);
router.get("/patientlist", patientList);
router.get("/search", searchPatient);
router.get("/patient/:patient_id", singlePatient);
router.get("/register", renderRegister);
router.get("/login", renderLogin);
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/render-AddPatient", renderAddPatient);
router.post("/add-patient", addPatient);
router.post("/prescribe", getPatientInfo);
router.get("/logout", logoutUser);
router.get("/edit/:patient_id", renderEditPatient);
router.post("/update-patient/done", editPatient);
router.get("/delete/:patient_id", deletePatient);


export default router;
