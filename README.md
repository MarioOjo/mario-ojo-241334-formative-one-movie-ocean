# [Movieverse](https://marioojo.github.io/mario-ojo-241334-formative-one-movie-ocean) - Movie Data Visualization App

A React + Electron application for visualizing and comparing movie metrics using data from **The Movie Database (TMDb) API**. Features interactive, responsive charts for financial and performance analysis across all devices.

Live App: [Movieverse](https://marioojo.github.io/mario-ojo-241334-formative-one-movie-ocean)

## 🎬 Key Features

- **📊 Single-Movie Dashboard**: Analyze individual movies with Bar and Radar charts showing budget, revenue, ratings, and popularity
- **↔️ Dual-Movie Comparison**: Side-by-side comparison tool with multiple chart types and statistical analysis
- **🎯 Movie Search**: Real-time search powered by TMDb API with instant suggestions
- **📱 Fully Responsive**: Seamless experience from mobile (320px) to 4K displays (1400px+)
- **💻 Cross-Platform**: Works as both a web app and standalone Electron desktop application
- **🎨 Interactive Visualizations**: Chart.js-powered charts with hover effects and responsive scaling

## 🌐 Responsive Design & Device Compatibility

### Supported Breakpoints

| Device Type | Screen Width | Layout Changes |
|-------------|-------------|-----------------|
| **Ultra-Mobile** | 320px - 479px | Single-column layouts, reduced padding, touch-optimized buttons (44px min height) |
| **Mobile** | 480px - 767px | Stacked components, single-column grids, optimized spacing |
| **Tablet** | 768px - 1023px | Two-column layouts begin, sidebar becomes icon-only, reduced chart heights |
| **Desktop** | 1024px - 1399px | Full multi-column layouts, expanded sidebar, full-size charts |
| **Large Desktop** | 1400px+ | Maximum width container (1400px), optimal spacing and typography |

### Mobile Optimizations

✅ **Touch-Friendly Interactions**
- All buttons and inputs have minimum 44px height (iOS standard)
- Increased tap target spacing for easier mobile interactions
- Smooth transitions and animations optimized for mobile performance

✅ **Responsive Charts**
- Chart aspect ratios maintained (no distortion on any screen size)
- Charts resize fluidly without horizontal scrolling
- Reduced margins/gaps on small screens for better space utilization
- Chart heights scale: 250px (desktop) → 200px (tablet) → 180px (mobile) → 150px (ultra-mobile)

✅ **Navigation**
- Sidebar collapses to icons at 768px breakpoint
- Mobile sidebar hidden by default, toggleable with hamburger menu
- Full touch-friendly navigation throughout

✅ **Text & Typography**
- Font sizes scale progressively: 2.2rem (desktop) → 1.5rem (tablet) → 1.25rem (mobile)
- Image posters scale responsively without stretching
- Readable line lengths on all screen sizes (no horizontal scrolling)

### Tested Configurations

**Mobile Devices:**
- iPhone SE (375px)
- iPhone 14 (390px)
- Samsung Galaxy S21 (360px)
- Pixel 6 (412px)

**Tablets:**
- iPad Air (820px)
- iPad Pro 11" (834px)
- Samsung Galaxy Tab (600px)

**Browsers:**
- Chrome/Chromium (Desktop & Mobile)
- Safari (iOS & macOS)
- Firefox
- Edge

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- TMDb API key (sign up at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarioOjo/mario-ojo-241334-formative-one-movie-ocean.git
   cd mario-ojo-241334-formative-one-movie-ocean
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your TMDb API key:
   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   ```

### Running the Application

**Web Mode (Development):**
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Desktop Mode (Electron):**
```bash
npm run dev
```
This launches both the React dev server and Electron app simultaneously.

**Production Build:**
```bash
npm run build
```

## 📊 API Reference

### TMDb Search Endpoint
```http
GET https://api.themoviedb.org/3/search/movie
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `api_key` | string | **Required**. Your TMDb API key |
| `query` | string | **Required**. Movie title to search |
| `page` | number | Optional. Page number for results |

### Example Request
```
https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=Inception
```

## 🛠️ Tech Stack

- **Frontend**: React 19.0.0
- **Charting**: Chart.js 4.4.8 with react-chartjs-2
- **Styling**: CSS3 with Bootstrap 5.3.3
- **Desktop**: Electron (via public/electron.js)
- **HTTP Client**: Axios 1.8.4
- **Routing**: React Router DOM 7.4.0
- **UI Components**: Material-UI 6.4.8, React-Bootstrap 2.10.9

## 📁 Project Structure

```
src/
├── components/
│   ├── Charts/          # Chart components (BarChart, Radar, etc.)
│   ├── Navbar/          # Navigation sidebar
│   ├── Search/          # Search functionality
│   └── TopBoxOffice/    # Top box office display
├── pages/
│   ├── HomePage.js      # Main dashboard
│   ├── ComparePage.js   # Movie comparison
│   ├── MoviePage.js     # Individual movie detail
│   └── TopBoxOfficePage.js  # Box office rankings
├── api.js               # API calls and data fetching
├── App.js               # Main app component
└── index.js             # React entry point
public/
├── electron.js          # Electron main process
└── index.html           # HTML entry point
```

## 🎯 Core Pages

1. **Home Page** - Search for movies and view analysis dashboard
2. **Movie Detail Page** - In-depth financial metrics and charts
3. **Comparison Page** - Compare two movies side-by-side
4. **Top Box Office Page** - Browse current box office rankings

## 🎨 Styling & Design

- **Color Scheme**: Dark theme with blue accents (#4192fe primary color)
- **Typography**: Figtree font for modern, clean appearance
- **Spacing**: Consistent 1rem/16px base unit for scaling
- **Icons**: React Icons for consistent iconography
- **Gradients**: Used strategically for visual depth

## ⚙️ Available Scripts

### `npm start`
Runs the app in development mode. Reload the page to see changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the optimized production bundle.

### `npm run electron`
Launches the Electron desktop application.

### `npm run dev`
Concurrently runs React dev server and Electron app.

### `npm run dist`
Builds Electron executable for distribution.

## 🔄 Responsive Development Workflow

When adding new components:

1. **Mobile-First Approach**: Start with mobile styles (320px), then add breakpoints
2. **Test Breakpoints**: Always test at 320px, 480px, 768px, 1024px, 1400px
3. **Touch Targets**: Ensure interactive elements are ≥44px
4. **Charts**: Use `maintainAspectRatio: false` for flexible sizing
5. **Images**: Apply `max-width: 100%` and `object-fit: cover` as needed

## 📦 Deployment

The app can be deployed to:
- **Web**: Netlify, Vercel, GitHub Pages (via `npm run build`)
- **Desktop**: Electron Builder for Windows, macOS, Linux executables

### GitHub Pages (Instant Viewer Link)

Use this when you want your GitHub profile project link to open instantly in a browser without any package install.

1. Push your latest code to the main branch.
2. Deploy with:
   ```bash
   npm run deploy
   ```
3. In your repository settings, ensure GitHub Pages is set to serve from the `gh-pages` branch.
4. Use this live URL on your GitHub profile:
   `https://marioojo.github.io/mario-ojo-241334-formative-one-movie-ocean`

Notes:
- The app uses hash-based routing for GitHub Pages compatibility, so internal routes load correctly.
- Visitors can open and use the app immediately; no install is needed for viewers.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Mario Ojo - [GitHub Profile](https://github.com/MarioOjo)

## 📚 Resources

- [TMDb API Documentation](https://developer.themoviedb.org/docs)
- [React Documentation](https://react.dev)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Electron Documentation](https://www.electronjs.org/docs)

---

**Last Updated**: April 2026 | **Version**: 0.1.0

