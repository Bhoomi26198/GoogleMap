import React, { useEffect, useState ,useRef} from 'react';
import { StyleSheet, View, Dimensions, PermissionsAndroid, Image, Animated } from 'react-native';
import MapView, {  Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import GeoLocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';

const App = () => {
  const [location, setLocation] = useState(null);
  const [coordinates] = useState([
    {
      latitude: 23.0225,
      longitude: 72.5714,
    },
  ]);

  const mapRef =useRef();
  const markerRef =useRef();

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?', 
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = () => {
   
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        GeoLocation.watchPosition(
          (position) => {
            setLocation(position);
          },
          error => {
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter:5 },
        );
      }
    });
  };

  const fetchTime = (d,t) =>{
    setLocation({...location, distance: d, time: t})
  }

//   const calculatePreciseDistance = () => {
//       let l1 = {
//         latitude: location?.coords?.latitude, 
//         longitude: location?.coords?.longitude,
//       }
//       let l2 ={
//           latitude: privousLocation?.coords?.latitude, 
//           longitude: privousLocation?.coords?.longitude,
//       }
//       var angleDeg = Math.atan2(l2.longitude - l1.longitude, l2.latitude - l1.latitude) * 180 / Math.PI;
//       console.log("action angleDeg",angleDeg,l1,l2);
//       console.log("action location?.coords?.latitude", location?.coords?.heading,privousLocation?.coords?.heading );
//     if(l2?.latitude !== undefined && l1?.latitude !== undefined){
//       let ang = angleDeg;
//       if(ang != 0){
//         return location?.coords?.heading.toString()
//       }else{
//         return '180'
//       }
//     }else{
//       return '180'
//     }
// };

// let locationAvg = calculatePreciseDistance().toString();

    useEffect(() => {
      getLocation();
    }, []);

    console.log("action location",location);

  return (
    <View style={styles.container}>
      
      <>
        {
          location?.coords &&

            <MapView
              ref={mapRef}
              style={styles.maps}
              initialRegion={{
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              >
              <Marker.Animated
              ref={markerRef}
               coordinate={{latitude:location?.coords?.latitude,longitude: location?.coords?.longitude}}
               anchor={{x: 0.5, y: 0.5}}
               flat={true}
               >
                <Image
                  source={require('./assets/carimage.jpg')}
                  style={{ 
                    height: 35,
                    width: 35,
                    transform: [{rotate: `${location?.coords?.heading}deg`}]
                   }}
                  resizeMode = "contain"
                />
              </Marker.Animated>
              <MapViewDirections  
              origin={[{latitude: location?.coords?.latitude, longitude: location?.coords?.longitude}]}
              destination={coordinates[0]}
              apikey="AIzaSyCcjmWFpRU2EJGOSgQF2PrxBJp1dmElSDo"
              strokeWidth={3}
              strokeColor="#03658c"
              optimizeWaypoints={true}
              onReady={result => {
                fetchTime(result.distance,result.duration),
                mapRef.current.fitToCoordinates(result.coordinates,{
                  edgePadding:{
                    righ: 30,
                    bottom: 300,
                    left: 30,
                    top:100
                  }

                })
              }}
              />
            </MapView>
        }

      </>

    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maps: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});