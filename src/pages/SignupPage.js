import React from "react";

import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import fireDB from "../fireConfig";

const SignupPage = () => {
  const [enterFirstName, setEnterFirstName] = useState("");
  const [enterLastName, setEnterLasttName] = useState("");
  const [enterGender, setEnterGender] = useState("");
  const [enterMobileNo, setEnterMobileNo] = useState("");
  const [enterEmailId, setEnterEmailId] = useState("");
  const [enterPassword, setEnterPassword] = useState("");
  const [enterConfirmPassword, setEnterConfirmPassword] = useState("");

  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var letters = /^[A-z ]+$/;
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  let formIsValid = false;

  if (
    enterFirstName &&
    enterLastName &&
    enterMobileNo &&
    enterEmailId &&
    enterPassword &&
    enterConfirmPassword
  ) {
    formIsValid = true;
  }

  async function signUp() {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        enterEmailId,
        enterPassword
      );
      console.log(result);
      setLoading(false);
      toast.success("Sign up sccessful");
      navigate(`/login`);
    } catch (error) {
      toast.error("Sign up failed ");
      setLoading(false);
    }

    const users = {
      firstName: enterFirstName,
      lastName: enterLastName,
      gender: enterGender,
      mobileNo: enterMobileNo,
      password: enterPassword,
      confirmPassword: enterConfirmPassword,
    };

    try {
      const result = await addDoc(collection(fireDB, "users"), users);
    } catch (error) {
      toast.error("failed");
    }
  }

  const formHandler = () => {
    if (!letters.test(enterFirstName) || !letters.test(enterLastName)) {
      toast.error("Enter valid name");
      return 0;
    }
    if (enterMobileNo.length !== 10) {
      toast.error("Enter valid mobile number");
      return 0;
    }
    if (!mailformat.test(enterEmailId)) {
      toast.error("Enter valid email");
      return 0;
    }
    if (!strongRegex.test(enterPassword)) {
      toast.error(
        "Password must be eight characters or longer.Password must be combination of [a-z][A-Z][0-9][!@#$%^&*]"
      );
      return 0;
    }
    if (enterPassword !== enterConfirmPassword) {
      toast.error("Password and confrim password must be same");
      return 0;
    }

    signUp();
  };

  return (
    <div className="signup-parent">
      {loading && <Loader />}
      <div className="signup-top"></div>
      <div className="row justify-content-center ">
        <div className="col-md-5">
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_yr6zz3wv.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="col-md-4 z1">
          <div className="signup-form">
            <h2>Sign Up</h2>
            <hr />
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={enterFirstName}
              onChange={(e) => setEnterFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={enterLastName}
              onChange={(e) => setEnterLasttName(e.target.value)}
            />
            <input
              className="radio-btn"
              type="radio"
              name="radiogroup1"
              value="male"
              onChange={(e) => setEnterGender(e.target.value)}
            />
            <label htmlFor="rd1">Male</label>
            <input
              className="radio-btn"
              type="radio"
              name="radiogroup1"
              value="female"
              onChange={(e) => setEnterGender(e.target.value)}
            />
            <label htmlFor="rd2">Female</label>
            <input
              className="radio-btn"
              type="radio"
              name="radiogroup1"
              value="other"
              onChange={(e) => setEnterGender(e.target.value)}
            />
            <label htmlFor="rd3">Other</label>
            <input
              type="number"
              className="form-control"
              placeholder="Mobile Number"
              value={enterMobileNo}
              onChange={(e) => setEnterMobileNo(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email Id"
              value={enterEmailId}
              onChange={(e) => setEnterEmailId(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={enterPassword}
              onChange={(e) => setEnterPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={enterConfirmPassword}
              onChange={(e) => setEnterConfirmPassword(e.target.value)}
            />
            <button
              className={`button-62 mt-3 ${!formIsValid ? "disabled" : ""}`}
              disabled={!formIsValid}
              onClick={formHandler}
              style={{
                pointerEvents: !formIsValid ? "none" : "",
              }}
            >
              Sign Up
            </button>
            <hr />
            <Link to="/login">Click Here To Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
