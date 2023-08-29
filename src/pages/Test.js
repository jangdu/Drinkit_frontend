// import React from "react";
// import {
//   NavermapsProvider,
//   Container as MapDiv,
//   NaverMap,
//   Marker,
//   useNavermaps,
// } from "react-naver-maps";
// export default function Test() {
//   const navermaps = useNavermaps();
//   console.log("ddddddddddd", navermaps)
//   return (
//       <MapDiv
//         style={{
//           width: "50%",
//           height: "500px", 
//         }}>
//         <NaverMap
//           zoomControl
//           zoomControlOptions={{
//             position: navermaps.Position.TOP_RIGHT,
//           }}
//           defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
//           defaultZoom={13}
//           // min/max 줌 레벨
//           minZoom={10}
//           maxZoom={21}
//           // 지도 컨트롤
//         >
            
//           <Marker position={new navermaps.LatLng(37.3595704, 127.105399)} />
//         </NaverMap>
//       </MapDiv>
//   );
// }







import React, {useEffect, useRef} from "react";
import { NavermapsProvider , Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import styled from "styled-components"


const MapContainer = styled.div`{
  width: 100vw;
  height: 500vh; 
}`;

export default function Test() {
  const navermaps = useNavermaps()
  console.log("네맵",navermaps)
  const mapRef = useRef(null);

  useEffect(()=>{
    mapRef.current = new navermaps.Map("map",{
      defaultCenter: new navermaps.LatLng(36.3595704, 127.105399),
      zoom: 15,
      zoomControl: true,
      minZoom: 10,
      
      mapTypeControl: true,
      zoomControlOptions: {
        position: navermaps.Position.TOP_RIGHT,
      },
      logoControl: false,
      mapDataControl: false,
    })

    new navermaps.Marker({
      position: new navermaps.LatLng(36.3595704, 127.105399),
      map: mapRef.current,
      zIndex: 999,
    })
  })
   return (
    <>
    <MapContainer id="map" style={{
        width: "100%",
        height: "600px",
      }}>
    </MapContainer>
    </>
    );
 }