// src/services/imageProcessingService.ts

// Types
export interface ImageAnalysisResult {
  predictedClass: string;
  classIndex: number;
  probabilities: number[];
  metadata: Record<string, any>;
}

export interface ProcessedImageData {
  width: number;
  height: number;
  format: string;
  size: number; // in bytes
  dataUrl: string;
}

class ImageProcessingService {
  // Process image for analysis (resize, format conversion, etc.)
  async processImage(file: File, maxWidth: number = 224, maxHeight: number = 224): Promise<ProcessedImageData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          resolve({
            width,
            height,
            format: 'jpeg',
            size: dataUrl.length,
            dataUrl
          });
        };
        
        img.onerror = () => {
          reject(new Error('Could not load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Could not read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Simulate image analysis (in a real app, this would call an API)
  async analyzeImage(imageData: ProcessedImageData): Promise<ImageAnalysisResult> {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate a response
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock results based on image characteristics
    const mockResults: ImageAnalysisResult[] = [
      {
        predictedClass: 'High Risk',
        classIndex: 0,
        probabilities: [0.85, 0.10, 0.05],
        metadata: {
          confidence: 'high',
          timestamp: new Date().toISOString()
        }
      },
      {
        predictedClass: 'Medium Risk',
        classIndex: 1,
        probabilities: [0.15, 0.70, 0.15],
        metadata: {
          confidence: 'medium',
          timestamp: new Date().toISOString()
        }
      },
      {
        predictedClass: 'Low Risk',
        classIndex: 2,
        probabilities: [0.05, 0.15, 0.80],
        metadata: {
          confidence: 'low',
          timestamp: new Date().toISOString()
        }
      }
    ];
    
    // Randomly select a result for simulation
    const randomIndex = Math.floor(Math.random() * mockResults.length);
    return mockResults[randomIndex];
  }

  // Extract metadata from image file
  extractImageMetadata(file: File): Record<string, any> {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    };
  }

  // Convert data URL to Blob
  dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  // Calculate image similarity (simplified)
  calculateImageSimilarity(image1: string, image2: string): number {
    // This is a simplified implementation
    // In a real application, you would use more sophisticated algorithms
    const hash1 = this.simpleHash(image1);
    const hash2 = this.simpleHash(image2);
    
    // Calculate Hamming distance
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) distance++;
    }
    
    // Return similarity as percentage
    return 1 - (distance / hash1.length);
  }

  // Simple hash function for demonstration
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < Math.min(str.length, 100); i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(2).padStart(32, '0');
  }
}

// Export singleton instance
export const imageProcessingService = new ImageProcessingService();