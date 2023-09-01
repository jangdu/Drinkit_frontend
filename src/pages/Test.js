import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import _debounce from "lodash/debounce";
import haversine from "haversine";
import Cart from "../components/Cart";
import { RequestPay } from "../components/Iamport";
const { naver } = window;

export default function Test() {
  const [user, setUser] = useState("");
  const [userAddressArr, setUserAddressArr] = useState([{ address: "" }]);
  const { cartItems } = useCart();
  const [storeAddress, setStoreAddress] = useState("");
  const [markerInfo, setMarkerInfo] = useState();
  const [value, setValue] = useState();
  const [storeId, setStoreId] = useState(null);
  const [usePoint, setUsePoint] = useState(0);
  const [input, setInput] = useState("서울시");
  const [currentPosition, setCurrentPosition] = useState([]);
  const requstPay = new RequestPay();
  let showMarkersInfo = [];

  const addressGeocode = async (address) => {
    await naver.maps.Service.geocode(
      { query: address },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something wrong!");
        }
        const lat = response.v2.addresses[0].y;
        const lng = response.v2.addresses[0].x;

        setCurrentPosition([lat, lng]);
      }
    );
  };

  let showMarkers = [];
  const updateMarkers = (isMap, isMarkers) => {
    const mapBounds = isMap.getBounds();
    let marker;
    let position;
    showMarkers = [];
    showMarkersInfo = [];
    for (let i = 0; i < isMarkers.length; i += 1) {
      marker = isMarkers[i];
      position = marker.getPosition();
      if (mapBounds.hasLatLng(position)) {
        showMarker(isMap, marker);
      } else {
        hideMarker(marker);
      }
    }

    // 마커
    for (let k = 0; k < showMarkers.length; k++) {
      let distance = haversine(
        { latitude: currentPosition[0], longitude: currentPosition[1] },
        {
          latitude: storeAddress[showMarkers[k]]["lat"],
          longitude: storeAddress[showMarkers[k]]["lng"],
        },
        { unit: "km" }
      );
      showMarkersInfo.push({
        name: storeAddress[showMarkers[k]]["name"],
        distance,
        storeId: storeAddress[showMarkers[k]]["id"],
      });
    }
    setMarkerInfo(showMarkersInfo);
  };
  const showMarker = (isMap, marker) => {
    marker.setMap(isMap);
    if (marker.map !== null) {
      showMarkers.push(marker.title);
    }
  };

  const hideMarker = (marker) => {
    marker.setMap(null);
  };

  // get current position
  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVERURL}/user/profile`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const data = await response.data;
          setUser(data);
          setUserAddressArr(JSON.parse(data.address));
          setInput(JSON.parse(data.address)[0].address);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getuser();
  }, []);

  useEffect(() => {
    if (user) {
      if (Number(usePoint) > Number(user.point)) {
        setUsePoint(user.point);
      }
    }
  }, [usePoint]);
  useEffect(() => {
    const debouncedSendRequest = _debounce(() => {
      let productData = "?";
      for (let i = 0; i < cartItems.length; i++) {
        productData += `data[${i}][productId]=${cartItems[i].productId}&data[${i}][count]=${cartItems[i].count}&`;
      }
      const getStoreAddress = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_SERVERURL}/stores${productData}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            const data = await response.data;
            setStoreAddress(data);
            setValue("");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getStoreAddress();
    }, 1000);

    debouncedSendRequest();

    return () => {
      debouncedSendRequest.cancel();
    };
  }, [cartItems]);

  useEffect(() => {
    if (typeof user !== "string") {
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
            new naver.maps.Point(0, 15),
            new naver.maps.Point(10, 30),
            new naver.maps.Point(20, 15),
            new naver.maps.Point(15, 15),
            new naver.maps.Point(15, 0),
            new naver.maps.Point(5, 0),
            new naver.maps.Point(5, 15),
          ],
          style: "closedPath",
          anchor: new naver.maps.Point(13, 35),
          fillColor: "#F9A8D4",
          fillOpacity: 1,
          strokeColor: "#FF8FCC",
          strokeStyle: "solid",
          strokeWeight: 2,
        },
      });

      const contentHomeTags = `<div class="iw_inner">
          <h3>나의 집</h3>
            <p>${userAddressArr[0].address}<br />
            </p>
        </div>`;

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

      // 주변 가게 마커 나타내기
      const markers = [];
      const infowindows = [];
      const contentTags = [];

      // 가게 배열 생성
      const storeAddressArray = [];
      for (let j = 0; j < storeAddress.length; j++) {
        contentTags.push(
          `<div class="iw_inner" style="width: 300px">
              <h3>${storeAddress[j].name}</h3>
              <p>${storeAddress[j].desccription}<br />
                  <img src=${storeAddress[j].imgUrls} width="100" height="100" alt=${storeAddress[j].name} class="thumb" /><br />
                  <p>${storeAddress[j].address}<br />
              </p>
          </div>`
        );
        storeAddressArray.push({
          id: j,
          address: storeAddress[j].address,
          lat: storeAddress[j].lat,
          lng: storeAddress[j].lng,
        });
      }

      // 가게 이벤트
      for (let i = 0; i < storeAddressArray.length; i += 1) {
        const otherMarkers = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            storeAddressArray[i].lat,
            storeAddressArray[i].lng
          ),
          map,
          title: storeAddressArray[i].id,
        });

        const infowindow = new naver.maps.InfoWindow({
          content: contentTags[i],
          borderWidth: 1,
          anchorSize: new naver.maps.Size(10, 10),
          pixelOffset: new naver.maps.Point(10, -10),
        });

        markers.push(otherMarkers);
        infowindows.push(infowindow);
      }

      naver.maps.Event.addListener(map, "idle", () => {
        updateMarkers(map, markers);
        setValue("");
      });

      updateMarkers(map, markers);

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
  }, [user, storeAddress, currentPosition]);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
}
