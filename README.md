# Vehicle Damage Inspector

[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-3.29-319795.svg)](https://chakra-ui.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)

A modern, AI-powered web application for automated vehicle damage detection and inspection comparison. Built to streamline vehicle inspection workflows by identifying new damage between pickup and return inspections using computer vision.

## Demo

### Sample Analysis

<table>
  <tr>
    <td align="center">
      <b>Pickup Inspection</b><br>
      <img src="/public/demo-car-before.jpg" alt="Pickup Inspection" width="400"/>
    </td>
    <td align="center">
      <b>Return Inspection</b><br>
      <img src="/public/demo-car-after.jpg" alt="Return Inspection" width="400"/>
    </td>
  </tr>
</table>

### Analysis Results

<p align="center">
  <img src="/public/result.png" alt="Analysis Results Screenshot" width="800"/>
</p>

<p align="center">
  <i>The application automatically detects and highlights new damage (shown in red) that wasn't present during pickup inspection. Each detection includes damage type classification and confidence score.</i>
</p>

## Technologies Used

- **Frontend Framework**: React 19.2 with Hooks
- **Type Safety**: TypeScript 5.9
- **UI Library**: Chakra UI 3.29 with Emotion
- **Styling**: Tailwind CSS 4.1
- **Animations**: Framer Motion 12.23
- **State Management**: Zustand 5.0
- **Headless Components**: Headless UI 2.2
- **Build Tool**: Vite 7.2
- **HTTP Client**: Axios 1.13
- **Computer Vision**: Roboflow API
- **Icons**: React Icons 5.5

## Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Roboflow API Key (Get one free at [Roboflow](https://roboflow.com/))

## Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/youssef-al-mostafa/Dazlle.git
cd Dazlle
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Add your Roboflow API credentials to `.env`
```env
VITE_ROBOFLOW_API_KEY=your_api_key_here
VITE_ROBOFLOW_MODEL=car-damage-detection-ha5mm
VITE_ROBOFLOW_VERSION=3
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
vehicle-inspector/
├── public/
│   ├── demo-car-before.jpg
│   ├── demo-car-after.jpg
│   ├── result.png
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── core/                        # Reusable, project-agnostic components
│   │   │   ├── ImageUpload.tsx          # Drag-and-drop file upload
│   │   │   ├── ProgressSteps.tsx        # Step indicator
│   │   │   ├── Scanner.tsx              # Scanning animation
│   │   │   ├── StatCard.tsx             # Label/value stat display
│   │   │   └── ui/
│   │   │       └── provider.tsx         # Chakra UI theme provider
│   │   └── app/                         # Components specific to this application
│   │       ├── AnnotatedImage.tsx       # Canvas-based damage visualization
│   │       ├── DamageTable.tsx          # Damage results table
│   │       ├── Hero.tsx                 # Landing hero section
│   │       ├── Navbar.tsx               # Top navigation bar
│   │       └── ResultPanel.tsx          # Inspection result panel
│   ├── services/
│   │   └── roboflow.ts                  # Roboflow API integration
│   ├── types/
│   │   └── roboflow.ts                  # API response types
│   ├── utils/
│   │   └── imageSimilarity.ts           # Damage comparison logic
│   ├── App.css
│   ├── App.tsx                          # Root component
│   ├── index.css                        # Global styles
│   ├── main.tsx                         # Application entry point
│   └── theme.ts                         # Chakra UI theme configuration
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

##  How It Works

### API Integration Flow

1. **Image Upload**: User uploads pickup and return inspection images
2. **Base64 Encoding**: Images are converted to base64 format
3. **Parallel Processing**: Both images sent to Roboflow API simultaneously
4. **Damage Detection**: API returns bounding boxes and classifications
5. **Comparison**: Algorithm identifies new damage based on spatial proximity
6. **Visualization**: Results displayed with annotated images and statistics

## AI Model

This project uses the **[Car-Damage Detection](https://universe.roboflow.com/college-gxdrt/car-damage-detection-ha5mm)** model hosted on Roboflow Universe.

| Property | Detail |
|---|---|
| Model ID | `car-damage-detection-ha5mm` (v3) |
| Type | Instance Segmentation |
| Dataset | 11,685 images |
| Classes | Dents, scratches, broken parts |
| mAP@50 | 92.0% |

**Why this model:** Large dataset (11k+ images), high accuracy (92% mAP), covers the three damage types most relevant to vehicle rental inspection, and is readily available via the Roboflow API with no self-hosting required.

## Limitations & Future Enhancements

### Current Limitations
- Image size constraints based on Roboflow API limits
- Simple spatial matching may not handle all edge cases
- Detection accuracy depends on model training data
- No image preprocessing or normalization

## Acknowledgements

- [Roboflow](https://roboflow.com/) - Computer vision API and model hosting
- [Chakra UI](https://chakra-ui.com/) - UI component library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## Contact

Youssef Al Mostafa - [LinkedIn](https://www.linkedin.com/in/youssef-al-mostafa/)
- [youssefalmostafa2@gmail.com](mailto:youssefalmostafa2@gmail.com)