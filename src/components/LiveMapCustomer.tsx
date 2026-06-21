"use client";
import { ILocation } from "./DeliveryBoyDashBoard"; 
import deliveryBoy from "@/assets/delivery-guy.png";
import homeIcon from "@/assets/home-address.png";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

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
  boyLoc: ILocation | null | undefined 
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
      map.flyTo([userLoc.lattitude, userLoc.longitude], 16, { animate: true });
    }
  }, [userLoc, boyLoc, map]);

  return null;
};

export default function LiveMapCustomer({
  userLocation,
  deliveryBoyLocation,
}: {
  userLocation: ILocation;
  deliveryBoyLocation?: ILocation | null;
}) {
  const [distance, setDistance] = useState<string>("Locating partner...");

  useEffect(() => {
    if (userLocation && deliveryBoyLocation) {
      const dist = calculateDistance(
        deliveryBoyLocation.lattitude,
        deliveryBoyLocation.longitude,
        userLocation.lattitude,
        userLocation.longitude
      );
      if (dist <= 0.05) {
        setDistance("🎉 Partner is at your doorstep!");
      } 
      else if (dist <= 0.25) {
        setDistance("👀 Almost there! Partner is arriving now.");
      } 
      else {
        setDistance(`Partner is ${dist.toFixed(1)} km away`);
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
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-md border border-gray-100 flex items-center gap-3">
        {deliveryBoyLocation ? (
          <>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-bold text-gray-800 text-sm">{distance}</span>
          </>
        ) : (
          <>
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-gray-800 text-sm">Waiting for delivery partner...</span>
          </>
        )}
      </div>

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
          <Popup className="font-semibold text-gray-800">Your Delivery Location</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker icon={deliveryIcon} position={[deliveryBoyLocation.lattitude, deliveryBoyLocation.longitude]}>
            <Popup className="font-semibold text-green-700">Delivery Partner</Popup>
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