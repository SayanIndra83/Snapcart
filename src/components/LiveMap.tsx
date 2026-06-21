"use client";
import { ILocation } from "./DeliveryBoyDashBoard";
import deliveryBoy from "@/assets/delivery-guy.png";
import homeIcon from "@/assets/home-address.png";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { LocateFixed, Navigation } from "lucide-react";

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c);
};

const MapController = ({ 
  userLoc, 
  boyLoc 
}: { 
  userLoc: ILocation; 
  boyLoc: ILocation | null 
}) => {
  const map = useMap();

  useEffect(() => {
    if (userLoc && boyLoc) {
      const bounds = L.latLngBounds(
        [userLoc.lattitude, userLoc.longitude],
        [boyLoc.lattitude, boyLoc.longitude]
      );
     
      map.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1.5 });
    } else if (userLoc) {
      map.flyTo([userLoc.lattitude, userLoc.longitude], 15, { animate: true });
    }
  }, [userLoc, boyLoc, map]);

  return null;
};

export default function LiveMap({
  userLocation,
  deliveryBoyLocation,
}: {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}) {
  const [distance, setDistance] = useState<string>("Calculating...");

  useEffect(() => {
    if (userLocation && deliveryBoyLocation) {
      const dist = calculateDistance(
        deliveryBoyLocation.lattitude,
        deliveryBoyLocation.longitude,
        userLocation.lattitude,
        userLocation.longitude
      );
      if (dist <= 0.05) {
        setDistance("📍 Arrived at destination");
      } 
      else if (dist <= 0.25) {
        setDistance("🔔 Approaching drop-off location");
      }
      else {
        setDistance(`${dist.toFixed(1)} km to destination`);
      }
    }
  }, [userLocation, deliveryBoyLocation]);

  const deliveryIcon = L.icon({
    iconUrl: deliveryBoy.src,
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    className: "drop-shadow-md", 
  });

  const userIcon = L.icon({
    iconUrl: homeIcon.src,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: "drop-shadow-md",
  });

  const linePositions =
    deliveryBoyLocation && userLocation
      ? [
          [deliveryBoyLocation.lattitude, deliveryBoyLocation.longitude],
          [userLocation.lattitude, userLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group">
      
      {deliveryBoyLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold text-gray-800 text-sm">{distance}</span>
        </div>
      )}

      <MapContainer
        center={[userLocation.lattitude, userLocation.longitude] as LatLngExpression}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        <MapController userLoc={userLocation} boyLoc={deliveryBoyLocation} />

        <Marker icon={userIcon} position={[userLocation.lattitude, userLocation.longitude]}>
          <Popup className="font-semibold text-gray-800">Customer Location</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker icon={deliveryIcon} position={[deliveryBoyLocation.lattitude, deliveryBoyLocation.longitude]}>
            <Popup className="font-semibold text-green-700">You are here</Popup>
          </Marker>
        )}

        {linePositions.length > 0 && (
          <Polyline
            positions={linePositions as LatLngExpression[]}
            color="#16a34a"
            weight={4}
            dashArray="10, 10"
            opacity={0.8}
            lineCap="round"
          />
        )}
      </MapContainer>
    </div>
  );
}