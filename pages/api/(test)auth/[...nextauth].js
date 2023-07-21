import { useHttpClient } from "@utils/hooks/httpClient";
import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
// const { showPopUp, hidePopUp } = useContext(PopUpContext);
// const { isLoading, error, sendRequest, clearError } = useHttpClient();

export const authOptions = {
  session: {
    strategy: "jwt", // to allow creation of JWTs
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, //24 hours
  },
  // jwt: {
  //   secret: "secret", // process.env.JWT_SECRET,
  //   // The maximum age of the NextAuth.js issued JWT in seconds.
  //   // Defaults to `session.maxAge`.
  //   maxAge: 60 * 60 * 1000,
  //   // You can define your own encode/decode functions for signing and encryption
  //   // async encode() {},
  //   // async decode() {},
  // },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      // name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   userName: { label: "Username", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" },
      // },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log("something entered", { credentials });

        const response = await fetch("http://localhost:8080/auth/admin-login", {
          method: "POST",
          body: JSON.stringify({
            userName: credentials.username,
            password: credentials.password,
          }),
          headers: {
            "Content-type": "application/json",
            // "Authorization": 'Bearer ' + this.props.token //Bearer is a convention
          },
        });
        console.log({ response });
        const resData = await response.json();

        console.log({ user });

        // ... // only executes in case of res.ok
        // setIsLoggedIn(true);
        // localStorage.setItem("token", resData.token);
        // localStorage.setItem("userId", resData.userId);
        // const remainingMilliseconds = 60 * 60 * 1000;
        // const expiryDate = new Date(
        //   new Date().getTime() + remainingMilliseconds
        // );
        // localStorage.setItem("expiryDate", expiryDate.toISOString());
        // router.push("/");
        // return user
        // } catch (err) {
        //   console.log(err);
        //   return {
        //     title: "Failed to authenticate",
        //     content: "try again",
        //   }
        // }
        // };

        //---------

        if (!resData.error) {
          // Any object returned will be saved in `user` property of the JWT
          return { token: resData.token, userId: resData.userId };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    async signIn({ userName, password }) {
      //return true
      const res = await fetch("http://localhost:8080/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({
          userName,
          password,
        }),
        headers: {
          "Content-type": "application/json",
          // "Authorization": 'Bearer ' + this.props.token //Bearer is a convention
        },
      });
      console.log({ res });

      if (res.ok) {
        // only executes in case of res.ok
        const resData = await res.json();
        // setIsLoggedIn(true);
        // setUser(resData.userId);
        // setToken(resData.token);
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        // router.push("/");
        return { error: false, token: resData.token, userId: resData.userId };
      } else {
        return { error: true, message: "Failed to authenticate" };
      }
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    // async session({ session, req, res }) {
    //   token = localStorage.getItem("token");
    //   userId = localStorage.getItem("userId");
    //   session.token = token;
    //   sessionStorage.user = userId;
    //   // return jwt(req, res);
    //   return "hi"; /*{ ...session };*/
    // },
    async jwt({ token, user }) {
      if (token || user) {
        token.userRole = "admin";
        return { ...token };
      }
    },
  },
};
export default NextAuth(authOptions);
