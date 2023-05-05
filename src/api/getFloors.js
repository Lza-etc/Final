// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function getFloors() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get("http://127.0.0.1:5000/floors/cse1")
//       .then((response) => {
//         setData(response.data);
//         console.log(data);
//       })
//       .catch((error) => {
//         console.log("User API call not complete");
//       });
//   }, []);
//   return (
//     <div>hello
//     </div>
//   );
// }



import axios from 'axios';

const getFloors = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/floors/cse1");
    return response.data;
  } catch (error) {
    console.error("User API call not complete");
  }
};

export default getFloors;
