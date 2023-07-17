import React from "react";

import Modal from "@components/Modal/Modal";

// export interface PopUpOptions {
//   type?: PopUpTypes | string;
//   timeout?: boolean | number;
//   onDismiss?: () => void;
//   title?: string;
//   subTitle?: boolean;
//   onConfirm?: () => void;
//   data?: any;
//   dismissOnBackdropTouch?: boolean;
//   content?: any;
//   locked?: boolean;
//   component?: () => JSX.Element;
// }

interface PopUpInterface {
  showPopUp: (options) => void; // : PopUpOptions
  hidePopUp: () => void;
  state: any; // PopUpState
}

interface PopUpState {
  show: boolean;
  // options?: PopUpOptions;
}

export const PopUpContext = React.createContext<PopUpInterface>(null);

export const PopUpContainer = (props) => {
  const { children } = props;

  const [state, setState] = React.useState<any>({
    // PopUpState
    show: false,
    title: "",
    message: null,
    footer: null,
    options: { component: null },
    onClose: () => {},
  });

  const show = ({
    title,
    content,
    footer,
    options = { component: null },
    onClose = () => {},
  }) => {
    setState({
      show: true,
      title,
      content,
      footer,
      options,
      onClose,
    });
  };

  const hide = () => {
    if (state.options.onDismiss) {
      state.options.onDismiss();
    }
    setState({
      show: false,
      title: "",
      content: null,
      footer: null,
      options: { component: null },
      onClose: () => {},
    });
  };

  return (
    <PopUpContext.Provider
      value={{
        showPopUp: show,
        hidePopUp: hide,
        state: state,
      }}
    >
      {children}
      {state.show && (
        <Modal
          {...state}
          hide={() => {
            hide();
            state.onClose();
          }}
        />
      )}
    </PopUpContext.Provider>
  );
};
