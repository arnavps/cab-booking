"use client";

import React, { useCallback, useState, memo } from 'react';

import { GoogleMap, useJsApiLoader, DirectionsRenderer, MarkerF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: 19.0760,
    lng: 72.8777,
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

    const pickupIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" fill="#8b5cf6" />
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="white" />
                <circle cx="12" cy="7" r="4" stroke="white" />
            </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
    };

    const dropoffIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" fill="#ef4444" />
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="white" />
                <line x1="4" y1="22" x2="4" y2="15" stroke="white" />
            </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={pickup || center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {pickup && <MarkerF position={pickup} icon={pickupIcon} />}
            {dropoff && <MarkerF position={dropoff} icon={dropoffIcon} />}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        polylineOptions: {
                            strokeColor: "#8b5cf6",
                            strokeWeight: 6,
                            strokeOpacity: 0.9,
                        },
                        suppressMarkers: true,
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default memo(MapComponent);

