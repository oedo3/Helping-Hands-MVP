"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { VolunteerEvent } from "@/lib/types";
import { categoryColors } from "@/lib/constants";

function makePinIcon(color: string, selected: boolean) {
  const size = selected ? 38 : 30;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 30 39">
      <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
      </filter>
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 24 15 24s15-13.5 15-24C30 6.7 23.3 0 15 0z"
        fill="${color}" filter="url(#s)"/>
      <circle cx="15" cy="15" r="6" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
    popupAnchor: [0, -(size * 1.3)],
  });
}

function RecenterOnSelect({ event }: { event: VolunteerEvent | null }) {
  const map = useMap();
  useEffect(() => {
    if (event) {
      map.panTo([event.lat, event.lng], { animate: true, duration: 0.5 });
    }
  }, [event, map]);
  return null;
}

function RecenterOnUser({ location }: { location: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 14, { animate: true, duration: 1 });
    }
  }, [location, map]);
  return null;
}

interface MapViewProps {
  events: VolunteerEvent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  userLocation?: [number, number] | null;
}

export default function MapView({ events, selectedId, onSelect, userLocation }: MapViewProps) {
  const center: [number, number] = [37.9716, -87.5711];
  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  return (
    <MapContainer
      center={center}
      zoom={13}
      minZoom={2}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        noWrap={true}
        className="map-tiles"
      />

      <RecenterOnSelect event={selectedEvent} />
      <RecenterOnUser location={userLocation ?? null} />

      {/* User location dot */}
      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={8}
          pathOptions={{ fillColor: "#2D8CFF", fillOpacity: 1, color: "white", weight: 2 }}
        />
      )}

      {events.map((event) => {
        const color = categoryColors[event.category] ?? "#2D8CFF";
        const isSelected = event.id === selectedId;
        return (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={makePinIcon(color, isSelected)}
            eventHandlers={{
              click: () => onSelect(isSelected ? null : event.id),
            }}
            zIndexOffset={isSelected ? 1000 : 0}
          />
        );
      })}
    </MapContainer>
  );
}
