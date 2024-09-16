import React, { useEffect, useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';

const TableOne = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loader

  // Function to call the API and get all images
  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/v1/images'); // Adjust the endpoint as needed
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images on component mount
  }, []);

  if (loading) {
    // Show a loader while the data is being fetched
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Images
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Filename
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Format
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Created At
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Updated At
            </h5>
          </div>
        </div>

        {images.map((image) => (
          <div
            className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark"
            key={image._id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <IconButton aria-label="image">
                <ImageIcon />
              </IconButton>
              <p className="hidden truncate text-black dark:text-white sm:block">
                {image.filename}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{image.format}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{image.status}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{new Date(image.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{new Date(image.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
