# Development Dollar Campaign - PWA

A Progressive Web App for the Development Dollar Campaign that allows users to make donations via USSD payments.

## PWA Features

- ✅ **Installable** - Can be added to home screen
- ✅ **Offline Support** - Works without internet connection
- ✅ **App-like Experience** - Full-screen standalone mode
- ✅ **Push Notifications** - Background notifications support
- ✅ **App Shortcuts** - Quick actions from home screen
- ✅ **Background Sync** - Offline donation syncing

## Setup Requirements

### 1. Icon Files
Place these icon files in the root directory:
- `logo.png` - Your campaign logo (recommended: 512x512)
- `icon-16.png` - 16x16 favicon
- `icon-32.png` - 32x32 favicon  
- `icon-192.png` - 192x192 PWA icon
- `icon-512.png` - 512x512 PWA icon

### 2. HTTPS Required
PWA features require HTTPS in production. For local development, use:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### 3. Service Worker
The service worker (`sw.js`) is automatically registered and provides:
- Offline caching
- Background sync
- Push notifications
- App shell caching

## Installation

1. Open the app in a supported browser (Chrome, Edge, Safari)
2. Look for the install prompt or use browser menu
3. Click "Install" to add to home screen
4. App will launch in standalone mode

## App Shortcuts

- **Give Now** - Quick access to donation form
- Right-click app icon to see available shortcuts

## Offline Functionality

- App works offline after first visit
- Donations are cached locally
- Syncs when connection is restored
- Background sync for offline donations

## Browser Support

- Chrome 67+
- Edge 79+
- Firefox 67+
- Safari 11.1+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

The PWA is built with vanilla HTML/CSS/JavaScript and includes:
- Service Worker for offline support
- Web App Manifest for installability
- Theme switching (light/dark)
- Local storage for donations
- USSD payment integration

## Testing PWA Features

1. **Install**: Use browser install prompt
2. **Offline**: Disconnect internet and refresh
3. **Notifications**: Grant permission when prompted
4. **Shortcuts**: Right-click installed app icon
5. **Background Sync**: Test offline donation syncing

## Troubleshooting

- Clear browser cache if service worker doesn't update
- Check browser console for service worker errors
- Ensure HTTPS in production
- Verify icon files exist and are accessible
