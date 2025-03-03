let model;
const modelURL = "https://teachablemachine.withgoogle.com/models/452-qZIFg/";

// Get API key from environment configuration
let PERPLEXITY_API_KEY =
  "";

// Waste materials information database
const wasteInfo = {
  metal: {
    description:
      "Metal debris and scraps from buildings, vehicles, or infrastructure.",
    recyclingValue: "High",
    recommendations: [
      "Separate ferrous and non-ferrous metals when possible",
      "Remove any hazardous coatings before processing",
      "Can be melted down and repurposed for new construction",
      "Value: Can provide economic benefit through scrap metal recycling",
    ],
    additionalPrompts: [
      "How to identify different types of metal in debris?",
      "Best tools for processing metal waste in recovery zones?",
      "Safety precautions when handling metal debris in Gaza",
    ],
  },
  plastic: {
    description:
      "Various plastic materials from packaging, debris, or damaged goods.",
    recyclingValue: "Medium",
    recommendations: [
      "Sort by plastic type when possible (PET, PP, HDPE)",
      "Clean of contaminants before recycling",
      "Can be processed into building materials or textiles",
      "Warning: Avoid burning as it releases toxic chemicals",
    ],
    additionalPrompts: [
      "How to identify recyclable vs non-recyclable plastics?",
      "Creative ways to reuse plastic waste in Gaza?",
      "Environmental dangers of burning plastic waste",
    ],
  },
  paper: {
    description: "Paper, cardboard, and cellulose-based materials.",
    recyclingValue: "Medium-Low",
    recommendations: [
      "Keep dry to preserve recycling value",
      "Separate from food waste and contaminants",
      "Can be recycled into new paper products or insulation",
      "Biodegradable: Can be composted if clean",
    ],
    additionalPrompts: [
      "How to use paper waste for insulation?",
      "Methods for recycling paper with minimal resources?",
      "Using paper waste for agricultural purposes",
    ],
  },
  glass: {
    description: "Glass fragments from windows, bottles, or other sources.",
    recyclingValue: "Medium",
    recommendations: [
      "Handle with care - use gloves to prevent injuries",
      "Can be crushed and used as aggregate in concrete",
      "Sort by color for higher recycling value",
      "Non-biodegradable: Important to recycle rather than discard",
    ],
    additionalPrompts: [
      "Safety protocols for handling glass debris?",
      "How to safely crush glass for reuse in construction?",
      "Potential toxicity concerns with different types of glass",
    ],
  },
  concrete: {
    description: "Concrete debris from damaged buildings and infrastructure.",
    recyclingValue: "Low",
    recommendations: [
      "Can be crushed and used as foundation material for rebuilding",
      "Separate from rebar and other embedded materials when possible",
      "Useful for creating temporary roads or foundations",
      "Reduces need for new concrete production",
    ],
    additionalPrompts: [
      "How to separate rebar from concrete manually?",
      "Best uses for crushed concrete in rebuilding?",
      "Testing concrete for contamination before reuse",
    ],
  },
  wood: {
    description: "Wooden debris from buildings, furniture, or other sources.",
    recyclingValue: "Medium",
    recommendations: [
      "Inspect for damage, contamination, or treatment chemicals",
      "Untreated wood can be repurposed for rebuilding or fuel",
      "Avoid burning treated or painted wood",
      "Can be chipped for mulch or biomass applications",
    ],
    additionalPrompts: [
      "How to identify treated vs untreated wood?",
      "Safe uses for salvaged wood in rebuilding?",
      "Dangers of using chemically treated wood for fuel",
    ],
  },
  textiles: {
    description: "Cloth, clothing, upholstery, and fabric materials.",
    recyclingValue: "Low-Medium",
    recommendations: [
      "Clean items can be distributed for immediate reuse",
      "Damaged textiles can be recycled into insulation or cleaning rags",
      "Sort by material type when possible",
      "Check for contamination before distribution",
    ],
    additionalPrompts: [
      "How to sanitize textile waste with limited resources?",
      "Using textile waste for emergency shelters?",
      "Creative ways to repurpose damaged clothing",
    ],
  },
  electronic: {
    description: "Electronic waste including devices, wiring, and components.",
    recyclingValue: "High",
    recommendations: [
      "Contains valuable and potentially hazardous materials",
      "Extract functioning components for reuse when possible",
      "Proper disposal prevents toxic leaching into soil and water",
      "Can provide economic value through recovery of precious metals",
    ],
    additionalPrompts: [
      "Safe disassembly of electronic waste?",
      "Identifying valuable components in electronic waste?",
      "Health hazards of improper electronic waste handling",
    ],
  },
  organic: {
    description: "Food waste, plant matter, and biodegradable materials.",
    recyclingValue: "Low",
    recommendations: [
      "Can be composted to create soil for community gardens",
      "Keep separate from non-organic waste",
      "Avoid collection if contaminated with hazardous materials",
      "Composting reduces methane emissions from landfills",
    ],
    additionalPrompts: [
      "How to set up composting systems in recovery zones?",
      "Vermicomposting for dense urban areas?",
      "Using compost to grow food in contaminated soil",
    ],
  },
  hazardous: {
    description: "Potentially dangerous materials requiring special handling.",
    recyclingValue: "Special Processing",
    recommendations: [
      "WARNING: Do not handle without proper protection and training",
      "Keep separated from all other waste streams",
      "Mark collection areas clearly with warning signs",
      "Requires specialized disposal protocols - seek expert assistance",
    ],
    additionalPrompts: [
      "How to identify common hazardous materials in debris?",
      "Emergency containment of hazardous waste?",
      "Health effects of exposure to common hazardous waste",
    ],
  },
};

