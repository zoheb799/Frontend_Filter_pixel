import React, { useState, useEffect, useCallback } from "react";
import { Button, Slider, Box, IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { useImageContext } from '../context/ImageContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageEditor = () => {
  const {
    image,
    setImage,
    imageId,
    setImageId,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    rotation,
    setRotation,
    format,
    setformat,
  } = useImageContext();

  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState("Download");
  const [convertLabel, setConvertLabel] = useState("Convert Format");

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);
      toast.success('Image uploading...');

      try {
        const response = await axios.post('/api/v1/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const filename = response.data.filename;
        const imageUrl = `/api/v1/image/${filename}`;  // Use the GET route for serving the image
        setImage(imageUrl); // Set image URL for display
        setImageId(response.data._id);
        
        const imageFormat = response.data.format; // 'jpeg' or 'png'
        setformat(imageFormat);  // Set the format state based on the uploaded image

        // Show toaster message and update button labels based on the image format
        if (imageFormat === 'jpeg') {
          toast.success('JPEG format uploaded');
          setConvertLabel('Convert to PNG');
          setDownloadLabel('Download JPEG');
        } else if (imageFormat === 'png') {
          toast.success('PNG format uploaded');
          setConvertLabel('Convert to JPEG');
          setDownloadLabel('Download PNG');
        }
      } catch (error) {
        console.error('Error uploading image', error);
        toast.error('Failed to upload image');
      }
    } else {
      toast.error('Please select a valid image file');
    }
  };

  // Apply image styles based on user adjustments
  const applyImageStyles = () => ({
    transform: `rotate(${rotation}deg)`,
    filter: `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`,
  });

  const handleUpdateImage = useCallback(async () => {
    if (!imageId) {
      toast.error('No image to update');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/image/${imageId}`, {
        brightness,
        contrast,
        saturation,
        rotation,
        format, // Pass the current format for processing
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedFormat = response.data.format;  // Get updated format
      setformat(updatedFormat);

      // Update button labels based on the updated format
      if (updatedFormat === 'jpeg') {
        setConvertLabel('Convert to PNG');
        setDownloadLabel('Download JPEG');
      } else if (updatedFormat === 'png') {
        setConvertLabel('Convert to JPEG');
        setDownloadLabel('Download PNG');
      }

      toast.success('Image updated successfully');
    } catch (error) {
      console.error('Error updating image', error);
      toast.error('Failed to update image');
    }
  }, [imageId, brightness, contrast, saturation, rotation, format]);

  // Handle blur event on sliders (trigger updates)
  const handleBlur = () => {
    handleUpdateImage();
  };
  const handleFormatConversion = async () => {
    if (!imageId) {
      toast.error('No image to convert');
      return;
    }

    // Toggle between jpeg and png formats
    const newFormat = format === 'jpeg' ? 'png' : 'jpeg';
    setformat(newFormat);

    try {
      const response = await axios.put(`/api/v1/image/${imageId}`, {
        format: newFormat,
      });

      const updatedFormat = response.data.format;
      setformat(updatedFormat);

      // Update button labels after format conversion
      if (updatedFormat === 'jpeg') {
        setConvertLabel('Convert to PNG');
        setDownloadLabel('Download JPEG');
        toast.success('Image converted to JPEG');
      } else if (updatedFormat === 'png') {
        setConvertLabel('Convert to JPEG');
        setDownloadLabel('Download PNG');
        toast.success('Image converted to PNG');
      }
    } catch (error) {
      console.error('Error converting image format', error);
      toast.error('Failed to convert image format');
    }
  };
  // Download image in specified format
// Download image in specified format
const downloadImage = async () => {
  if (!image || !format) {
    toast.error('No image or format to download');
    return;
  }

  try {
    // Trigger a download by making an API request
    const response = await axios.get(`/api/v1/${imageId}/download`, {
      params: {
        format: format,
        brightness: brightness,
        contrast: contrast,
        saturation: saturation,
        rotation: rotation
      },
      responseType: 'blob', // Important for handling binary data
    });

    // Create a link element to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `image.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('Image downloaded successfully');
  } catch (error) {
    console.error('Error downloading image', error);
    toast.error('Failed to download image');
  }
};
const handleReset = () => {
  setImage(null);
  setImageId(null);
  setBrightness(100);
  setContrast(100);
  setSaturation(100);
  setRotation(0);
  setformat(null);
  toast.success('image and the features got reset ')
};

  return (
    <Box display="flex" justifyContent="space-around" p={5} height="100%">
      <Box width="50%" display="flex" flexDirection="column" alignItems="center">
        {!image ? (
          <label htmlFor="file-input">
            <input
              id="file-input"
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>
              Upload Image
            </Button>
          </label>
        ) : (
          <Box position="relative" width="500px" height="500px">
            <img
              src={image}
              alt="Uploaded"
              style={applyImageStyles()}
              width="100%"
              height="100%"
            />

            {activeFeature && (
              <Box 
                position="absolute" 
                top={0} 
                left={0} 
                right={0} 
                bottom={0} 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                bgcolor="rgba(0, 0, 0, 0.25)"
                zIndex={10}
              >
                {activeFeature === "brightness" && (
                  <Slider
                    value={brightness}
                    onChange={(e, newValue) => setBrightness(newValue as number)}
                    onBlur={handleBlur}
                    min={50}
                    max={150}
                    sx={{ position: "absolute", bottom: 10, width: '80%' }}
                  />
                )}
                {activeFeature === "saturation" && (
                  <Slider
                    value={saturation}
                    onChange={(e, newValue) => setSaturation(newValue as number)}
                    onBlur={handleBlur}
                    min={50}
                    max={150}
                    sx={{ position: "absolute", bottom: 10, width: '80%' }}
                  />
                )}
                {activeFeature === "contrast" && (
                  <Slider
                    value={contrast}
                    onChange={(e, newValue) => setContrast(newValue as number)}
                    onBlur={handleBlur}
                    min={50}
                    max={150}
                    sx={{ position: "absolute", bottom: 10, width: '80%' }}
                  />
                )}
                {activeFeature === "rotate" && (
                  <Slider
                    value={rotation}
                    onChange={(e, newValue) => setRotation(newValue as number)}
                    onBlur={handleBlur}
                    min={0}
                    max={360}
                    sx={{ position: "absolute", bottom: 10, width: '80%' }}
                  />
                )}
                
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
  variant="contained"
  color="primary"
  onClick={downloadImage} 
>
  {`Download ${format.toUpperCase()}`}  {/* Label reflects current format */}
</Button>
<Button
          variant="outlined"
          color="primary"
          onClick={handleReset}
        >
          Reset
        </Button>
              <Button variant="contained" color="primary" onClick={() => setFullScreen(true)}>
                Preview
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box width="25%" display="flex" flexDirection="column" spacing={2}>
        <Button
          variant="outlined"
          color={activeFeature === "rotate" ? "primary" : "secondary"}
          onClick={() => setActiveFeature("rotate")}
        >
          Rotate
        </Button>
        <Button
          variant="outlined"
          color={activeFeature === "brightness" ? "primary" : "secondary"}
          onClick={() => setActiveFeature("brightness")}
        >
          Brightness
        </Button>
        <Button
          variant="outlined"
          color={activeFeature === "saturation" ? "primary" : "secondary"}
          onClick={() => setActiveFeature("saturation")}
        >
          Saturation
        </Button>
        <Button
          variant="outlined"
          color={activeFeature === "contrast" ? "primary" : "secondary"}
          onClick={() => setActiveFeature("contrast")}
        >
          Contrast
        </Button>
        <Button
  variant="outlined"
  color="secondary"
  onClick={handleFormatConversion}
>
  {convertLabel}
</Button>
      </Box>

      {/* Full-screen Preview */}
      <Dialog
        open={fullScreen}
        onClose={() => setFullScreen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh', // Adjust the height of the dialog
          },
        }}
      >
        <DialogTitle
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            margin: 0,
            padding: '8px',
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setFullScreen(false)} // Close the dialog
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {image ? (
            <img
              src={image}
              alt="Full screen preview"
              style={applyImageStyles()}
              width="50%"
              height="50%"
            />
          ) : null}
        </DialogContent>
      </Dialog>
      {/* ToastContainer for notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Box>
  );
};

export default ImageEditor;