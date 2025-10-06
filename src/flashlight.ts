export interface FlashlightConfig {
  fixedPointX: number;
  fixedPointY: number;
  intensity: number;
}

export class Flashlight {
  private container: HTMLElement;
  private flashlightElement!: HTMLElement;
  private circleElement!: HTMLElement;
   private config: FlashlightConfig;
  private isActive: boolean = false;
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(container: HTMLElement, config?: Partial<FlashlightConfig>) {
    this.container = container;
    this.config = {
      fixedPointX: window.innerWidth / 2,
      fixedPointY: window.innerHeight,
      intensity: 0.8,
      ...config
    };
    
    this.createFlashlightElements();
    this.setupEventListeners();
  }

  private createFlashlightElements(): void {
    // Add flashlight elements directly to the existing container
    this.container.innerHTML += `
      <div class="flashlight-triangle" id="flashlight-triangle"></div>
      <div class="flashlight-circle" id="flashlight-circle"></div>
    `;
    
    // Get references to elements
    this.flashlightElement = document.getElementById('flashlight-triangle')!;
    this.circleElement = document.getElementById('flashlight-circle')!;
    
    // Add CSS styles
    this.addStyles();
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      #flashlight-game-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: 
          linear-gradient(rgba(12, 23, 19, 0.8), rgba(0, 0, 0, 0.8)),
          url('/backgoundphoto.png');
        background-size: cover;
        background-position: center;
        pointer-events: auto; /* Allow touch events on container */
        z-index: 1000;
      }