const wasteInfoModel = {
  "electronic waste": {
    description: "Electronic waste including devices, wiring, and components.",
    recyclingValue: "High",
    recommendations: [
      "Contains valuable and potentially hazardous materials",
      "Extract functioning components for reuse when possible",
      "Proper disposal prevents toxic leaching into soil and water",
      "Can provide economic value through recovery of precious metals",
    ],
    additionalPrompts: [
      "Safe disassembly of electronic waste?",
      "Identifying valuable components in electronic waste?",
      "Health hazards of improper electronic waste handling",
    ],
  },
  "hazardous material": {
    description: "Potentially dangerous materials requiring special handling.",
    recyclingValue: "Special Processing",
    recommendations: [
      "WARNING: Do not handle without proper protection and training",
      "Keep separated from all other waste streams",
      "Mark collection areas clearly with warning signs",
      "Requires specialized disposal protocols - seek expert assistance",
    ],
    additionalPrompts: [
      "How to identify common hazardous materials in debris?",
      "Emergency containment of hazardous waste?",
      "Health effects of exposure to common hazardous waste",
    ],
  },
  "Construction Debris": {
    description: "Concrete debris from damaged buildings and infrastructure.",
    recyclingValue: "Low",
    recommendations: [
      "Can be crushed and used as foundation material for rebuilding",
      "Separate from rebar and other embedded materials when possible",
      "Useful for creating temporary roads or foundations",
      "Reduces need for new concrete production",
    ],
    additionalPrompts: [
      "How to separate rebar from concrete manually?",
      "Best uses for crushed concrete in rebuilding?",
      "Testing concrete for contamination before reuse",
    ],
  },
};

Object.assign(wasteInfo, wasteInfoModel);

// Load the trained AI model
async function loadModel() {
  try {
    document.getElementById("loading").style.display = "block";
    console.log("⏳ Loading AI model...");

    // Load model with correct URL structure
    model = await tmImage.load(
      modelURL + "model.json",
      modelURL + "metadata.json"
    );

    console.log("✅ Model Loaded Successfully!");
    document.getElementById("loading").style.display = "none";
  } catch (error) {
    console.error("❌ Error loading AI model:", error);
    document.getElementById("result").innerText =
      "Error loading the model. Please refresh and try again.";
    document.getElementById("loading").style.display = "none";
  }
}

