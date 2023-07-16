import { useContext, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
import _isEmpty from "lodash/isEmpty";

import { AppContext } from "@utils/containers/app.container";
import { useHttpClient } from "@utils/hooks/httpClient";
import { PopUpContext } from "@utils/containers/pop-up.container";
import { useTheme } from "@mui/material/styles";
import {
  StyledFormGroup,
  StyledInputLabel,
  StyledInput,
  StyledButton,
} from "./StyledLogin";

const Login = (props) => {
  const router = useRouter();
  const theme = useTheme();
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AppContext);
  const { showPopUp, hidePopUp } = useContext(PopUpContext);
  const { sendRequest } = useHttpClient();

  if (isLoggedIn) {
    router.push("/");
  }

  const userNameInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();

  const login = async (e) => {
    e.preventDefault();
    console.log(userNameInputRef.current.value);
    try {
      if (!userNameInputRef.current.value || !passwordInputRef.current.value) {
        showPopUp({
          title: "Wrong credentials",
          content: "Insert valid credentials",
        });
        return;
      }
      const resData = await sendRequest(
        "http://localhost:8080/auth/admin-login",
        "POST",
        JSON.stringify({
          userName: userNameInputRef.current?.value,
          password: passwordInputRef.current?.value,
        }),
        {
          "Content-type": "application/json",
          // "Authorization": 'Bearer ' + this.props.token //Bearer is a convention
        }
      );
      console.log({ resData });

      // ... // only executes in case of res.ok
      setIsLoggedIn(true);
      setUser(resData);
      localStorage.setItem("token", resData.token);
      localStorage.setItem("userId", resData.userId);
      const remainingMilliseconds = 60 * 60 * 1000;
      const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
      localStorage.setItem("expiryDate", expiryDate.toISOString());
      router.push("/");
    } catch (err) {
      console.log(err);
      showPopUp({ title: "Failed to authenticate", content: "try again" });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        height: "100%",
        width: "100%",
        margin: "0",
        padding: "0",
        placeItems: "center",
        position: "absolute",
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <Head>
        <title>Admin Login</title>
        {/* <meta
          name='description'
          content='Locks&Layers admin application'
        /> */}
      </Head>
      <Card
        style={{
          backgroundColor: theme.palette.primary.main,
          borderRadius: "30px",
          margin: "20px 0",
          padding: "20px 50px",
          width: "350px",
        }}
      >
        <CardContent>
          <StyledFormGroup>
            <StyledInputLabel htmlFor="userName">Username</StyledInputLabel>
            <StyledInput
              name="userName"
              id="userName"
              inputRef={userNameInputRef}
              type="text"
              required
            />
            <StyledInputLabel htmlFor="password">Password</StyledInputLabel>

            <StyledInput
              name="password"
              id="password"
              type="password"
              inputRef={passwordInputRef}
              required
            />
            <StyledButton onClick={login}>Login</StyledButton>
          </StyledFormGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
