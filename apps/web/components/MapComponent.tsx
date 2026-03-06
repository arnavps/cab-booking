"use client";

import React, { useCallback, useState, memo } from 'react';

import { GoogleMap, useJsApiLoader, DirectionsRenderer, MarkerF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: 40.7128,
    lng: -74.0060,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
    ],
};

interface MapProps {
    pickup: google.maps.LatLngLiteral | null;
    dropoff: google.maps.LatLngLiteral | null;
    directions: google.maps.DirectionsResult | null;
}

const MapComponent = ({ pickup, dropoff, directions }: MapProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={pickup || center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {pickup && <MarkerF position={pickup} label="A" />}
            {dropoff && <MarkerF position={dropoff} label="B" />}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        polylineOptions: {
                            strokeColor: "#8b5cf6",
                            strokeWeight: 5,
                            strokeOpacity: 0.8,
                        },
                        suppressMarkers: true,
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default memo(MapComponent);