// Function to classify the uploaded image
async function predictImage() {
  if (!model) {
    console.error("❌ Model is still not loaded!");
    alert("AI Model not loaded yet. Please wait a moment and try again.");
    return;
  }

  const fileInput = document.getElementById("imageUpload");
  const image = fileInput.files[0];

  if (!image) {
    alert("Please upload an image.");
    return;
  }

  console.log("📸 Image uploaded. Processing...");
  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerText = "Analyzing image...";
  document.getElementById("recommendations").style.display = "none";

  // Clear any previous perplexity results
  document.getElementById("perplexityResults").innerHTML = "";

  // Create image element for prediction
  const imgElement = document.getElementById("preview");
  imgElement.src = URL.createObjectURL(image);
  imgElement.style.display = "block";

  // Wait for the image to load before prediction
  imgElement.onload = async () => {
    try {
      console.log("🔍 Predicting waste type...");
      const predictions = await model.predict(imgElement);

      // Find the class with the highest confidence score
      let highestPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      // Format the probability as a percentage
      const confidence = (highestPrediction.probability * 100).toFixed(1);
      const wasteType = highestPrediction.className.toLowerCase();

      console.log(`✅ Prediction complete: ${wasteType} (${confidence}%)`);

      // Display the result
      document.getElementById("result").innerHTML = `<div class="result-header">
                    <h3>Classification Results (powered by AI)</h3>
                </div>
                <div class="result-details">
                    <div class="result-type">
                        <span class="label">Waste Type:</span>
                        <span class="value">${capitalizeFirstLetter(
                          wasteType
                        )}</span>
                    </div>
                    <div class="result-confidence">
                        <span class="label">Confidence:</span>
                        <span class="value">${confidence}%</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidence}%"></div>
                        </div>
                    </div>
                </div>`;

      // Show recommendations based on waste type
      //displayRecommendations(wasteType);

      // Automatically query Perplexity with the waste type
      const query = `How to safely handle, dispose of, and potentially recycle or reuse ${wasteType} waste in Gaza or other war-affected regions. Include specific safety precautions, health risks, and practical methods.`;

      // Show loading indicator for Perplexity
      document.getElementById("perplexityResults").innerHTML = `
                <div class="search-loading">
                    <div class="spinner"></div>
                    <p>Getting detailed information from Perplexity AI...</p>
                </div>`;

      // Query Perplexity API
      queryPerplexityAPI(query, wasteType);
    } catch (error) {
      console.error("Error during prediction:", error);
      document.getElementById("result").innerText =
        "Error analyzing image. Please try again.";
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  };
}

// Display recommendations based on waste type
function displayRecommendations(wasteType) {
  const recommendationsDiv = document.getElementById("recommendations");

  // Default message if waste type not in database
  if (!wasteInfo[wasteType]) {
    recommendationsDiv.innerHTML = `
            <h3>Handling Recommendations</h3>
            <p>No specific recommendations available for this material type.</p>`;
    recommendationsDiv.style.display = "block";
    return;
  }

  // Get waste information
  const info = wasteInfo[wasteType];

  // Create HTML for recommendations
  let recommendationsHTML = `
        <h3>Material Information & Recommendations</h3>
        <div class="info-block">
            <p><strong>Description:</strong> ${info.description}</p>
            <p><strong>Recycling Value:</strong> <span class="badge ${info.recyclingValue
              .toLowerCase()
              .replace("-", "")}">${info.recyclingValue}</span></p>
        </div>
        <div class="recommendations-list">
            <h4>Basic Handling Guidelines:</h4>
            <ul>`;

  // Add each recommendation
  info.recommendations.forEach((rec) => {
    recommendationsHTML += `<li>${rec}</li>`;
  });

  recommendationsHTML += `
            </ul>
        </div>
        <div class="perplexity-info">
            <p>Loading detailed analysis from Perplexity AI...</p>
        </div>`;

  // Update the recommendations div
  recommendationsDiv.innerHTML = recommendationsHTML;
  recommendationsDiv.style.display = "block";
}

// Function to query Perplexity API
async function queryPerplexityAPI(query, wasteType) {
  try {
    const url = "https://api.perplexity.ai/chat/completions";

    const payload = {
      model: "sonar",
      messages: [
        { role: "system", content: "Be precise and concise." },
        { role: "user", content: query },
      ],
      max_tokens: 2000,
      stream: false,
    };

    const headers = {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const completion = data.choices[0].message.content;

        displayPerplexityResponse(completion, wasteType);
        console.log("Perplexity response:", completion);

        // You can update the UI here with the response
        //document.getElementById("perplexityResults").textContent = completion;
      })
      .catch((error) => {
        console.error("Error:", error);
        // You can update the UI here with the error message
        document.getElementById("perplexityResults").textContent =
          "Error: " + error.message;
      });
  } catch (error) {
    console.error("Error querying Perplexity API:", error);

    // Show error message
    document.getElementById("perplexityResults").innerHTML = `
            <div class="perplexity-error">
                <h4>Could not fetch detailed information</h4>
                <p>Sorry, we couldn't connect to Perplexity AI at the moment. Please check your connection or try again later.</p>
                <p><small>Error details: ${error.message}</small></p>
            </div>`;
  }
}

