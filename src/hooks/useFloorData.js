// // // import { useEffect,useState } from "react";
// // // import {getFloors} from '../api/index'

// // export const useFloorData = () => {
// //     const [data, setData] = useState([])
    
// //     useEffect(() => {
// //         getFloors().then(res => {
// //             setData(res.data)
// //             console.log(res.data);
// //         }).catch(err => console.log(err))
// //     }, [])

// //     return { data }
// // }

// import React, { useState, useEffect } from "react";
// import {getFloors} from '../api/index'

// function useFloorData() {
//     const [data, setData] = useState([])

//   useEffect(() => {
//     getFloors().then(res => {
//         setData(res.data)
//         console.log(res.data);
//     }).catch(err => console.log(err))
//   }, [data]);

//   return (
//     <div>
//       <ChildComponent data={data}/>
//     </div>
//   );
// }

// function ChildComponent(props) {

//   return (
//     <div>
//       <p>{props.data}</p>
//     </div>
//   );
// }

// export default useFloorData;
