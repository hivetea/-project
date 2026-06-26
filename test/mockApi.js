// Mock API for RAG logic and Geofencing (Frontend version)

window.mockApi = {
  validateCoordinates: function (lat, lon) {
    const MIN_LAT = 21.0;
    const MAX_LAT = 26.0;
    const MIN_LON = 119.0;
    const MAX_LON = 123.0;
    return (MIN_LAT <= lat && lat <= MAX_LAT && MIN_LON <= lon && lon <= MAX_LON);
  },

  getWeatherData: function (lat, lon) {
    // Deterministic random
    const seed = Math.floor(lat * 1000) + Math.floor(lon * 1000);
    const random = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const wind_speed = parseFloat((5.0 + random() * 30.0).toFixed(1)); // 5 to 35
    const wave_height = parseFloat((0.5 + random() * 5.5).toFixed(1)); // 0.5 to 6.0
    const tides = ["Ebb", "Flood", "Slack"];
    const tide_status = tides[Math.floor(random() * tides.length)];

    return { wind_speed, wave_height, tide_status };
  },

  evaluateRisk: function (weather, lat, lon) {
    const matched_rules = [];
    const reasoning_parts = [];

    if (weather.wind_speed > 25.0) {
      matched_rules.push("Rule-W01: High wind speed warning.");
      reasoning_parts.push(`Wind speed is ${weather.wind_speed} knots, exceeding the 25-knot safety threshold.`);
    }

    if (weather.wave_height > 3.0) {
      matched_rules.push("Rule-W02: Dangerous wave heights.");
      reasoning_parts.push(`Wave height of ${weather.wave_height}m indicates extremely rough seas.`);
    }

    if (weather.tide_status === "Ebb" && weather.wind_speed > 20.0) {
      matched_rules.push("Rule-T01: Ebb tide with strong winds creates steep 'rogue' waves.");
      reasoning_parts.push("The combination of an ebb tide and strong winds significantly increases the risk of rogue waves in coastal areas.");
    }

    let risk_level, navigational_advice;

    if (matched_rules.length >= 2) {
      risk_level = "Extreme";
      navigational_advice = "ALL VESSELS STRICTLY PROHIBITED FROM LEAVING PORT. Immediate danger to life and vessel.";
    } else if (matched_rules.length === 1) {
      risk_level = "High";
      navigational_advice = "Small vessels should remain in port. Large commercial vessels proceed with extreme caution.";
    } else if (weather.wind_speed > 15.0 || weather.wave_height > 1.5) {
      risk_level = "Moderate";
      matched_rules.push("Rule-B01: Baseline moderate seas.");
      reasoning_parts.push("Conditions are moderately rough but below critical thresholds.");
      navigational_advice = "Maintain standard sea watch. Secure loose gear on deck.";
    } else {
      risk_level = "Low";
      matched_rules.push("Rule-B00: Calm seas.");
      reasoning_parts.push("Wind and waves are within optimal safe operational parameters.");
      navigational_advice = "Conditions are clear. Proceed with standard voyage plan.";
    }

    const reasoning = reasoning_parts.length > 0 ? reasoning_parts.join(" ") : "No specific hazards detected.";

    return {
      risk_level,
      matched_rules,
      reasoning,
      navigational_advice,
      weather_context: weather
    };
  },

  assessRisk: function(lat, lon) {
    if (!this.validateCoordinates(lat, lon)) {
      return { error: `Coordinates (${lat}, ${lon}) are outside the supported Taiwan coastal sensor range.` };
    }
    const weather = this.getWeatherData(lat, lon);
    return this.evaluateRisk(weather, lat, lon);
  }
};
