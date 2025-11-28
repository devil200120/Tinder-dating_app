import React, { useRef, useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const LocationInput = ({
  value,
  onChange,
  placeholder = "Enter your location",
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        initializeAutocomplete();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"], // Changed from ['(cities)'] to ['geocode'] for more detailed locations
        fields: [
          "place_id",
          "geometry",
          "name",
          "formatted_address",
          "address_components",
          "types",
        ],
      }
    );

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      // Extract location details
      const locationData = extractLocationData(place);

      // Call the onChange callback with the complete location data
      onChange(locationData);
    });
  };

  const extractLocationData = (place) => {
    const components = place.address_components || [];
    let city = "";
    let country = "";
    let state = "";
    let area = "";
    let sublocality = "";

    components.forEach((component) => {
      const types = component.types;

      if (
        types.includes("sublocality_level_1") ||
        types.includes("sublocality")
      ) {
        sublocality = component.long_name;
      } else if (types.includes("neighborhood")) {
        area = component.long_name;
      } else if (types.includes("locality")) {
        city = component.long_name;
      } else if (types.includes("administrative_area_level_2")) {
        // This might be district or area in some countries
        if (!area && !sublocality) {
          area = component.long_name;
        }
      } else if (types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (types.includes("country")) {
        country = component.long_name;
      }
    });

    // Build a more detailed city name including area/sublocality
    let fullCityName = "";
    if (sublocality && city) {
      fullCityName = `${sublocality}, ${city}`;
    } else if (area && city) {
      fullCityName = `${area}, ${city}`;
    } else if (sublocality) {
      fullCityName = sublocality;
    } else if (city) {
      fullCityName = city;
    } else if (place.name) {
      fullCityName = place.name;
    }

    const coordinates = [
      place.geometry.location.lng(),
      place.geometry.location.lat(),
    ];

    return {
      city: fullCityName,
      area: sublocality || area || "",
      mainCity: city || "",
      state: state || "",
      country: country,
      address: place.formatted_address || "",
      coordinates: coordinates,
      placeId: place.place_id,
    };
  };

  const handleInputChange = (e) => {
    // For manual typing, update the display value
    const displayValue = e.target.value;
    onChange({
      city: displayValue,
      country: "",
      state: "",
      address: displayValue,
      coordinates: [0, 0],
      placeId: "",
    });
  };

  const getDisplayValue = () => {
    if (!value) return "";

    if (value.city && value.country) {
      return `${value.city}, ${value.country}`;
    } else if (value.city) {
      return value.city;
    } else if (value.address) {
      return value.address;
    }

    return "";
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          className="input-field pl-10"
          placeholder={isLoaded ? placeholder : "Loading Google Maps..."}
          disabled={!isLoaded}
        />
      </div>

      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Start typing to search for areas, neighborhoods, or cities
      </p>
    </div>
  );
};

export default LocationInput;