// Display Perplexity API response
function displayPerplexityResponse(response, wasteType) {
  // Format the response
  const formattedContent = formatPerplexityContent(response);

  // Get additional prompts for this waste type
  let promptsHTML = "";
  if (wasteInfo[wasteType]?.additionalPrompts) {
    promptsHTML = `
            <div class="additional-prompts">
                <h4>Need more specific information?</h4>
                <div class="prompt-buttons">`;

    wasteInfo[wasteType].additionalPrompts.forEach((prompt) => {
      promptsHTML += `
                <button onclick="handlePromptClick('${prompt}')" class="prompt-button">
                    ${prompt}
                </button>`;
    });

    promptsHTML += `
                </div>
            </div>`;
  }

  // Display in perplexityResults div
  document.getElementById("perplexityResults").innerHTML = `
        <div class="perplexity-result">
            <div class="result-header">
                <img src="/api/placeholder/24/24" alt="Perplexity Logo" class="mini-logo">
                <h4>Detailed Information (via Perplexity AI)</h4>
            </div>
            <div class="result-content">
                ${formattedContent}
            </div>
            ${promptsHTML}
            <div class="result-footer">
                <p><em>Powered by Perplexity AI</em></p>
            </div>
        </div>`;

  // Hide loading info in recommendations
  const perplexityInfo = document.querySelector(".perplexity-info");
  if (perplexityInfo) {
    perplexityInfo.style.display = "none";
  }
}

// Format Perplexity content for display
function formatPerplexityContent(content) {
  // Convert newlines to paragraphs and handle bullet points
  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");
  let formattedHTML = "";

  paragraphs.forEach((paragraph) => {
    // Handle bullet point lists
    if (paragraph.includes("\n- ") || paragraph.includes("\n* ")) {
      const splitChar = paragraph.includes("\n- ") ? "\n- " : "\n* ";
      const parts = paragraph.split(splitChar);
      const intro = parts.shift().trim();

      if (intro) formattedHTML += `<p>${intro}</p>`;
      formattedHTML += "<ul>";

      parts.forEach((item) => {
        if (item.trim()) {
          formattedHTML += `<li>${item.trim()}</li>`;
        }
      });

      formattedHTML += "</ul>";
    }
    // Handle markdown headings
    else if (paragraph.startsWith("# ")) {
      formattedHTML += `<h3>${paragraph.substring(2)}</h3>`;
    } else if (paragraph.startsWith("## ")) {
      formattedHTML += `<h4>${paragraph.substring(3)}</h4>`;
    }
    // Regular paragraph
    else {
      formattedHTML += `<p>${paragraph}</p>`;
    }
  });

  return formattedHTML;
}

// Handle click on prompt buttons
function handlePromptClick(prompt) {
  // Get current waste type
  let currentWasteType = "";
  try {
    const resultText = document
      .querySelector(".result-type .value")
      ?.innerText.toLowerCase();
    if (resultText) {
      currentWasteType = resultText;
    }
  } catch (e) {
    console.error("Error getting current waste type:", e);
  }

  // Show loading
  document.getElementById("perplexityResults").innerHTML = `
        <div class="search-loading">
            <div class="spinner"></div>
            <p>Getting information from Perplexity AI...</p>
        </div>`;

  // Query with the selected prompt
  let query = prompt;
  if (currentWasteType) {
    query = `Regarding ${currentWasteType} waste in Gaza or war-affected regions: ${prompt}`;
  }

  // Query API
  queryPerplexityAPI(query, currentWasteType);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load model when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  // Then load the AI model
  await loadModel();

  // Add event listener for file input to show filename
  document
    .getElementById("imageUpload")
    .addEventListener("change", function () {
      const fileName = this.files[0]?.name;
      if (fileName) {
        const label = document.querySelector(".upload-label span");
        label.textContent = fileName;
      }
    });
});
