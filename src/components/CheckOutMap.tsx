"use client";
import React, { useEffect } from "react";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapIcon from "@/assets/mapIcon.png";

const markerIcon = new L.Icon({
  iconUrl: mapIcon.src,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DraggableMarker = ({ 
  position, 
  setPosition 
}: { 
  position: [number, number], 
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>> 
}) => {
  const map = useMap();
  
  useEffect(() => {
      if (position) {
        map.flyTo(position, 16, { animate: true, duration: 1.5 });
      }
  }, [position, map]);

  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -35]} opacity={1} permanent>
        <span className="font-semibold text-gray-700 text-xs">Drag to adjust</span>
      </Tooltip>
    </Marker>
  );
};

export default function CheckoutMap({ 
  position, 
  setPosition 
}: { 
  position: [number, number], 
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>> 
}) {
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={15} 
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}