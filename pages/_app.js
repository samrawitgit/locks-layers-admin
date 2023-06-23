import { Component } from "react";

import { AppStore } from "@utils/containers/app.container";
import { PopUpContainer } from "@utils/containers/pop-up.container";
import Layout from "@components/layout";
import ErrorComponent from "@components/ErrorComponent/ErrorComponent";

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
              onClick={() => this.setState({ hasError: false })}
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
      <Layout>
        <ErrorBoundary>
          <PopUpContainer>
            {/* <ErrorComponent /> */}
            {/*error={this.state.error} onHandle={this.errorHandler}*/}
            <Component {...pageProps} />
          </PopUpContainer>
        </ErrorBoundary>
      </Layout>
    </AppStore>
  );
}

export default MyApp;
