import { useContext, useRef, useState, FormEvent } from "react";
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
} from "../public/css/StyledLogin";
import { GetServerSideProps } from "next";

export const loginFn = async (
  userName: string,
  password: string
): Promise<Response> => {
  const response = await fetch(`/api/login`, {
    method: "POST",
    body: JSON.stringify({ userName, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log({ response });
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
  return response;
};

const Login = (props) => {
  const router = useRouter();
  const theme = useTheme();
  const { showPopUp } = useContext(PopUpContext);

  const [isLoading, setIsLoading] = useState(false);

  const userNameInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();

  const handleLogin = async (e) => {
    console.log("clicked");
    // Sets the isSubmittingState to true so the submit button
    // gets disabled until the operation completes.
    setIsLoading(true);

    // Prevents the form submission from reloading the page.
    e.preventDefault();

    if (!userNameInputRef.current.value || !passwordInputRef.current.value) {
      showPopUp({
        title: "Wrong credentials",
        content: "Insert valid credentials",
      });
      return;
    }
    try {
      const loginRes = await loginFn(
        userNameInputRef.current.value,
        passwordInputRef.current.value
      );
      if (loginRes.ok) {
        router.push("/");
      }
    } catch (err) {
      console.log({ err });
      showPopUp({ title: "Failed to authenticate", content: "try again" });
    } finally {
      setIsLoading(false);
    }
  };

  // const login = async (e) => {
  //   e.preventDefault();
  //   console.log(userNameInputRef.current.value);
  //   try {
  //     if (!userNameInputRef.current.value || !passwordInputRef.current.value) {
  //       showPopUp({
  //         title: "Wrong credentials",
  //         content: "Insert valid credentials",
  //       });
  //       return;
  //     }

  //     const resData = await sendRequest(
  //       "http://localhost:8080/auth/admin-login",
  //       "POST",
  //       {
  //         userName: userNameInputRef.current?.value,
  //         password: passwordInputRef.current?.value,
  //       },
  //       {
  //         "Content-type": "application/json",
  //       }
  //     );
  //     console.log({ resData });

  //     // only executes in case of res.ok
  //     setUser(resData.userId);
  //     setToken(resData.token);
  //     setIsLoggedIn(true);
  //     localStorage.setItem("token", resData.token);
  //     localStorage.setItem("userId", resData.userId);
  //     const remainingMilliseconds = 60 * 60 * 1000;
  //     const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
  //     localStorage.setItem("expiryDate", expiryDate.toISOString());
  //     router.push("/");
  //   } catch (err) {
  //     console.log(err);
  //     showPopUp({ title: "Failed to authenticate", content: "try again" });
  //   }
  // };
  // console.log({ user, token, isLoggedIn });

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
            <StyledButton onClick={handleLogin}>Login</StyledButton>
          </StyledFormGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Grabs the authentication cookie from the HTTP request
  const accessToken = context.req.cookies["SID"];

  // If it is, redirects the user to the homepage
  if (accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // In this example, we don't need the access token for anything on the client's side.
  // If we did, we could either pass the access token to the client via props
  // or we could decode the token, extract the data we need, and pass this data via props.
  return {
    props: { isLoggedIn: false },
  };
};
