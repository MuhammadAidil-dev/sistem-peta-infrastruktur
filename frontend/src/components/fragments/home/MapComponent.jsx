import { useState, useEffect, useRef } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

const MapComponent = ({ infrastrukturData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });

        // Load MarkerCluster
        const clusterScript = document.createElement('script');
        clusterScript.src =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.1/leaflet.markercluster.js';
        document.head.appendChild(clusterScript);

        const clusterCSS = document.createElement('link');
        clusterCSS.rel = 'stylesheet';
        clusterCSS.href =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.1/MarkerCluster.css';
        document.head.appendChild(clusterCSS);

        const clusterDefaultCSS = document.createElement('link');
        clusterDefaultCSS.rel = 'stylesheet';
        clusterDefaultCSS.href =
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.1/MarkerCluster.Default.css';
        document.head.appendChild(clusterDefaultCSS);

        await new Promise((resolve) => {
          clusterScript.onload = resolve;
        });
      }

      // Initialize map
      const L = window.L;
      const map = L.map(mapRef.current).setView([-0.3075171, 103.1146603], 10);

      // Add tile layers
      const osmLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }
      ).addTo(map);

      const googleSatelliteLayer = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '© Google Maps',
        }
      );

      // Layer control
      const baseMaps = {
        OpenStreetMap: osmLayer,
        'Google Satellite': googleSatelliteLayer,
      };
      L.control.layers(baseMaps).addTo(map);

      // Marker cluster
      const markers = L.markerClusterGroup();
      map.addLayer(markers);

      // Custom icon
      const customIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzIwIDQwIDQwIDI2IDQwIDIwQzQwIDkgMzEgMCAyMCAwQzkgMCAwIDkgMCAyMEMwIDI2IDIwIDQwIDIwIDQwWiIgZmlsbD0iI0ZGNDQ0NCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add markers
      infrastrukturData.forEach((data) => {
        const marker = L.marker([data.lat, data.lng], { icon: customIcon })
          .bindPopup(`
            <div class="p-2">
              <b>${data.infrastrukturName}</b><br>
              Tipe: ${data.infrastrukturType}<br>
              Status: ${data.infrastrukturStatus}<br>
              Alamat: ${data.address || ''}<br>
              Deskripsi: ${data.description}<br>
              <a href="https://www.google.com/maps?q=${data.lat},${
          data.lng
        }" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Tracking
              </a>
            </div>
          `);
        markers.addLayer(marker);
      });

      // Add legend
      const legend = L.control({ position: 'topright' });
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-control-legend');
        div.innerHTML = `
          <div style="background-color: white; padding: 10px; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border-radius: 5px;">
            <div style="display: flex; align-items: center;">
              <div style="width: 20px; height: 20px; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzIwIDQwIDQwIDI2IDQwIDIwQzQwIDkgMzEgMCAyMCAwQzkgMCAwIDkgMCAyMEMwIDI2IDIwIDQwIDIwIDQwWiIgZmlsbD0iI0ZGNDQ0NCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K') center/cover; margin-right: 8px;"></div>
              <span>Lokasi Infrastruktur</span>
            </div>
          </div>
        `;
        return div;
      };
      legend.addTo(map);

      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const userIcon = L.icon({
              iconUrl:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMyNTYzZWIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });
            L.marker([userLat, userLng], { icon: userIcon })
              .bindPopup('Anda berada di sini.')
              .addTo(map);
          },
          (error) => {
            console.error('Geolokasi gagal:', error.message);
          }
        );
      }

      mapInstanceRef.current = map;
      markersRef.current = markers;
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = infrastrukturData.filter((item) => {
      const searchFields = [
        item.infrastrukturName,
        item.infrastrukturType,
        item.infrastrukturStatus,
      ]
        .join(' ')
        .toLowerCase();

      return searchFields.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm]);

  const handleSearchSelect = (item) => {
    if (mapInstanceRef.current && markersRef.current) {
      const L = window.L;
      mapInstanceRef.current.setView([item.lat, item.lng], 16);

      // Clear existing markers and add selected one
      markersRef.current.clearLayers();

      const customIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzIwIDQwIDQwIDI2IDQwIDIwQzQwIDkgMzEgMCAyMCAwQzkgMCAwIDkgMCAyMEMwIDI2IDIwIDQwIDIwIDQwWiIgZmlsbD0iI0ZGNDQ0NCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .bindPopup(
          `
          <div class="p-2">
            <b>${item.infrastrukturName}</b><br>
              Tipe: ${item.infrastrukturType}<br>
              Status: ${item.infrastrukturStatus}<br>
              Alamat: ${item.address || ''}<br>
              Deskripsi: ${item.description}<br>
              <a href="https://www.google.com/maps?q=${item.lat},${
            item.lng
          }" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Tracking
              </a>
          </div>
        `
        )
        .openPopup();

      markersRef.current.addLayer(marker);
    }

    setSearchTerm(item.Nama_Barang);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);

    // Restore all markers
    if (mapInstanceRef.current && markersRef.current) {
      const L = window.L;
      markersRef.current.clearLayers();

      const customIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzIwIDQwIDQwIDI2IDQwIDIwQzQwIDkgMzEgMCAyMCAwQzkgMCAwIDkgMCAyMEMwIDI2IDIwIDQwIDIwIDQwWiIgZmlsbD0iI0ZGNDQ0NCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      infrastrukturData.forEach((data) => {
        const marker = L.marker([data.lat, data.lng], { icon: customIcon })
          .bindPopup(`
            <div class="p-2">
              <b>${data.infrastrukturName}</b><br>
              Tipe: ${data.infrastrukturType}<br>
              Status: ${data.infrastrukturStatus}<br>
              Alamat: ${data.address || ''}<br>
              Deskripsi: ${data.description}<br>
              <a href="https://www.google.com/maps?q=${data.lat},${
          data.lng
        }" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Tracking
              </a>
            </div>
          `);
        markersRef.current.addLayer(marker);
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredData[selectedIndex]) {
          handleSearchSelect(filteredData[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />

      {/* Search Icon */}
      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="absolute top-24 left-3 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Search className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Search Container */}
      {showSearch && (
        <div className="absolute top-28 left-3 z-[1000] bg-white p-3 rounded-lg shadow-lg w-64">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari Nama Infrastruktur, Tipe Infrastruktur, Status Infrastruktur"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            {/* Search Suggestions */}
            {showSuggestions && filteredData.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg max-h-48 overflow-y-auto z-[1100]">
                {filteredData.map((item, index) => (
                  <button
                    key={item.id_detailtanah}
                    onClick={() => handleSearchSelect(item)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{item.Nama_Barang}</div>
                    <div className="text-gray-600 text-xs">
                      {item.nama_kecamatan} - {item.nama_desakelurahan}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleClearSearch}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Close search */}
          <button
            onClick={() => {
              setShowSearch(false);
              setShowSuggestions(false);
            }}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Click outside to close search suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default MapComponent;
