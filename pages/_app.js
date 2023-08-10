import { Component, useContext } from "react";
import App from "next/app";

import { AppStore } from "@utils/containers/app.container";
import { PopUpContainer } from "@utils/containers/pop-up.container";
import Layout from "@components/layout";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the error UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
    // ---------OLD------
    // const error_ = `${error.stack} \n ${errorInfo.componentStack}`;
    // // mediumLevel.debug.log(error_).then();
    // this.setState({ hasError: error_ });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <AppStore>
      <PopUpContainer>
        <Layout {...pageProps}>
          <ErrorBoundary>
            {/* <ErrorComponent /> */}
            {/*error={this.state.error} onHandle={this.errorHandler}*/}
            {/* <SessionProvider session={session}> */}
            {/* <RouteGuard> */}
            <Component {...pageProps} />
            {/* </RouteGuard> */}
            {/* </SessionProvider> */}
          </ErrorBoundary>
        </Layout>
      </PopUpContainer>
    </AppStore>
  );
}

export default MyApp;
