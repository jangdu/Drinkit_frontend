import React, {useEffect, useState} from "react";
import axios from "axios";
const { naver } = window;

export default function Test() {
  const [userAddress, setUserAddress] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  // get current position
  useEffect(() => {

    const getUserAddress = async () => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/user/address`, {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (response.status === 200) {
                const data = await response.data;
                setUserAddress(data);
              }
            } catch (error) {
              console.log(error.message);
            }
          };
      
          getUserAddress()
  }, []);

  useEffect(() => {
    // const getStoreAddress = async () => {
    //   try {
    //     const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/스토어주소`, {
    //       withCredentials: true,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     if (response.status === 200) {
    //       const data = await response.data;
    //       getStoreAddress(data);
    //     }
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // };

    // getStoreAddress()


    if (typeof userAddress !== "string") {
      const otherLatLngs = [
        { lat: userAddress[0].lat + 0.02 , lng: userAddress[0].lng + 0.02 },
        { lat: userAddress[0].lat + 0.01 , lng: userAddress[0].lng - 0.02 },
        { lat: userAddress[0].lat - 0.02 , lng: userAddress[0].lng + 0.02 },
        { lat: userAddress[0].lat - 0.02 , lng: userAddress[0].lng - 0.02 },
      ];
      const currentPosition = [userAddress[0].lat, userAddress[0].lng];

      const map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentPosition[0], currentPosition[1]),
        zoom: 15,
        minZoom: 10,
        zoomControl: true,
        mapTypeControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        logoControl: false,
        mapDataControl: false,
      });

      const homeMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(currentPosition[0], currentPosition[1]),
        map,
        icon: {
          path: [
              new naver.maps.Point(0,15), new naver.maps.Point(10, 30), new naver.maps.Point(20, 15),
              new naver.maps.Point(15, 15), new naver.maps.Point(15, 0), new naver.maps.Point(5, 0), new naver.maps.Point(5, 15)
          ],
          style: "closedPath",
          anchor: new naver.maps.Point(13, 35),
          fillColor: '#F9A8D4',
          fillOpacity: 1,
          strokeColor: '#FF8FCC',
          strokeStyle: 'solid',
          strokeWeight: 2
      }
      });

      const contentHomeTags =
        [
          '<div class="iw_inner">',
          '   <h3>나의 집</h3>',
          '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
          '       <img src="이미지url" width="55" height="55" alt="서울시청" class="thumb" /><br />',
          '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
          '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
          '   </p>',
          '</div>'
      ].join('');

      // 주변 마커 나타내기
      const markers = [];
      const infowindows = [];
      const contentTags =
        [
          '<div class="iw_inner">',
          '   <h3>서울특별시청</h3>',
          '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
          '       <img src="이미지url" width="55" height="55" alt="서울시청" class="thumb" /><br />',
          '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
          '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
          '   </p>',
          '</div>'
      ].join('');

      // 나의 집 이벤트
      const infowindowHome = new naver.maps.InfoWindow({
        content: contentHomeTags,
        borderWidth: 1,
        anchorSize: new naver.maps.Size(10, 10),
        pixelOffset: new naver.maps.Point(10, -10),
      });

      const getHomeClickHandler = () => {
        return () => {
          const marker = homeMarker;
          const infoWindow = infowindowHome;

          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        };
      };

      naver.maps.Event.addListener(homeMarker, "click", getHomeClickHandler());

      // 가게 이벤트
      for (let i = 0; i < otherLatLngs.length; i += 1) {
        const otherMarkers = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            otherLatLngs[i].lat,
            otherLatLngs[i].lng
          ),
          map,
          icon:{
            url: './storeLocation.png',
            size: new naver.maps.Size(50,52),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26),
          }
        });

        const infowindow = new naver.maps.InfoWindow({
          content: contentTags,
          borderWidth: 1,
          anchorSize: new naver.maps.Size(10, 10),
          pixelOffset: new naver.maps.Point(10, -10),
        });

        markers.push(otherMarkers);
        infowindows.push(infowindow);
      }

      naver.maps.Event.addListener(map, "idle", () => {
        updateMarkers(map, markers);
      });

      const updateMarkers = (
        isMap,
        isMarkers
      ) => {
        const mapBounds = isMap.getBounds();
        let marker;
        let position;

        for (let i = 0; i < isMarkers.length; i += 1) {
          marker = isMarkers[i];
          position = marker.getPosition();

          if (mapBounds.hasLatLng(position)) {
            showMarker(isMap, marker);
          } else {
            hideMarker(marker);
          }
        }
      };

      const showMarker = (isMap, marker) => {
        marker.setMap(isMap);
      };

      const hideMarker = (marker) => {
        marker.setMap(null);
      };

      const getClickHandler = (seq) => {
        return () => {
          const marker = markers[seq];
          const infoWindow = infowindows[seq];

          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }

        };
      };

      for (let i = 0; i < markers.length; i += 1) {
        naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
      }
    }
  }, [userAddress]);


  return <div id='map' style={{ width: "100%", height: "500px" }} />;
}