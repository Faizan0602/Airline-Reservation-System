# Running SkyWays Locally

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - The app will automatically open at `http://localhost:5173`
   - If it doesn't open automatically, click the link in your terminal

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Development Features

- **Hot Reload** - Changes appear instantly without page refresh
- **TypeScript** - Full type checking and IntelliSense
- **Tailwind CSS** - Utility-first CSS framework
- **Mock Data** - No backend required, uses local mock data

## Project Structure

```
skyways-airline-reservation/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── SearchForm.tsx
│   │   ├── FlightCard.tsx
│   │   ├── SeatSelection.tsx
│   │   ├── BookingForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── ...
│   ├── context/           # State management
│   │   └── AppContext.tsx
│   ├── data/              # Mock data
│   │   └── mockData.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## How the App Works

1. **Search Flights** - Enter origin, destination, dates, and passengers
2. **View Results** - Browse available flights with filtering options
3. **Select Seats** - Choose seats on interactive aircraft layout
4. **Enter Details** - Add passenger information
5. **Payment** - Complete booking with payment form
6. **Confirmation** - View booking confirmation and details

## Mock Data Features

- **Flights** - Pre-loaded flight data between major airports
- **Seats** - Dynamic seat generation with availability
- **Bookings** - Stored in browser's local storage
- **User** - Mock authentication system

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Clear Cache
If you see old data:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Issues
- Try incognito/private mode
- Clear browser cache and local storage
- Disable browser extensions

## Development Tips

- **State Management** - All app state is in `src/context/AppContext.tsx`
- **Styling** - Uses Tailwind CSS utility classes
- **Icons** - Lucide React icons throughout the app
- **Responsive** - Mobile-first design approach
- **TypeScript** - Full type safety with custom interfaces

## Next Steps

Once running locally, you can:
- Modify components in `src/components/`
- Add new mock data in `src/data/mockData.ts`
- Customize styling with Tailwind classes
- Add new features or pages