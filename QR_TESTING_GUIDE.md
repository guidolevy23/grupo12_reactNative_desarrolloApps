# 🧪 QR Code Testing Guide

## How to Test QR Check-In with Your Android Phone

Since your colleagues don't have Android phones but you do, here's how to test the QR scanner functionality:

---

## 🎯 Setup

### Option 1: Two Devices (Recommended)
1. **Device 1** (Computer/Tablet/Another Phone):
   - Open the app in development mode
   - Navigate to: **Reservas → 🧪 Test QR button**
   - Display the QR code generator screen

2. **Device 2** (Your Android Phone):
   - Run the app
   - Navigate to: **Reservas → Check In button**
   - Scan the QR code from Device 1

### Option 2: Web Browser + Android
1. **Computer Browser**:
   - Run: `npm start` or `expo start --web`
   - Navigate to the QR Generator screen
   - Full-screen the QR code

2. **Android Phone**:
   - Run the app
   - Scan the QR from your computer screen

### Option 3: Print QR Codes
1. Generate QR codes in the app
2. Take screenshots or use browser's print function
3. Print them out
4. Scan the printed QR codes with your Android

---

## 📱 Step-by-Step Testing Process

### 1. Start the App
```bash
cd C:\fintess-react-native
npm start
# or
expo start
```

### 2. Access QR Generator (Only in Development Mode)
- Open the app on any device
- Go to **Reservas** tab
- You'll see a yellow **🧪 Test QR** button (only visible in dev mode)
- Tap it to open the QR Generator

### 3. Generate Test QR Codes
The QR Generator provides several test scenarios:

- **✅ Valid QR Code**: Should work if backend is ready
- **⏰ Early Check-in**: Tests time window validation
- **⚠️ Expired QR**: Tests QR expiration handling
- **🔢 Simple ID**: Basic format test

You can also create custom QR codes by entering JSON data.

### 4. Scan with Android
- On your Android phone, go to **Reservas**
- Tap **Check In** on any confirmed reservation
- Point camera at the QR code
- The scanner will automatically detect and process it

---

## 🧪 Test Scenarios to Try

### Before Backend is Ready
All scans will likely return errors (404 or 500) because the endpoint doesn't exist yet. This is expected!

### After Backend Implementation
Test these scenarios:

1. **Happy Path** ✅
   - Scan a valid QR code for your reservation
   - Should see: "Check-in exitoso"
   - Check History tab to see the attendance record

2. **Invalid QR** ❌
   - Scan a random QR code
   - Should see: "El código QR no es válido"

3. **Already Checked In** ❌
   - Scan the same QR twice
   - Second scan should error: "Ya realizaste el check-in"

4. **Time Window** ❌ (if backend implements this)
   - Scan QR before check-in window opens
   - Should see: "La clase aún no está disponible"

---

## 🎨 QR Generator Features

### Pre-built Scenarios
Tap any scenario card to display that QR code:
- Different timestamps for time-based validation
- Various data formats
- Error simulation scenarios

### Custom QR Generation
1. Scroll to "Generar QR Personalizado"
2. Enter your JSON data:
   ```json
   {
     "classId": 999,
     "sessionId": "test-session",
     "type": "checkin"
   }
   ```
3. Tap "Generar QR"
4. Scan it with your Android

### View QR Data
Tap "📋 Ver datos del QR" to see what's encoded in the current QR code.

---

## 🔧 Troubleshooting

### QR Scanner Won't Open
**Issue**: Camera permission denied

**Solution**:
- Android: Settings → Apps → Your App → Permissions → Camera → Allow

### QR Not Scanning
**Issue**: Camera can't focus or QR is too small

**Solutions**:
- Increase brightness on the device showing the QR
- Make the QR code bigger (already 250x250px)
- Ensure good lighting
- Hold phone steady for 1-2 seconds

### Getting Network Errors
**Issue**: App can't reach backend

**Solutions**:
- Check your API base URL in `src/api/axios.js`
- Ensure backend is running
- Check if you're on the same network (if using local backend)
- Try with ngrok/tunnel if testing with remote backend

### "Test QR" Button Not Showing
**Issue**: Button only appears in development mode

**Solution**:
- Make sure you're running in dev mode: `expo start`
- If it still doesn't show, the `__DEV__` constant might not be set
- Alternative: Temporarily remove the `__DEV__ &&` condition in `ReservasScreen.js`

---

## 📊 Expected Behavior

### Before Backend Implementation
```
Scan QR → Processing → ❌ Error
"No se pudo completar el check-in"
```

This is normal! The backend endpoint doesn't exist yet.

### After Backend Implementation
```
Scan QR → Processing → ✅ Success
"Check-in exitoso"
→ Option to view History or return to Reservas
```

---

## 🚀 Production Deployment

Before deploying to production:

### 1. Remove Test Features
The QR Generator and test button are automatically hidden in production builds because of the `__DEV__` check.

To manually remove them:
- Delete: `src/screens/reservas/QRGeneratorScreen.js`
- Remove from navigation: `TabNavigator.js`
- Remove test button from: `ReservasScreen.js`

### 2. QR Codes in Production
In production, QR codes should be:
- Generated by the backend
- Displayed at gym locations (TV screens, printouts)
- Unique per class session
- Time-limited for security

---

## 💡 Alternative Testing Methods

### Online QR Generators
If you can't get two devices:
1. Go to https://www.qr-code-generator.com/
2. Enter your test data (e.g., `{"classId": 123}`)
3. Generate QR code
4. Display on screen
5. Scan with your Android

### Expo Go Share
1. Open app on computer: `expo start`
2. Scan Expo QR with Android to open app
3. Navigate to QR Generator
4. Take screenshot
5. Display screenshot on computer
6. Close app on Android, reopen
7. Use Check In to scan the screenshot

---

## 📞 Need Help?

If you encounter issues:
1. Check React Native logs: Look at terminal output
2. Check backend logs: See if requests are reaching the server
3. Use `console.log` in `QRScannerScreen.js` to debug
4. Verify the QR data matches what backend expects

---

## ✅ Checklist

Before considering testing complete:

- [ ] QR Generator screen opens correctly
- [ ] QR codes are displayed clearly
- [ ] Camera opens when tapping Check In
- [ ] Scanner detects QR codes
- [ ] App sends request to backend
- [ ] Success/error messages display correctly
- [ ] History updates after successful check-in
- [ ] Multiple check-ins are prevented
- [ ] Time window validation works (if implemented)

---

**Happy Testing!** 🎉

Remember: The QR scanner is fully implemented on the frontend. Any errors you see before backend implementation are expected!

