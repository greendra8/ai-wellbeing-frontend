export function setupAudioVisualizer(audio: HTMLAudioElement, canvas: HTMLCanvasElement, analyser: AnalyserNode) {
  
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) {
          console.error('Unable to get 2D context');
          return;
        }

        // analyser.smoothingTimeConstant = 0.8;
    
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
    
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;
        const maxRadius = Math.min(WIDTH, HEIGHT) / 2;
    
    
        let startTime = Date.now();
        let lastPulseRadius = maxRadius * 0.6; // Initialize to baseRadius
        let isBreathing = false;
        let quietTime = 0;

        // Volume threshold for considering audio as "near zero"
        // Lower value: more sensitive to quiet sounds
        // Higher value: requires louder sounds to trigger reactivity
        const volumeThreshold = 5; // Adjust this value to set the threshold for "near zero" volume

        // Delay (in milliseconds) before starting the breathing animation when audio is quiet
        // Lower value: breathing starts sooner after audio becomes quiet
        // Higher value: longer pause before breathing animation begins
        const breathingDelay = 500; // ms to wait before starting breathing animation

        // Speed of transition for reactive audio visualization
        // Lower value: slower, smoother transitions but less responsive
        // Higher value: faster, more immediate responses but potentially jumpier
        const transitionSpeed = 0.2; // Increased for faster reactivity

        // Speed of transition when entering breathing mode
        // Lower value: slower, more gradual transition to breathing state
        // Higher value: faster transition, but may appear more sudden
        const breathingTransitionSpeed = 0.01; // Slower transition for breathing

        function draw() {
          requestAnimationFrame(draw);
    
          analyser.getByteFrequencyData(dataArray);
    
          const average = dataArray.reduce((sum, value) => sum + value, 0) / analyser.frequencyBinCount;
    
          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    
          const baseRadius = maxRadius * 0.6;
    
          // Modify the breathing effect to only occur when volume is near zero
          const breathingEffect = Math.sin((Date.now() - startTime) / 2000) * 10;
    
          let targetRadius;
          if (audio.paused || average < volumeThreshold) {
            quietTime += 16; // Assuming 60fps, each frame is about 16ms
            if (quietTime >= breathingDelay) {
              isBreathing = true;
            }
          } else {
            quietTime = 0;
            isBreathing = false;
          }

          if (isBreathing) {
            targetRadius = baseRadius + breathingEffect;
          } else {
            targetRadius = baseRadius + (average / 255) * (maxRadius * 0.4); // Increased reactivity
          }

          // Smooth transition between reactive and breathing states
          const currentTransitionSpeed = isBreathing ? breathingTransitionSpeed : transitionSpeed;
          lastPulseRadius = lastPulseRadius + (targetRadius - lastPulseRadius) * currentTransitionSpeed;

          const pulseRadius = lastPulseRadius;
          
          // Create 3D orb effect
          const gradient = canvasCtx.createRadialGradient(
            centerX - pulseRadius * 0.3,
            centerY - pulseRadius * 0.3,
            0,
            centerX,
            centerY,
            pulseRadius
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 + average / 1000})`);
          gradient.addColorStop(0.7, `rgba(200, 220, 255, ${0.7 + average / 1500})`);
          gradient.addColorStop(1, `rgba(150, 180, 255, ${0.5 + average / 2000})`);
    
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
          canvasCtx.fillStyle = gradient;
          canvasCtx.fill();
    
          // Add highlight for 3D effect
          const highlightGradient = canvasCtx.createRadialGradient(
            centerX - pulseRadius * 0.5,
            centerY - pulseRadius * 0.5,
            0,
            centerX - pulseRadius * 0.3,
            centerY - pulseRadius * 0.3,
            pulseRadius
          );
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
          canvasCtx.fillStyle = highlightGradient;
          canvasCtx.fill();
    
          // Add pulsing glow
          const glowSize = 30 + average / 4 + breathingEffect / 2;
          const glowGradient = canvasCtx.createRadialGradient(
            centerX,
            centerY,
            pulseRadius - glowSize,
            centerX,
            centerY,
            pulseRadius + glowSize
          );
          glowGradient.addColorStop(0, 'rgba(150, 180, 255, 0)');
          glowGradient.addColorStop(0.5, `rgba(150, 180, 255, ${0.1 + average / 1500})`);
          glowGradient.addColorStop(1, 'rgba(150, 180, 255, 0)');
    
          canvasCtx.beginPath();
          canvasCtx.arc(centerX, centerY, pulseRadius + glowSize, 0, 2 * Math.PI);
          canvasCtx.fillStyle = glowGradient;
          canvasCtx.fill();
    
          // Add subtle ripple effect
          for (let i = 1; i <= 2; i++) {
            const rippleRadius = baseRadius + (i * 15) + Math.sin(Date.now() / (800 - i * 200)) * (3 + average / 30); // Increased reactivity
            canvasCtx.beginPath();
            canvasCtx.arc(centerX, centerY, rippleRadius, 0, 2 * Math.PI);
            canvasCtx.strokeStyle = `rgba(150, 180, 255, ${0.2 - i * 0.03 + average / 1000})`; // Increased reactivity
            canvasCtx.lineWidth = 1 + average / 100; // Increased reactivity
            canvasCtx.stroke();
          }
        }
    
        draw();
      }
