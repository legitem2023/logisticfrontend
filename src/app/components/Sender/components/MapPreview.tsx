import { Loader2 } from 'lucide-react';

interface MapPreviewProps {
  coordinates: { lat: number; lng: number };
  isGeocodingTyping: boolean;
  isSelected: boolean;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  coordinates,
  isGeocodingTyping,
  isSelected
}) => {
  return (
    <div className="h-64 md:h-48 border-b border-gray-200 flex-shrink-0">
      <div className="h-full w-full bg-gray-100 relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            coordinates.lng - 0.01
          },${
            coordinates.lat - 0.01
          },${
            coordinates.lng + 0.01
          },${
            coordinates.lat + 0.01
          }&marker=${coordinates.lat},${coordinates.lng}&layer=mapnik`}
          style={{ border: 0 }}
          title="Location Preview"
          className="absolute inset-0"
        />
        <div className="absolute bottom-0 left-0 right-0 text-xs text-gray-500 p-2 bg-white/80 text-center">
          <small>
            {isSelected 
              ? "OpenStreetMap Preview - Address selected" 
              : "OpenStreetMap Preview - Detected from typing"}
          </small>
        </div>
        {isGeocodingTyping && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs flex items-center">
            <Loader2 className="animate-spin h-3 w-3 mr-1" />
            Detecting location...
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPreview;
