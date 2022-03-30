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

  const [emailError, setEmailError] = useState("");

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
      switch (error.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEmailError(error.message);
          break;
      }
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

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const formHandler = () => {
    if (!letters.test(enterFirstName)) {
      setFirstNameError(true);
      return 0;
    }
    setFirstNameError(false);

    if (!letters.test(enterLastName)) {
      setLastNameError(true);
      return 0;
    }
    setLastNameError(false);

    if (enterMobileNo.length !== 10) {
      setMobileError(true);
      return 0;
    }
    setMobileError(false);

    /* if (!mailformat.test(enterEmailId)) {
      toast.error("Enter valid email");
      return 0;
    } */
    if (!strongRegex.test(enterPassword)) {
      setpasswordError(true);

      return 0;
    }
    setpasswordError(false);

    if (enterPassword !== enterConfirmPassword) {
      setConfirmPasswordError(true);
      return 0;
    }
    setConfirmPasswordError(false);

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
            <div className="mb-3">
              <label className="">First Name</label>
              <input
                type="text"
                className="form-control  mt-1"
                placeholder="First Name"
                value={enterFirstName}
                onChange={(e) => setEnterFirstName(e.target.value)}
              />
              {firstNameError && (
                <p className="error">First name must be valid</p>
              )}
            </div>
            <div className="mb-3">
              <label className="">Last Name</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Last Name"
                value={enterLastName}
                onChange={(e) => setEnterLasttName(e.target.value)}
              />
              {lastNameError && (
                <p className="error">Last name must be valid</p>
              )}
            </div>
            <div className="mb-3">
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
            </div>
            <div className="mb-3">
              <label className="">Mobile Number</label>
              <input
                type="number"
                className="form-control mt-1"
                placeholder="Mobile Number"
                value={enterMobileNo}
                onChange={(e) => setEnterMobileNo(e.target.value)}
              />
              {mobileError && (
                <p className="error">Mobile number must be 10 digit</p>
              )}
            </div>
            <div className="mb-3">
              <label className="">Email Id</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Id"
                value={enterEmailId}
                onChange={(e) => setEnterEmailId(e.target.value)}
              />
              <p className="error">{emailError}</p>
            </div>
            <div className="mb-3">
              <label className="">Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                value={enterPassword}
                onChange={(e) => setEnterPassword(e.target.value)}
              />
              {passwordError && (
                <p className="error">
                  Password must be 8 characters or longer. And combination of
                  uppercase,lowercase,special characters,numbers.
                </p>
              )}
            </div>
            <div className="mb-3">
              <label className="">Confirm password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Confirm password"
                value={enterConfirmPassword}
                onChange={(e) => setEnterConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && (
                <p className="error">
                  Password and confirm Password must be same
                </p>
              )}
            </div>
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
