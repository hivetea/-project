import json
import urllib.request
import math

# 1. Fetch GeoJSON
url = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/TWN.geo.json'
res = urllib.request.urlopen(url)
geojson = json.loads(res.read().decode('utf-8'))

# Extract main ring
mainRing = []
geom = geojson['features'][0]['geometry']
if geom['type'] == 'Polygon':
    mainRing = geom['coordinates'][0]
elif geom['type'] == 'MultiPolygon':
    maxPoints = 0
    for polygon in geom['coordinates']:
        ring = polygon[0]
        if len(ring) > maxPoints:
            maxPoints = len(ring)
            mainRing = ring

# 2. Load API data directly from internet
import os
API_KEY = os.environ.get("CWA_API_KEY", "YOUR_API_KEY_HERE")
cwa_url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization={API_KEY}&format=JSON"
cwa_res = urllib.request.urlopen(cwa_url)
d = json.loads(cwa_res.read().decode('utf-8'))

stations = d['records']['Station']
coastal_stations = []

for s in stations:
    # Extract lat/lng
    try:
        coords = s['GeoInfo']['Coordinates']
        wgs84 = next(c for c in coords if c['CoordinateName'] == 'WGS84')
        lat = float(wgs84['StationLatitude'])
        lng = float(wgs84['StationLongitude'])
        
        # Calculate minimum distance to coastline
        minDist = float('inf')
        for point in mainRing:
            pLng, pLat = point[0], point[1]
            dist = math.sqrt((lat - pLat)**2 + (lng - pLng)**2)
            if dist < minDist:
                minDist = dist
                
        # If distance < 0.15 degrees (~16km), keep it to fill in the gaps
        if minDist < 0.15:
            coastal_stations.append(s)
    except Exception as e:
        pass

print(f"Total stations: {len(stations)}")
print(f"Coastal stations: {len(coastal_stations)}")

with open('coastal_stations.json', 'w', encoding='utf-8') as f:
    json.dump(coastal_stations, f, ensure_ascii=False, indent=2)
