import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

// import Button from '@components/Button/Button';
import './Modal.module.css';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const modal = props => {
  console.log({ props })
  // const ref = useRef<Element | null>(null)
  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   ref.current = document.getElementById("modal-root")
  //   setMounted(true)
  // }, [])
  /* (mounted && ref.current) ? */
  // ReactDOM.createPortal(
  return <>
    <Modal open={true} onClose={props.hide} aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description" className="modal">
      <Box sx={style}>
        <Typography color="red" id="modal-modal-title" variant="h6" component="h2">
          {props.title}
        </Typography>
        <Typography className="modal__content" id="modal-modal-description" sx={{ mt: 2 }}>
          {props.content}
        </Typography>
        <Button variant="outlined" onClick={props.hide} >Close</Button>
      </Box>
    </Modal>
  </>
  // <div className="modal">
  //   <header className="modal__header">
  //     <h1>{props.title}</h1>
  //   </header>
  //   <div className="modal__content">{props.children}</div>
  //   <div className="modal__actions">
  //     <Button design="danger" mode="flat" onClick={props.onCancelModal}>
  //       Cancel
  //     </Button>
  //     {/* <Button
  //       mode="raised"
  //       onClick={props.onAcceptModal}
  //       disabled={!props.acceptEnabled}
  //       loading={props.isLoading}
  //     >
  //       Accept
  //     </Button> */}
  //   </div>
  // </div>,
  //   document.getElementById('modal-root')
  // ) : null
}
export default modal;
