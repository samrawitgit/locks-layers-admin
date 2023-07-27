import { Component, useContext } from "react";
import App from "next/app";

import { AppStore } from "@utils/containers/app.container";
import { PopUpContainer } from "@utils/containers/pop-up.container";
import Layout from "@components/layout";
import ErrorComponent from "@components/ErrorComponent/ErrorComponent";
import { RouteGuard } from "@components/RouteGuard";
// import { SessionProvider } from "next-auth/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, errorInfo) {
    const error_ = `${error.stack} \n ${errorInfo.componentStack}`;
    // mediumLevel.debug.log(error_).then();
    this.setState({ hasError: error_ });
  }

  /* <AppStore>
    <Layout>
      <ErrorComponent onCancel={this.setState({ hasError: false })} />
    </Layout>
  </AppStore> */

  render() {
    return (
      <>
        {this.state.hasError ? (
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
        ) : (
          this.props.children
        )}
      </>
    );
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
