import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress'; // Importa el componente CircularProgress
import { SectionWrapper } from '../hoc';
import { IngredientContext } from './IngredientContext';

const ListIngredients = () => {
  const { setSelectedIngredient } = useContext(IngredientContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [jsonResponse, setJsonResponse] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [croppedImages, setCroppedImages] = useState({});
  const [loading, setLoading] = useState(false); // Estado para controlar el loader
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (jsonResponse.data && imageSrc) {
      const newIngredients = transformJsonToIngredients(jsonResponse);
      setIngredients(newIngredients);
      cropAllIngredientImages(newIngredients, jsonResponse);
    }
  }, [jsonResponse, imageSrc]);

  const handleToggle = (value) => () => {
    const selectedIngredient = ingredients.find((ingredient) => ingredient.id === value);
    if (selectedIngredients.includes(selectedIngredient.name)) {
      setSelectedIngredients(selectedIngredients.filter(name => name !== selectedIngredient.name));
    } else {
      setSelectedIngredients([...selectedIngredients, selectedIngredient.name]);
    }
    setSelectedItem(selectedIngredient === selectedItem ? null : selectedIngredient);
    setSelectedIngredient(selectedIngredient.name);
  };

  const selectImage = () => {
    fileInputRef.current.click();
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawBoundingBoxes = (ctx) => {
    if (jsonResponse.data) {
      jsonResponse.data.forEach(item => {
        if (selectedIngredients.includes(item.name)) {
          const x = item.xcenter * ctx.canvas.width - (item.width * ctx.canvas.width) / 2;
          const y = item.ycenter * ctx.canvas.height - (item.height * ctx.canvas.height) / 2;
          const width = item.width * ctx.canvas.width;
          const height = item.height * ctx.canvas.height;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = 'red';
          ctx.font = '16px Arial';
          ctx.fillText(item.name, x, y - 5);
        }
      });
    }
  };

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawBoundingBoxes(ctx);
    };
  };

  useEffect(() => {
    if (imageSrc) {
      drawImageOnCanvas();
    }
  }, [imageSrc, jsonResponse, selectedIngredients]);

  const uploadImage = async () => {
    setLoading(true); // Mostrar el loader cuando se hace clic en "Upload Image"
    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);
    formData.append('size', '640');
    formData.append('confidence', '0.25');
    formData.append('iou', '0.45');

    try {
      const response = await fetch(import.meta.env.VITE_APP_ULTRALYTICS_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_APP_ULTRALYTICS_API_KEY
        },
        body: formData,
      });
      const data = await response.json();
      setJsonResponse(data);
    } catch (error) {
      console.error('Error to upload the image:', error);
    } finally {
      setLoading(false); // Ocultar el loader al finalizar la carga
    }
  };

  const cropAllIngredientImages = (ingredients, jsonResponse) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const newCroppedImages = {};
      ingredients.forEach((ingredient) => {
        const item = jsonResponse.data.find(data => data.name === ingredient.name);
        const x = item.xcenter * canvas.width - (item.width * canvas.width) / 2;
        const y = item.ycenter * canvas.height - (item.height * canvas.height) / 2;
        const width = item.width * canvas.width;
        const height = item.height * canvas.height;

        const croppedCanvas = document.createElement('canvas');
        const targetSize = 150;
        croppedCanvas.width = targetSize;
        croppedCanvas.height = targetSize;
        const croppedCtx = croppedCanvas.getContext('2d');

        croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, targetSize, targetSize);

        const croppedImageUrl = croppedCanvas.toDataURL();
        newCroppedImages[ingredient.name] = croppedImageUrl;
      });
      setCroppedImages(newCroppedImages);

      setIngredients(prevIngredients =>
        prevIngredients.map(ingredient =>
          ({ ...ingredient, image: newCroppedImages[ingredient.name] })
        )
      );
    };
  };

  return (
    <div className="container mx-auto pt-4">
      <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="upload-section flex flex-col items-center flex-1 lg:w-1/3">
          <button onClick={selectImage} className="bg-blue-500 text-white py-2 px-4 rounded">Select Image</button>
          <input type="file" onChange={previewImage} ref={fileInputRef} style={{ display: 'none' }} />
          {imageSrc && (
            <div className='pt-4'>
              <img src={imageSrc} alt="Preview Image" style={{ display: 'none' }} />
              <canvas ref={canvasRef} className="max-w-full max-h-screen mx-auto"></canvas>
            </div>
          )}
          <button onClick={uploadImage} className="bg-green-500 text-white py-2 px-4 rounded mt-4" disabled={!imageSrc}>Upload Image</button>
          {loading && <CircularProgress className="mt-4" />} {/* Mostrar el loader cuando loading es true */}
        </div>

        <div className="flex flex-col items-center flex-1 lg:w-1/3">
          {selectedItem && (
            <div className="pb-6 bg-white rounded-lg shadow-lg w-full">
              <ImageCard selectedItem={selectedItem} croppedImage={croppedImages[selectedItem.name]} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center flex-1 lg:w-1/3">
          <List dense className="bg-neutral-700 w-full rounded-lg overflow-hidden">
            {ingredients.map((ingredient) => {
              const { id, name, image } = ingredient;
              const labelId = `checkbox-list-secondary-label-${id}`;
              return (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="select"
                      onClick={handleToggle(id)}
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton onClick={handleToggle(id)}>
                    <ListItemAvatar>
                      <Avatar alt={name} src={image} />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
};

const ImageCard = ({ selectedItem, croppedImage }) => {
  const { name } = selectedItem;
  return (
    <div className="image-card p-4 bg-white rounded-lg shadow-md w-full max-w-xs mx-auto">
      <h3 className="text-center">{name}</h3>
      <img src={croppedImage} alt={name} className="block mx-auto rounded-lg" style={{ width: '150px', height: '150px' }} />
    </div>
  );
};

ImageCard.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  croppedImage: PropTypes.string,
};

const transformJsonToIngredients = (jsonResponse) => {
  const data = jsonResponse.data;
  const ingredientMap = {};

  data.forEach(item => {
    if (!ingredientMap[item.name]) {
      ingredientMap[item.name] = {
        id: Object.keys(ingredientMap).length,
        name: item.name,
        image: '',
      };
    }
  });

  return Object.values(ingredientMap);
};

export default SectionWrapper(ListIngredients, 'Ingredients List');
