# Mobile Optimization Testing Guide

## Quick Test Instructions

### Prerequisites
- Device or emulator with viewport width ≤ 768px (mobile)
- Desktop browser (viewport width > 768px)
- Chrome DevTools or similar for testing

### Test Setup
1. Open Chrome DevTools (F12)
2. Click on "Toggle device toolbar" (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device (e.g., iPhone 12, Pixel 5) or set custom viewport to 375x667

## Test Cases

### 1. Onboarding Screen (Mobile)
**Expected Behavior:**
- ✅ Should see 3 expanding circles animation (ripple effect)
- ✅ NO floating particles visible
- ✅ NO grain texture overlay
- ✅ Clean, minimal background

**Desktop Comparison:**
- Should see 20 floating particles
- Should have grain texture overlay

**Test Steps:**
1. Refresh page on mobile viewport
2. Observe onboarding screen background
3. Click "ENTER THE VOID" button

**Result:** ✅ PASS / ❌ FAIL

---

### 2. Page Transition Animation (Mobile)
**Expected Behavior:**
- ✅ Should see 2 expanding circles (red tint, then black)
- ✅ Smooth circle wipe transition
- ✅ NO complex accretion disks
- ✅ NO spinning rings or ripple effects

**Desktop Comparison:**
- Should see complex singularity collapse
- Multiple spinning layers
- Lens ripples and burst effects

**Test Steps:**
1. Click "ENTER THE VOID" on mobile viewport
2. Watch transition animation carefully
3. Should complete in ~1.5 seconds

**Result:** ✅ PASS / ❌ FAIL

---

### 3. Hero Section Background (Mobile)
**Expected Behavior:**
- ✅ Simple gradient background (red tones)
- ✅ Subtle gradient pulse animation
- ✅ NO SVG liquid simulation
- ✅ NO complex monster graphics
- ✅ NO animated fog drift

**Desktop Comparison:**
- Should see animated liquid simulation
- Complex SVG monster in background
- Multiple fog layers drifting

**Test Steps:**
1. After transition, observe hero section
2. Background should be simple gradient
3. Watch for ~10 seconds to confirm no heavy animations

**Result:** ✅ PASS / ❌ FAIL

---

### 4. Corner Decorations (Mobile)
**Expected Behavior:**
- ✅ NO corner string decorations visible
- ✅ Clean corners

**Desktop Comparison:**
- Should see animated string decorations in corners

**Test Steps:**
1. Check all four corners of hero section on mobile
2. Should be completely empty

**Result:** ✅ PASS / ❌ FAIL

---

### 5. Background Effects (Mobile)
**Expected Behavior:**
- ✅ Reduced blur effects (40px instead of 150px)
- ✅ NO grain texture overlay on main content
- ✅ Lightning effects less frequent (30-60s intervals)

**Desktop Comparison:**
- Heavy blur effects (150px)
- Grain texture visible
- Lightning every 7-15 seconds

**Test Steps:**
1. Scroll through the page
2. Observe background clarity
3. Wait for lightning (should be rare on mobile)

**Result:** ✅ PASS / ❌ FAIL

---

### 6. Performance Testing (Mobile)
**Expected Behavior:**
- ✅ Smooth 60fps scrolling
- ✅ No frame drops during animations
- ✅ Fast page load time
- ✅ Responsive touch interactions

**Test Steps:**
1. Open Chrome DevTools Performance tab
2. Start recording
3. Navigate through onboarding and hero section
4. Stop recording and check FPS
5. Should maintain 60fps consistently

**Performance Metrics to Check:**
- FPS: Should stay at 60fps
- GPU Memory: Should be lower than desktop
- Scripting Time: Reduced compared to desktop
- Rendering: Faster composite layers

**Result:** ✅ PASS / ❌ FAIL

---

### 7. Responsive Breakpoint (768px)
**Expected Behavior:**
- ✅ At 769px width: Desktop graphics appear
- ✅ At 768px width: Mobile optimizations kick in
- ✅ Smooth transition between modes

**Test Steps:**
1. Start at 800px viewport width
2. Slowly resize to 768px
3. Should see graphics disappear at 768px breakpoint
4. Resize back to 800px
5. Graphics should reappear

**Result:** ✅ PASS / ❌ FAIL

---

### 8. Desktop Experience Unchanged
**Expected Behavior:**
- ✅ ALL original animations present
- ✅ Particle effects working
- ✅ Complex transitions intact
- ✅ SVG graphics rendering
- ✅ Corner decorations visible

**Test Steps:**
1. Set viewport to > 768px (e.g., 1920x1080)
2. Go through entire onboarding
3. Verify all complex animations are present
4. Compare with mobile to confirm differences

**Result:** ✅ PASS / ❌ FAIL

---

## Visual Comparison Checklist

| Feature | Mobile (≤768px) | Desktop (>768px) |
|---------|----------------|------------------|
| Onboarding Particles | 0 (circles) | 20 particles |
| Grain Texture | ❌ No | ✅ Yes |
| Transition Animation | Simple circles | Complex singularity |
| Hero SVG Liquid | ❌ No | ✅ Yes |
| Hero Monster SVG | Simple gradient | Complex SVG |
| Corner Strings | ❌ Hidden | ✅ Visible |
| Blur Effects | 40px | 150px |
| Lightning Frequency | 30-60s | 7-15s |

## Browser Testing

### Recommended Browsers
- ✅ Chrome/Edge (Chromium)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ✅ Samsung Internet

### Device Testing
- ✅ iPhone (various models)
- ✅ Android phones
- ✅ Tablets (should use mobile optimizations)

## Common Issues & Troubleshooting

### Issue: Mobile optimizations not showing
**Solution:** 
- Clear browser cache
- Ensure viewport width is exactly 768px or less
- Check console for errors

### Issue: Desktop showing mobile version
**Solution:**
- Verify viewport width is > 768px
- Check browser zoom level (should be 100%)
- Restart dev server

### Issue: Animations not smooth
**Solution:**
- Close other browser tabs
- Disable browser extensions
- Check device performance settings

## Performance Benchmarks

### Expected Mobile Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Lighthouse Score Targets
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 95

## Sign-Off

| Test Case | Status | Notes | Tester | Date |
|-----------|--------|-------|--------|------|
| Onboarding Mobile | ⬜ | | | |
| Transition Mobile | ⬜ | | | |
| Hero Graphics Mobile | ⬜ | | | |
| Corner Strings Mobile | ⬜ | | | |
| Background Effects | ⬜ | | | |
| Performance Test | ⬜ | | | |
| Breakpoint Test | ⬜ | | | |
| Desktop Unchanged | ⬜ | | | |

---

## Quick Test Command

To run the dev server:
```bash
cd /app
npm run dev
```

To build for production:
```bash
cd /app
npm run build
```

To preview production build:
```bash
cd /app
npm run preview
```
