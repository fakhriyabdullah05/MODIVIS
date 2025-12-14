import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import ExportModal from '../components/ExportModal';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI } from "@google/genai";

interface EditorPageProps {
  onNavigate: (view: AppView) => void;
  initialImage?: string | null;
}

// Define the shape of our history state
interface EditorState {
  imageSrc: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cropRatio: string;
  activeFilter: string;
  bgRemoved: boolean;
  upscaleLevel: number;
}

const EditorPage: React.FC<EditorPageProps> = ({ onNavigate, initialImage }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'basic' | 'premium'>('basic');
  const [showExport, setShowExport] = useState(false);
  const [finalExportImage, setFinalExportImage] = useState<string>(''); // State for the processed image
  const [isGeneratingExport, setIsGeneratingExport] = useState(false);

  // Editor State
  const defaultImage = "https://picsum.photos/id/48/1200/900";
  const [imageSrc, setImageSrc] = useState(initialImage || defaultImage);
  
  // Persistent reference to the original image for Reset functionality
  const originalImageRef = useRef<string>(initialImage || defaultImage);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  const [cropRatio, setCropRatio] = useState<string>('original'); // 'original', '1:1', '9:16', '16:9'

  // AI & Filter State
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  
  // AI Tools State
  const [bgRemoved, setBgRemoved] = useState(false);
  // Store the image state before background removal to allow restoring (Specific feature undo)
  const [originalImageBeforeBgRemoval, setOriginalImageBeforeBgRemoval] = useState<string | null>(null);
  
  const [upscaleLevel, setUpscaleLevel] = useState(1);
  const [magicEraserActive, setMagicEraserActive] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [eraserPaths, setEraserPaths] = useState<{x: number, y: number}[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // History Stacks
  const [history, setHistory] = useState<EditorState[]>([]);
  const [redoStack, setRedoStack] = useState<EditorState[]>([]);

  // Refs for Canvas interaction
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync initialImage if provided, but only once on mount or valid change
  useEffect(() => {
    if (initialImage) {
      setImageSrc(initialImage);
      originalImageRef.current = initialImage;
    }
  }, [initialImage]);

  // Handle Resize for Canvas
  useEffect(() => {
    const handleResize = () => {
        if (imageContainerRef.current && canvasRef.current) {
            canvasRef.current.width = imageContainerRef.current.clientWidth;
            canvasRef.current.height = imageContainerRef.current.clientHeight;
            drawEraserOverlay();
        }
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100); 

    return () => window.removeEventListener('resize', handleResize);
  }, [cropRatio, imageSrc, rotation, flipH, flipV]); 

  // Draw Eraser Paths (Visual Overlay only)
  const drawEraserOverlay = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)'; // Red semi-transparent for eraser mask
          ctx.lineWidth = brushSize;

          eraserPaths.forEach(path => {
              if (path.length < 2) return;
              ctx.beginPath();
              ctx.moveTo(path[0].x, path[0].y);
              for (let i = 1; i < path.length; i++) {
                  ctx.lineTo(path[i].x, path[i].y);
              }
              ctx.stroke();
          });
      }
  };

  useEffect(() => {
      drawEraserOverlay();
  }, [eraserPaths, brushSize]);

  // --- UNDO / REDO LOGIC ---

  const getCurrentState = (): EditorState => ({
      imageSrc,
      brightness,
      contrast,
      saturation,
      blur,
      rotation,
      flipH,
      flipV,
      cropRatio,
      activeFilter,
      bgRemoved,
      upscaleLevel
  });

  const saveHistory = () => {
      const currentState = getCurrentState();
      // Limit history to 20 steps to prevent memory issues with base64 images
      setHistory(prev => {
          const newHistory = [...prev, currentState];
          if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
          return newHistory;
      });
      setRedoStack([]); // Clear redo stack on new action
  };

  const handleUndo = () => {
      if (history.length === 0) return;
      const previousState = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      
      // Save current state to redo stack
      setRedoStack(prev => [...prev, getCurrentState()]);
      setHistory(newHistory);
      
      applyState(previousState);
  };

  const handleRedo = () => {
      if (redoStack.length === 0) return;
      const nextState = redoStack[redoStack.length - 1];
      const newRedo = redoStack.slice(0, -1);

      // Save current state to history
      setHistory(prev => [...prev, getCurrentState()]);
      setRedoStack(newRedo);

      applyState(nextState);
  };

  const applyState = (state: EditorState) => {
      setImageSrc(state.imageSrc);
      setBrightness(state.brightness);
      setContrast(state.contrast);
      setSaturation(state.saturation);
      setBlur(state.blur);
      setRotation(state.rotation);
      setFlipH(state.flipH);
      setFlipV(state.flipV);
      setCropRatio(state.cropRatio);
      setActiveFilter(state.activeFilter);
      setBgRemoved(state.bgRemoved);
      setUpscaleLevel(state.upscaleLevel);
      // Reset tools specific UI state that isn't part of the image result
      setEraserPaths([]); 
  };

  // Handlers
  const handleRotate = (direction: 'left' | 'right') => {
    saveHistory();
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  const handleFlip = (axis: 'h' | 'v') => {
    saveHistory();
    if (axis === 'h') setFlipH(!flipH);
    else setFlipV(!flipV);
  };

  const handleCropChange = (ratio: string) => {
      saveHistory();
      setCropRatio(ratio);
  };

  const handleFilterChange = (filter: string) => {
      saveHistory();
      setActiveFilter(filter);
  };

  const handleReset = () => {
    if (window.confirm("Reset all changes? This cannot be undone.")) {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setCropRatio('original');
        setActiveFilter('none');
        setBgRemoved(false);
        setOriginalImageBeforeBgRemoval(null);
        setUpscaleLevel(1);
        setMagicEraserActive(false);
        setEraserPaths([]);
        setHistory([]);
        setRedoStack([]);
        // Force reset to the original Ref
        setImageSrc(originalImageRef.current);
    }
  };

  const simulateAIProcess = (message: string, duration: number = 1500): Promise<void> => {
      return new Promise((resolve) => {
          setIsProcessingAI(true);
          setAiMessage(message);
          setTimeout(() => {
              setIsProcessingAI(false);
              setAiMessage('');
              resolve();
          }, duration);
      });
  };

  const getBase64FromUrl = async (url: string): Promise<string> => {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              // Remove data url prefix
              const base64Data = base64String.split(',')[1];
              resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  // --- EXPORT GENERATION ---
  const generateFinalImage = async () => {
    setIsGeneratingExport(true);
    setAiMessage('Rendering final image...');
    setIsProcessingAI(true);

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        if (!ctx) throw new Error('Could not get canvas context');

        // Determine orientation for canvas size
        const radians = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));

        // Calculate bounding box for rotated image
        const newWidth = img.naturalWidth * cos + img.naturalHeight * sin;
        const newHeight = img.naturalWidth * sin + img.naturalHeight * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Apply CSS Filters to Canvas Context
        // Note: 'filter' property on context is supported in most modern browsers
        const filterString = getActiveFilterStyle().replace(/brightness\((\d+)%\)/, 'brightness($1%)')
                                                   .replace(/contrast\((\d+)%\)/, 'contrast($1%)')
                                                   .replace(/saturate\((\d+)%\)/, 'saturate($1%)')
                                                   .replace(/blur\((\d+)px\)/, 'blur($1px)')
                                                   .replace(/hue-rotate\((\d+)deg\)/, 'hue-rotate($1deg)')
                                                   .replace(/invert\((\d+)%\)/, 'invert($1%)')
                                                   .replace(/grayscale\((\d+)%\)/, 'grayscale($1%)')
                                                   .replace(/sepia\((\d+)%\)/, 'sepia($1%)');
        
        ctx.filter = filterString;

        // Apply Transforms
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        // -- Note: Crop simulation in export -- 
        // Real cropping requires a more complex UI for selection.
        // For now, we export the full processed image. 
        // If 'cropRatio' implied actual pixel removal, we would use ctx.drawImage with source rect parameters.

        setFinalExportImage(canvas.toDataURL('image/png', 0.9));
        setShowExport(true);
    } catch (e) {
        console.error("Failed to generate export image", e);
        alert("Could not generate image for export.");
    } finally {
        setIsGeneratingExport(false);
        setIsProcessingAI(false);
        setAiMessage('');
    }
  };


  // --- FUNCTIONAL REMOVE BG WITH GEMINI ---
  const applyRemoveBg = async () => {
      if (bgRemoved) {
          // If already removed, treat click as Restore
          restoreBg();
          return;
      }

      // ROBUST API KEY RETRIEVAL
      const API_KEY = (() => {
          try {
              if (typeof process !== "undefined" && process.env?.API_KEY) return process.env.API_KEY;
          } catch(e) {}
          
          if (typeof window !== "undefined" && (window as any).process?.env?.API_KEY) return (window as any).process.env.API_KEY;
          
          return "AIzaSyCzikMvKoe3dJhl2CCJCkinIM-ErT3d4T4";
      })();

      if (!API_KEY) {
          alert("API Key is missing. AI features require a valid API Key.");
          return;
      }
      
      saveHistory(); // Save state before AI modification
      
      // Save the current state specifically for toggle logic
      setOriginalImageBeforeBgRemoval(imageSrc);

      setIsProcessingAI(true);
      setAiMessage('Removing background with AI...');

      try {
          let base64Data = '';

          // METHOD 1: Try Canvas Extraction (Best for already loaded images)
          if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
              try {
                  const canvas = document.createElement('canvas');
                  canvas.width = imageRef.current.naturalWidth;
                  canvas.height = imageRef.current.naturalHeight;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                      ctx.drawImage(imageRef.current, 0, 0);
                      const dataUrl = canvas.toDataURL('image/png');
                      base64Data = dataUrl.split(',')[1];
                  }
              } catch (canvasError) {
                  console.warn("Canvas extraction failed (likely CORS taint), falling back to fetch...", canvasError);
              }
          }

          // METHOD 2: Fetch Fallback
          if (!base64Data) {
              base64Data = await getBase64FromUrl(imageSrc);
          }
          
          const ai = new GoogleGenAI({ apiKey: API_KEY });
          
          // IMPLEMENT RETRY LOGIC FOR RATE LIMITS (429)
          let response = null;
          let attempt = 0;
          const maxRetries = 3;
          let delay = 2000; // Start with 2 seconds

          while (attempt < maxRetries) {
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: 'image/png',
                                    data: base64Data
                                }
                            },
                            {
                                text: "Remove the background from this image. Keep the main subject exactly as is, but make the background transparent. Return only the image."
                            }
                        ]
                    }
                });
                break; // Success, exit loop
            } catch (err: any) {
                const errMsg = err.message || JSON.stringify(err);
                // Check for 429 or Quota Exceeded
                if ((errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) && attempt < maxRetries - 1) {
                     setAiMessage(`AI busy. Retrying (${attempt + 1}/${maxRetries})...`);
                     console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
                     await new Promise(resolve => setTimeout(resolve, delay));
                     delay *= 2; // Exponential backoff
                     attempt++;
                } else {
                    throw err; // Fatal error or max retries reached
                }
            }
          }

          let newImage = null;
          // Check for image in parts
          if (response?.candidates?.[0]?.content?.parts) {
              for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData) {
                      newImage = `data:image/png;base64,${part.inlineData.data}`;
                      break;
                  }
              }
          }

          if (newImage) {
              setImageSrc(newImage);
              setBgRemoved(true);
          } else {
             // If AI response was empty (rare but possible), trigger manual fallback
             throw new Error("AI returned no image data");
          }

      } catch (error: any) {
          console.error("AI Remove BG failed", error);
          
          const errorString = error.message || JSON.stringify(error);
          let friendlyMessage = "An error occurred with the AI service.";

          if (errorString.includes('429') || errorString.includes('quota') || errorString.includes('RESOURCE_EXHAUSTED')) {
              friendlyMessage = "Daily AI Quota Reached. Switching to manual mode automatically.";
          } else if (errorString.includes('fetch') || errorString.includes('network')) {
              friendlyMessage = "Network error connecting to AI. Switching to manual mode.";
          }
          
          // Inform user gracefully
          alert(friendlyMessage);
          
          // AUTOMATIC FALLBACK
          fallbackManualRemoveBg();
      } finally {
          setIsProcessingAI(false);
          setAiMessage('');
      }
  };

  const fallbackManualRemoveBg = () => {
      // Original manual implementation as fallback
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      
      img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = 'destination-in';
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = Math.min(canvas.width, canvas.height) * 0.45; 
          
          const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
          gradient.addColorStop(0, 'rgba(0,0,0,1)'); 
          gradient.addColorStop(1, 'rgba(0,0,0,0)'); 
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          setImageSrc(canvas.toDataURL('image/png'));
          setBgRemoved(true);
      };
  }

  const restoreBg = () => {
      saveHistory(); // Save state before restoring
      if (originalImageBeforeBgRemoval) {
          setImageSrc(originalImageBeforeBgRemoval);
          setBgRemoved(false);
          setOriginalImageBeforeBgRemoval(null);
      }
  };

  // --- FUNCTIONAL MAGIC ERASER ---
  const applyMagicEraser = async () => {
    if (eraserPaths.length === 0 || !imageRef.current) return;

    // Note: History is already saved in startDrawing()

    await simulateAIProcess('Erasing object...', 800);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw current image
        ctx.drawImage(img, 0, 0);

        // Calculate scale ratio between displayed size and natural size
        const displayedWidth = imageRef.current?.clientWidth || 1;
        const displayedHeight = imageRef.current?.clientHeight || 1;
        const scaleX = img.naturalWidth / displayedWidth;
        const scaleY = img.naturalHeight / displayedHeight;

        // Configuration for "Healing" (Clone Stamp Simulation)
        const brushRadius = (brushSize * scaleX) / 2;
        const cloneOffsetX = brushRadius * 3; // Offset to copy pixels from

        // Process each point in the paths
        eraserPaths.flat().forEach(point => {
            const x = point.x * scaleX;
            const y = point.y * scaleY;

            // Save context to constrain drawing to the brush tip
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
            ctx.clip();

            // "Heal": Draw the image again, but shifted, to cover the spot
            ctx.drawImage(img, -cloneOffsetX, 0); 

            ctx.restore();
        });

        // Update Image
        setImageSrc(canvas.toDataURL('image/png'));
        setEraserPaths([]); // Clear visual paths
    };
  };

  const handleUpscale = (level: number) => {
      saveHistory();
      simulateAIProcess(`Upscaling image to ${level}x...`).then(() => setUpscaleLevel(level));
  };

  const getAspectRatioStyle = () => {
    switch (cropRatio) {
      case '1:1': return { aspectRatio: '1/1' };
      case '9:16': return { aspectRatio: '9/16' };
      case '16:9': return { aspectRatio: '16/9' };
      default: return {};
    }
  };

  // Filter Presets
  const filters = [
      { name: 'None', value: 'none', style: '' },
      { name: 'Grayscale', value: 'grayscale', style: 'grayscale(100%)' },
      { name: 'Sepia', value: 'sepia', style: 'sepia(100%)' },
      { name: 'Vintage', value: 'vintage', style: 'sepia(50%) contrast(120%) saturate(80%)' },
      { name: 'Cool', value: 'cool', style: 'hue-rotate(180deg) saturate(150%)' },
      { name: 'Warm', value: 'warm', style: 'sepia(30%) saturate(140%) hue-rotate(-10deg)' },
      { name: 'Invert', value: 'invert', style: 'invert(100%)' },
      { name: 'Blur', value: 'blur', style: 'blur(2px)' },
  ];

  const getActiveFilterStyle = () => {
      const presetStyle = filters.find(f => f.value === activeFilter)?.style || '';
      // Combine preset with manual adjustments
      return `${presetStyle} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`.trim();
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!magicEraserActive) return;
      saveHistory(); // Save state before starting a drawing stroke
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setEraserPaths(prev => [...prev, [{x, y}]]);
      }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !magicEraserActive) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setEraserPaths(prev => {
              const newPaths = [...prev];
              // Safety check
              if (newPaths.length > 0) {
                 newPaths[newPaths.length - 1].push({x, y});
              }
              return newPaths;
          });
      }
  };

  const stopDrawing = () => {
      if (isDrawing) {
        setIsDrawing(false);
        // Trigger AI processing when stroke is finished
        if (magicEraserActive) {
            applyMagicEraser();
        }
      }
  };

  return (
    <div className="flex h-screen w-full flex-row bg-background-dark overflow-hidden">
      {/* Sidebar Toolbar */}
      <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-white/5 bg-[#0d121c] z-20">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-8 text-primary">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
            </div>
            <div>
              <h1 className="text-white text-sm font-bold tracking-wide">MODIVIS</h1>
              <p className="text-[#92a4c9] text-xs">Editor Engine v2.0</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-1 m-2 bg-white/5 rounded-lg">
            <button 
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'basic' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                {t('editor.basic')}
            </button>
            <button 
                onClick={() => setActiveTab('premium')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'premium' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                {t('editor.premium_ai')}
            </button>
        </div>

        {/* Tools Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            
            {activeTab === 'basic' ? (
                <>
                    {/* Basic Tools Accordions */}
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-primary">crop</span> {t('editor.crop_resize')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                            </div>
                            <div className="p-3 pt-0 grid grid-cols-3 gap-2">
                                <button 
                                  onClick={() => handleCropChange('original')} 
                                  className={`text-slate-400 text-xs py-2 rounded border border-white/5 transition-colors ${cropRatio === 'original' ? 'bg-primary text-white border-primary' : 'bg-black/40 hover:bg-primary/20 hover:text-primary'}`}
                                >
                                  Free
                                </button>
                                {['1:1', '9:16', '16:9'].map(ratio => (
                                    <button 
                                      key={ratio} 
                                      onClick={() => handleCropChange(ratio)}
                                      className={`text-slate-400 text-xs py-2 rounded border border-white/5 transition-colors ${cropRatio === ratio ? 'bg-primary text-white border-primary' : 'bg-black/40 hover:bg-primary/20 hover:text-primary'}`}
                                    >
                                      {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-primary">tune</span> {t('editor.adjustments')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_less</span>
                            </div>
                            <div className="p-4 pt-0 space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{t('editor.brightness')}</span><span>{brightness}%</span></div>
                                    <input 
                                        type="range" min="0" max="200" value={brightness} 
                                        onPointerDown={saveHistory}
                                        onChange={(e) => setBrightness(parseInt(e.target.value))} 
                                        className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary" 
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{t('editor.contrast')}</span><span>{contrast}%</span></div>
                                    <input 
                                        type="range" min="0" max="200" value={contrast} 
                                        onPointerDown={saveHistory}
                                        onChange={(e) => setContrast(parseInt(e.target.value))} 
                                        className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary" 
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{t('editor.saturation')}</span><span>{saturation}%</span></div>
                                    <input 
                                        type="range" min="0" max="200" value={saturation} 
                                        onPointerDown={saveHistory}
                                        onChange={(e) => setSaturation(parseInt(e.target.value))} 
                                        className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary" 
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Blur</span><span>{blur}px</span></div>
                                    <input 
                                        type="range" min="0" max="10" value={blur} 
                                        onPointerDown={saveHistory}
                                        onChange={(e) => setBlur(parseInt(e.target.value))} 
                                        className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-primary" 
                                    />
                                </div>
                            </div>
                        </div>

                         <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-primary">transform</span> {t('editor.transform')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                            </div>
                             <div className="p-3 pt-0 grid grid-cols-3 gap-2">
                                <button onClick={() => handleRotate('left')} className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-black/40 border border-white/5">
                                    <span className="material-symbols-outlined text-xl mb-1">rotate_left</span>
                                    <span className="text-[10px]">{t('landing.rotate')}</span>
                                </button>
                                <button onClick={() => handleFlip('h')} className={`flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 transition-colors border border-white/5 ${flipH ? 'bg-primary/20 text-white border-primary/50' : 'bg-black/40 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-xl mb-1">flip</span>
                                    <span className="text-[10px]">Flip H</span>
                                </button>
                                 <button onClick={() => handleFlip('v')} className={`flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 transition-colors border border-white/5 ${flipV ? 'bg-primary/20 text-white border-primary/50' : 'bg-black/40 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-xl mb-1 rotate-90">flip</span>
                                    <span className="text-[10px]">Flip V</span>
                                </button>
                             </div>
                        </div>

                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-indigo-400">palette</span> {t('editor.filters')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_more</span>
                            </div>
                            <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                                {filters.map(filter => (
                                    <button 
                                        key={filter.value}
                                        onClick={() => handleFilterChange(filter.value)}
                                        className={`flex items-center gap-2 p-2 rounded border border-white/5 text-xs transition-colors ${activeFilter === filter.value ? 'bg-primary text-white border-primary' : 'bg-black/20 text-slate-400 hover:text-white'}`}
                                    >
                                        <div className="w-6 h-6 rounded bg-cover bg-center shrink-0" style={{backgroundImage: `url(${imageSrc})`, filter: filter.style}}></div>
                                        {filter.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Premium Tools Accordions */}
                     <div className="space-y-4">
                        {/* Remove BG */}
                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-rose-500">auto_awesome</span> {t('editor.remove_bg')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_less</span>
                            </div>
                            <div className="p-4 pt-0">
                                <p className="text-xs text-slate-400 mb-3">Instantly remove background from your image using AI.</p>
                                <button 
                                  onClick={applyRemoveBg}
                                  className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${bgRemoved ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-primary text-white hover:bg-primary/90'}`}
                                >
                                  {bgRemoved ? (
                                      <>
                                          <span className="material-symbols-outlined text-base">undo</span>
                                          Restore Background
                                      </>
                                  ) : (
                                      <>
                                          <span className="material-symbols-outlined text-base">auto_fix_high</span>
                                          Remove Background
                                      </>
                                  )}
                                </button>
                            </div>
                        </div>

                        {/* Magic Eraser */}
                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-amber-500">ink_eraser</span> {t('editor.magic_eraser')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_less</span>
                            </div>
                            <div className="p-4 pt-0">
                                <button 
                                    onClick={() => setMagicEraserActive(!magicEraserActive)}
                                    className={`w-full mb-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 ${magicEraserActive ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                                >
                                    <span className="material-symbols-outlined text-base">{magicEraserActive ? 'check' : 'edit'}</span>
                                    {magicEraserActive ? 'Done Erasing' : 'Activate Eraser'}
                                </button>
                                {magicEraserActive && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between text-xs text-slate-400"><span>Brush Size</span><span>{brushSize}px</span></div>
                                        <input 
                                            type="range" min="5" max="100" value={brushSize} 
                                            onChange={(e) => setBrushSize(parseInt(e.target.value))} 
                                            className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2 text-center">Draw over objects to remove them.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upscaler */}
                        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 text-white text-sm font-medium"><span className="material-symbols-outlined text-lg text-emerald-500">high_quality</span> {t('editor.upscaler')}</div>
                                <span className="material-symbols-outlined text-slate-500 text-lg">expand_less</span>
                            </div>
                            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                                {[2, 4].map(level => (
                                    <button 
                                        key={level}
                                        onClick={() => handleUpscale(level)}
                                        className={`py-3 rounded border border-white/5 text-xs font-bold transition-all ${upscaleLevel === level ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-black/40 text-slate-400 hover:text-emerald-400'}`}
                                    >
                                        {level}x Upscale
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                </>
            )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#181e2b]">
          {/* Top Bar Navigation inside Main Area */}
          <header className="h-14 border-b border-white/5 bg-[#0d121c] flex items-center justify-between px-6 z-10 shrink-0">
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
                     <button 
                        onClick={handleUndo} 
                        disabled={history.length === 0}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo"
                     >
                         <span className="material-symbols-outlined text-xl">undo</span>
                     </button>
                     <button 
                        onClick={handleRedo} 
                        disabled={redoStack.length === 0}
                        className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo"
                     >
                         <span className="material-symbols-outlined text-xl">redo</span>
                     </button>
                 </div>
                 <span className="h-6 w-px bg-white/10"></span>
                 <p className="text-xs text-slate-500">{history.length} changes saved</p>
             </div>
             
             <div className="flex items-center gap-3">
                 <button onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors">
                     Reset All
                 </button>
                 <button 
                    onClick={generateFinalImage}
                    disabled={isGeneratingExport}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                 >
                     {isGeneratingExport ? (
                         <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                     ) : (
                         <span className="material-symbols-outlined text-lg">download</span>
                     )}
                     {t('editor.export')}
                 </button>
             </div>
          </header>

          {/* Canvas Wrapper */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
              {/* Background Pattern for Transparency */}
              <div 
                  ref={imageContainerRef}
                  className="relative shadow-2xl transition-all duration-300 ease-out"
                  style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      ...getAspectRatioStyle()
                  }}
              >
                  {/* Checkerboard Background (Visible if BG removed) */}
                  <div className="absolute inset-0 z-0 bg-white" 
                       style={{backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'}}>
                  </div>

                  {/* Main Image */}
                  {/* Added crossOrigin="anonymous" to allow canvas operations without security errors */}
                  <img 
                      ref={imageRef}
                      src={imageSrc} 
                      alt="Editing" 
                      crossOrigin="anonymous"
                      className="relative z-10 block w-full h-full object-contain"
                      style={{
                          filter: getActiveFilterStyle(),
                          transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                          transition: isDrawing ? 'none' : 'filter 0.1s, transform 0.3s'
                      }}
                  />

                  {/* Canvas Layer for Magic Eraser / Drawing */}
                  <canvas 
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className={`absolute inset-0 z-20 w-full h-full ${magicEraserActive ? 'cursor-crosshair' : 'pointer-events-none'}`}
                  />
                  
                  {/* AI Processing Overlay */}
                  {isProcessingAI && (
                      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
                          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="font-bold tracking-wide animate-pulse">{aiMessage}</p>
                      </div>
                  )}
              </div>
          </div>
      </main>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} imageSrc={finalExportImage} />
    </div>
  );
};

export default EditorPage;