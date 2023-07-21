import React, { useContext } from 'react';

import { AppContext } from '@utils/containers/app.container';
// import Backdrop from '@components/Backdrop/Backdrop';
import Modal from '@components/Modal/Modal';

const ErrorComponent = (props) => {
  // const { error, setError } = useContext(AppContext)
  // console.log({ error })
  return (
    <>
      {/* {error && <Backdrop onClick={setError(false)} />} */}
      {/* {error && ( */}
      <Modal
        title="An Error Occurred"
        onCancelModal={props.onCancel}
        // onAcceptModal={setError(false)}
        acceptEnabled
      >
        <p>Oops!</p>
        {/* <p>{error.message}</p> */}
      </Modal>
      {/* )} */}
    </>
  )
};

export default ErrorComponent;