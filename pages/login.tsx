import { useContext, useRef, useState } from "react";
import Head from "next/head";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
import _isEmpty from "lodash/isEmpty";

import { PopUpContext } from "@utils/containers/pop-up.container";
import { useTheme } from "@mui/material/styles";
import {
  StyledFormGroup,
  StyledInputLabel,
  StyledInput,
  StyledButton,
} from "../public/css/StyledLogin";
import { withSessionSsr } from "@utils/.";

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
    setIsLoading(true);

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

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    // Grabs the authentication cookie from the session
    const user = req.session.user;

    // Checks if the authentication cookie is set in the request and if it's valid
    // If it is, redirects the user to the homepage

    if (user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: { isLoggedIn: !!user },
    };
  }
);
