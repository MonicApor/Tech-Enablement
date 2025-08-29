import { faker } from '@faker-js/faker';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import BodyText from 'components/atoms/BodyText';
import Button from 'components/atoms/Button';
import Heading from 'components/atoms/Heading';

function Product() {
  const product = {
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3Q8L3RleHQ+PC9zdmc+',
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    reviews: [...Array(10)].map(() => ({
      avatar:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVzZXI8L3RleHQ+PC9zdmc+',
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      rating: faker.commerce.price(3, 5),
      description: faker.lorem.sentences(2, '. '),
    })),
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <img src={product.image} width="240" height="240" alt={product.name} />
        </Box>
        <Box sx={{ pl: 2 }}>
          <Heading variant="h5" sx={{ mb: 1 }}>
            {product.name}
          </Heading>
          <Heading variant="h6" sx={{ mb: 2 }}>
            ${product.price}
          </Heading>
          <BodyText>{product.description}</BodyText>
          <Box sx={{ display: 'flex', alignContent: 'center' }}>
            <Rating name={product.name} value={4} readOnly />
            <BodyText sx={{ ml: 2 }}>{product.reviews.length} Reviews</BodyText>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Button sx={{ mr: 2 }}>Add to Cart</Button>
            <Button>Add to Wishlist</Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Heading variant="h6">Reviews ({product.reviews.length})</Heading>

        {product.reviews.map((review, key) => (
          <Box key={key} sx={{ display: 'flex', mb: 2 }}>
            <Box>
              <img src={review.avatar} width="64" height="64" alt={review.name} />
            </Box>
            <Box sx={{ pl: 2 }}>
              <BodyText sx={{ m: 0, fontWeight: 700 }}>{review.name}</BodyText>
              <BodyText sx={{ m: 0 }}>{review.description}</BodyText>
              <Rating name={review.name} value={Number(review.rating)} readOnly />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Product;
