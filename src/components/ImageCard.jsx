import PropTypes from 'prop-types'; // Importa PropTypes desde la biblioteca prop-types

const ImageCard = ({ selectedItem }) => {
  const { name, image } = selectedItem;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <img
        src={image}
        alt={name}
        className="rounded-lg object-cover h-60 w-full"
      />
    </div>
  );
};

// Define la validación de PropTypes para selectedItem
ImageCard.propTypes = {
  selectedItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImageCard;