      .flashlight-triangle {
        position: absolute;
        width: 0;
        height: 0;
        border-left: 50px solid transparent;
        border-right: 50px solid transparent;
        border-top: 300px solid rgba(255, 255, 255, 0.03);
        pointer-events: none;
        z-index: 1001;
        transform-origin: 50% 100%;
        filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.02));
        animation: flashlight-flicker 2.5s ease-in-out infinite;
      }

      .flashlight-circle {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 100%);
        pointer-events: none;
        z-index: 1003;
        transform: translate(-50%, -50%);
        box-shadow: 
          0 0 20px rgba(255, 255, 255, 0.6),
          0 0 40px rgba(255, 255, 255, 0.4),
          0 0 80px rgba(255, 255, 255, 0.2),
          0 0 120px rgba(255, 255, 255, 0.1);
        filter: none;
        animation: flashlight-flicker 2.5s ease-in-out infinite;
      }
    `;
    
    document.head.appendChild(style);
  }

  private setupEventListeners(): void {
    const handleMouseMove = (e: MouseEvent) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      this.updateFlashlightPosition();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      if (e.touches.length > 0) {
        this.mousePosition.x = e.touches[0].clientX;
        this.mousePosition.y = e.touches[0].clientY;
        this.updateFlashlightPosition();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      if (e.touches.length > 0) {
        this.mousePosition.x = e.touches[0].clientX;
        this.mousePosition.y = e.touches[0].clientY;
        this.updateFlashlightPosition();
      }
    };

    // Add both mouse and touch events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });

    // Store reference for cleanup
    (this as any).eventHandlers = {
      handleMouseMove,
      handleTouchMove,
      handleTouchStart
    };
  }

  private updateFlashlightPosition(): void {
    if (!this.isActive) return;

    const { x: mouseX, y: mouseY } = this.mousePosition;
    
    // Calculate angle from fixed point to mouse position
    const deltaX = mouseX - this.config.fixedPointX;
    const deltaY = mouseY - this.config.fixedPointY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    
    // Calculate distance from fixed point to mouse
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Calculate circle diameter so that distance from center to edge equals diameter
    // If distance from center to edge = diameter, then radius = diameter
    // So diameter = distance / 2 (since radius = diameter / 2)
    const circleDiameter = distance / 2;
    
    // Set minimum and maximum diameter limits
    const minDiameter = 50;   // Minimum diameter
    const maxDiameter = 400; // Maximum diameter
    const clampedDiameter = Math.max(minDiameter, Math.min(maxDiameter, circleDiameter));
    
    // Calculate scale factor based on clamped diameter
    const baseSize = 100; // Base size from CSS
    const scale = clampedDiameter / baseSize;
    
    // Calculate triangle height to reach exactly to circle center
    // Triangle height should be the full distance from fixed point to circle center
    const triangleHeight = distance;
    
    // Set minimum triangle height to prevent it from being too small
    const minTriangleHeight = 50;
    const finalTriangleHeight = Math.max(minTriangleHeight, triangleHeight);
    
    // Update triangle CSS to make it stretch exactly to circle center
    this.flashlightElement.style.borderTopWidth = `${finalTriangleHeight}px`;
    
    // Update triangle border width to match circle diameter
    const triangleBorderWidth = clampedDiameter / 2;
    this.flashlightElement.style.borderLeftWidth = `${triangleBorderWidth}px`;
    this.flashlightElement.style.borderRightWidth = `${triangleBorderWidth}px`;
    
    // Position triangle at fixed point (bottom center)
    this.flashlightElement.style.left = `${this.config.fixedPointX}px`;
    this.flashlightElement.style.top = `${this.config.fixedPointY}px`;
    
    // Rotate triangle (no scaling, just rotation)
    this.flashlightElement.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    
    // Position circle at mouse cursor with scaling
    this.circleElement.style.left = `${mouseX}px`;
    this.circleElement.style.top = `${mouseY}px`;
    this.circleElement.style.display = 'block';
    this.circleElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    // Dynamic room lighting effect based on circle size
    const lightIntensity = Math.min(scale * 0.6, 0.8);
    const lightRadius = Math.min(scale * 1.5, 3);
    this.circleElement.style.boxShadow = `
      0 0 ${20 * lightRadius}px rgba(255, 255, 255, ${0.6 * lightIntensity}),
      0 0 ${40 * lightRadius}px rgba(255, 255, 255, ${0.4 * lightIntensity}),
      0 0 ${80 * lightRadius}px rgba(255, 255, 255, ${0.2 * lightIntensity}),
      0 0 ${120 * lightRadius}px rgba(255, 255, 255, ${0.1 * lightIntensity})
    `;
  }

  public activate(): void {
    this.isActive = true;
    this.container.style.display = 'block';
    
    // Hide flashlight elements initially
    this.flashlightElement.style.display = 'none';
    this.circleElement.style.display = 'none';
    
    // Wait for first mouse/touch movement to show flashlight
    const showOnFirstMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          return;
        }
      }
      
      this.mousePosition.x = clientX;
      this.mousePosition.y = clientY;
      
      // Show flashlight elements
      this.flashlightElement.style.display = 'block';
      this.circleElement.style.display = 'block';
      
      // Update position
      this.updateFlashlightPosition();
      
      // Remove this one-time listeners
      document.removeEventListener('mousemove', showOnFirstMove);
      document.removeEventListener('touchstart', showOnFirstMove);
    };
    
    document.addEventListener('mousemove', showOnFirstMove);
    document.addEventListener('touchstart', showOnFirstMove);
  }

  public deactivate(): void {
    this.isActive = false;
    this.container.style.display = 'none';
  }

  public setFixedPoint(x: number, y: number): void {
    this.config.fixedPointX = x;
    this.config.fixedPointY = y;
    if (this.isActive) {
      this.updateFlashlightPosition();
    }
  }

  public destroy(): void {
    // Clean up event listeners
    const handlers = (this as any).eventHandlers;
    if (handlers) {
      document.removeEventListener('mousemove', handlers.handleMouseMove);
      document.removeEventListener('touchmove', handlers.handleTouchMove);
      document.removeEventListener('touchstart', handlers.handleTouchStart);
    }

    // Remove flashlight elements
    const triangle = document.getElementById('flashlight-triangle');
    const circle = document.getElementById('flashlight-circle');
    
    if (triangle) triangle.remove();
    if (circle) circle.remove();
  }
}
