import { use, useContext, useRef, useState } from "react";
import Head from "next/head";
import { FormGroup, Input, Button, InputLabel } from "@mui/material";
import { useRouter } from "next/router";
import _isEmpty from "lodash/isEmpty";

import { AppContext } from "@utils/containers/app.container";
import { useHttpClient } from "@utils/hooks/httpClient";
import { PopUpContext } from "@utils/containers/pop-up.container";

const Login = (props) => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { showPopUp, hidePopUp } = useContext(PopUpContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
    <div>
      <Head>
        <title>Admin Login</title>
        {/* <meta
          name='description'
          content='Locks&Layers admin application'
        /> */}
      </Head>
      <h1>Login</h1>
      <FormGroup>
        <InputLabel htmlFor="userName">user name</InputLabel>
        <Input name="userName" id="userName" inputRef={userNameInputRef} />
        <InputLabel htmlFor="password">password</InputLabel>
        <Input
          name="password"
          id="password"
          type="password"
          inputRef={passwordInputRef}
        />
        <Button onClick={login}>Login</Button>
      </FormGroup>
    </div>
  );
};

export default Login;
