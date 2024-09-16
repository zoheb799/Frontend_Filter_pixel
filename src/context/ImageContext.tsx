import React, { createContext, useContext, useState, ReactNode } from "react";

interface ImageContextProps {
  image: string | null;
  setImage: (image: string | null) => void;
  imageId: string | null; // Add imageId here
  setImageId: (id: string | null) => void; // Add setImageId here
  brightness: number;
  setBrightness: (brightness: number) => void;
  contrast: number;
  setContrast: (contrast: number) => void;
  saturation: number;
  setSaturation: (saturation: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  croppedImage: string | null;
  setCroppedImage: (croppedImage: string | null) => void;
  format: string | null;
  setformat: (image: string | null) => void;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null); // Manage image ID state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [format, setformat] = useState<string | null>(null);

  return (
    <ImageContext.Provider
      value={{
        image,
        setImage,
        imageId, // Provide imageId in context
        setImageId, // Provide setImageId in context
        brightness,
        setBrightness,
        contrast,
        setContrast,
        saturation,
        setSaturation,
        rotation,
        setRotation,
        croppedImage,
        setCroppedImage,
        format,
        setformat,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = (): ImageContextProps => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
