
# MODIVIS - Digital Asset Marketplace & AI Editor Platform

MODIVIS is a comprehensive, web-based ecosystem designed to bridge the gap between digital asset discovery and content creation. It combines a robust **Stock Asset Marketplace** with a powerful **AI-Powered Image Editor**, allowing users to find, edit, and export creative assets in one seamless workflow.

Built with **React**, **Tailwind CSS**, and **Google Gemini AI**.

## 🚀 Key Features

### 1. 🏪 Global Marketplace
*   **Asset Discovery:** Search and browse thousands of assets (Photos, 3D Renders, Vectors).
*   **Advanced Filtering:** Filter by Category, Orientation, Color, and License type.
*   **Tiered Access:** Free, Pro, and Ultra Business tiers determine download quality (SD, HD, 4K).

### 2. 🎨 AI-Powered Web Editor
*   **Generative AI Integration:** Uses **Google Gemini 2.5 Flash** for intelligent background removal.
*   **Basic Tools:** Crop, Resize, Rotate, Flip, Brightness, Contrast, Saturation, Blur.
*   **Premium Tools:** Magic Eraser (Healing), AI Upscaler simulation.
*   **Filter Library:** Preset aesthetic filters (Vintage, Cool, Warm, etc.).

### 3. 👥 Dual Dashboards
*   **User Dashboard:** Track token balance, download history, and recent projects.
*   **Creator Dashboard:** Analytics visualization (Chart.js) for views, downloads, and revenue. Upload management system.

### 4. 💰 Monetization & Localization
*   **Token System:** Hybrid currency system for asset acquisition and AI feature usage.
*   **Subscription Models:** Free, Pro Creator, and Ultra Business plans.
*   **Multi-language:** Full support for **English** and **Indonesian (Bahasa Indonesia)**.

---

## 🛠 Tech Stack

*   **Frontend Framework:** React 19 (TypeScript)
*   **Styling:** Tailwind CSS
*   **AI Engine:** Google GenAI SDK (`@google/genai`) - Model: `gemini-2.5-flash-image`
*   **Data Visualization:** Chart.js
*   **Icons:** Material Symbols & Google Fonts (Inter)
*   **Build Tool:** Vite (Implicit in structure)

---

## 💡 Use Cases (Skenario Penggunaan)

### Use Case 1: The Graphic Designer (Asset Discovery & Quick Edit)
**Persona:** Sarah needs a specific image for a client's presentation but needs to remove the background quickly.
1.  **Search:** Sarah enters "Modern Office" in the Marketplace search bar.
2.  **Filter:** She filters by "Horizontal" orientation to fit her slide deck.
3.  **Select:** She chooses a high-quality image and clicks **"Open in Editor"**.
4.  **AI Edit:** Inside the editor, she clicks **"Remove BG"**. The app sends the image to Google Gemini AI, which intelligently isolates the subject.
5.  **Export:** She exports the transparent PNG using her Pro Plan credits.

### Use Case 2: The Content Creator (Monetization)
**Persona:** Alex is a 3D artist looking to sell his renders.
1.  **Upload:** Alex navigates to the **Creator Hub** and uploads a .OBJ file pack.
2.  **Metadata:** He adds titles, tags ("3D", "Abstract"), and sets the price.
3.  **Analytics:** A week later, he checks the **Creator Dashboard** to see a chart showing a spike in downloads and revenue after his asset was featured.

### Use Case 3: The Free User (Ad-Supported Access)
**Persona:** Budi is a student working on a school project with no budget.
1.  **Browse:** Budi finds a "Nature" photo he likes.
2.  **Download Constraint:** He sees the 4K version is locked for Business users.
3.  **Export:** He chooses the SD version. Since he is on a Free tier, the app prompts him to "Watch Ad" (simulated) or use limited free tokens to proceed with the download.

---

## ⚙️ Configuration & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   NPM or Yarn
*   **Google Gemini API Key**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/modivis.git
    cd modivis
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # Required for AI Background Removal
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm start
    # or
    npm run dev
    ```

---

## 📁 Project Structure

```
/
├── components/      # Reusable UI components (TopNav, PaymentModal, etc.)
├── context/         # React Context (LanguageContext)
├── views/           # Main Page Views
│   ├── LandingPage.tsx
│   ├── MarketplacePage.tsx
│   ├── EditorPage.tsx       # Contains Canvas & AI Logic
│   ├── CreatorDashboard.tsx # Contains Chart.js logic
│   └── ...
├── types.ts         # TypeScript Interfaces & Enums
├── App.tsx          # Main Router & Layout
└── index.html       # Entry point
```

## 📜 License
This project is licensed under the MIT License.
