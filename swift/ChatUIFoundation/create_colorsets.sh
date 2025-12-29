#!/bin/bash

# Script to create Asset Catalog color sets for ChatUIFoundation
COLORS_DIR="Sources/ChatUIFoundation/Resources/Colors.xcassets"

# Function to create a color set
create_colorset() {
    local name=$1
    local light_r=$2
    local light_g=$3
    local light_b=$4
    local dark_r=$5
    local dark_g=$6
    local dark_b=$7
    
    mkdir -p "$COLORS_DIR/$name.colorset"
    
    cat > "$COLORS_DIR/$name.colorset/Contents.json" << EOF
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "$light_b",
          "green" : "$light_g",
          "red" : "$light_r"
        }
      },
      "idiom" : "universal"
    },
    {
      "appearances" : [
        {
          "appearance" : "luminosity",
          "value" : "dark"
        }
      ],
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "$dark_b",
          "green" : "$dark_g",
          "red" : "$dark_r"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF
}

# Surface colors
create_colorset "foundation-bg-card" "0.910" "0.910" "0.910" "0.188" "0.188" "0.188"
create_colorset "foundation-bg-card-alt" "0.953" "0.953" "0.953" "0.255" "0.255" "0.255"

# Text colors  
create_colorset "foundation-text-primary" "0.051" "0.051" "0.051" "1.000" "1.000" "1.000"
create_colorset "foundation-text-secondary" "0.365" "0.365" "0.365" "0.804" "0.804" "0.804"
create_colorset "foundation-text-tertiary" "0.561" "0.561" "0.561" "0.686" "0.686" "0.686"

# Icon colors
create_colorset "foundation-icon-primary" "0.051" "0.051" "0.051" "1.000" "1.000" "1.000"
create_colorset "foundation-icon-secondary" "0.365" "0.365" "0.365" "0.804" "0.804" "0.804"
create_colorset "foundation-icon-tertiary" "0.561" "0.561" "0.561" "0.686" "0.686" "0.686"

# Accent colors (same across light/dark for brand consistency)
create_colorset "foundation-accent-green" "0.000" "0.525" "0.208" "0.251" "0.788" "0.467"
create_colorset "foundation-accent-blue" "0.008" "0.522" "1.000" "0.008" "0.522" "1.000"
create_colorset "foundation-accent-orange" "0.886" "0.333" "0.027" "1.000" "0.620" "0.424"
create_colorset "foundation-accent-red" "0.878" "0.180" "0.165" "1.000" "0.522" "0.514"
create_colorset "foundation-accent-purple" "0.600" "0.400" "0.800" "0.700" "0.500" "0.900"

# Divider/border
create_colorset "foundation-divider" "0.561" "0.561" "0.561" "0.686" "0.686" "0.686"

echo "Created all color sets successfully!"