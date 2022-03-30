import { React, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [enterEmailId, setEnterEmailId] = useState("");
  const [enterPassword, setEnterPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const adminId = "admin@gmail.com";
  const password = "admin@123";

  let formIsValid = false;

  if (enterEmailId && enterPassword) {
    formIsValid = true;
  }

  const clearInputs = () => {
    setEnterEmailId("");
    setEnterPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  //User Auth
  async function login() {
    clearErrors();
    if (adminId === enterEmailId || password === enterPassword) {
      navigate("/admin");
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(
        auth,
        enterEmailId,
        enterPassword
      );
      localStorage.setItem("currentUser", JSON.stringify(result));

      setLoading(false);
      toast.success("Login sccessful");
      navigate(`/`);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
          setEmailError(error.message);
          break;

        case "auth/wrong-password":
          setPasswordError(error.message);
          break;
      }
      setLoading(false);
    }
  }

  //admin Auth

  return (
    <div className="login-parent">
      {loading && <Loader />}
      <div className="row justify-content-center ">
        <div className="col-md-4 z1">
          <div className="login-form">
            <h2>Login</h2>
            <hr />
            <div className="mb-3">
              <label className="">Email</label>
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
                className="form-control  mt-1"
                placeholder="Password"
                value={enterPassword}
                onChange={(e) => setEnterPassword(e.target.value)}
              />
              <p className="error">{passwordError}</p>
            </div>

            <button
              className={`button-62 mt-2 ${!formIsValid ? "disabled" : ""}`}
              disabled={!formIsValid}
              onClick={login}
              style={{
                pointerEvents: !formIsValid ? "none" : "",
              }}
            >
              Login
            </button>
            <hr />
            <Link to="/signup">Click Here To Sign Up</Link>
          </div>
        </div>
        <div className="col-md-5 z1">
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_hu9cd9.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
      <div className="login-bottom"></div>
    </div>
  );
};

export default LoginPage;
