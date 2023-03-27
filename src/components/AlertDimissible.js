import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';



const AlertDismissible = () =>   {
  const [show, setShow] = useState(true);
  const[src,setSrc]=useState(null);

  const locationShare = () => {
    
    setSrc("Computer Science Department");
    console.log("Computer Science Department");
    console.log(src);
    setShow(false);
  }
  return (
    <div>
      <Alert show={show} variant="light">
        <Alert.Heading> </Alert.Heading>
        <p>
          Do you want to share your location ?
        </p>
        <div className="d-flex justify-content-end ">

        <div>
        <Button onClick={locationShare} variant="outline-success">
            Yes
          </Button>
        </div>
        <div>
        <Button onClick={() => setShow(false)} variant="outline-success">
            No
          </Button>
        </div>
          
        </div>
      </Alert>

      {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
    </div>
  );
}

export default AlertDismissible;