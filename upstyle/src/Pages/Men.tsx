import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  VStack,
  Heading,
  Text,
  Button,
  useBreakpointValue,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';

import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { useToast } from "@chakra-ui/react";
import { ProductType } from "../constants";
import { getMensuser } from "../Redux/productReducer/action";
import { Sidebar } from "../Components/Sidebar";
import { Link, useSearchParams } from "react-router-dom";

const Men = () => {

  const imageSize = useBreakpointValue({ base: '120px', md: '150px', lg: '200px' });
  const titleSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const btnSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  let skel= new Array(8).fill(0)

  const dispatch: any = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, isError, mens } = useSelector((store: any) => {
    return {
      isLoading: store.productReducer.isLoading,
      isError: store.productReducer.isError,
      mens: store.productReducer.mens,
    };
  }, shallowEqual);

  //console.log(paramObj)

  useEffect(() => {
    let paramObj = {
      params: {
        Brand: searchParams.getAll("Brand"),
        Category: searchParams.getAll("Category"),
        _sort: searchParams.get("order") && "Price",
        _order: searchParams.get("order"),
      },
    };
    // console.log(paramObj);
    dispatch(getMensuser(paramObj));
  }, [searchParams]);

   console.log(mens);



//  ====================================================================>

const toast = useToast(); 

const handleAddToCart = (product: ProductType) => {
  const existingCartItems = localStorage.getItem("cart");
  let cart = [];
  if (existingCartItems) {
    cart = JSON.parse(existingCartItems);
  }

  // Check if the product is already in the cart
  const isProductInCart = cart.some((item:any) => item.Title === product.Title);

  if (isProductInCart) {
    toast({
      title: "Product already in the cart",
      status: "warning",
      duration: 3000, // 3 seconds
      isClosable: true,
      position:"top"
    });
  } else {
    // Add the product to the cart
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    toast({
      title: "Product added to cart",
      status: "success",
      duration: 3000, // 3 seconds
      isClosable: true,
      position:"top"
    });
  }
};



//====================================================================================>


  return (
   


    //================================================================================>


    <Flex direction={{ base: 'row', md: 'row' }}>
      <Box flex={{ base: '1', md: '3' }}>
        <Sidebar />
      </Box>

      <Box flex={{ base: '2', md: '7' }} borderWidth="1px" p={4}>

        {isLoading ? skel.map((el)=>{
          return <Skeleton height="200px" mb="20px" />;
        }):
        mens.map(
          ({
            Brand,
            Category,
            Price,
            Quantity,
            Rating,
            Size,
            Stock,
            Title,
            id,
            image,
            imgbag,
          }: ProductType) => (
            <Box
              key={id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              mb={4}
              display={{ md: 'flex' }}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box flexShrink={0} mr={{ md: 4 }}>
              <Link to={ `/singleproduct/men/${id}` } ><Image src={image} alt={Title} maxW={imageSize} /></Link>
              </Box>
              <VStack mt={{ base: 4, md: 0 }} align="flex-start">
              <Link to={ `/singleproduct/men/${id}` } >  <Heading as="h3" size={"xl"}>
                  {Title}
                </Heading>
                <Heading as="h1" size={"lg"}>{Category}</Heading>
                <Text fontSize={"lg"} >{Brand}</Text>
                <Box style={{display:"flex",gap:"6px"}}>
                <Text color={"black"}>Price: </Text> 
                 <Text color={"#DE6737"}> ${Price}</Text>
                </Box>
                
                <Text>Rating: {Rating}</Text>
                </Link>
                {/* <Text>Available Sizes: {Size.join(', ')}</Text> */}
          <Flex w="50%" justifyContent="flex-start" gap={2}>
          {
            Size.map((el,ind)=>(
             
                <Text key={ind} backgroundColor={"gray.300"} borderRadius={"50%"} p={2}>{el}</Text>
              
              
            ))
          }
          </Flex>
                
                <Button background="#DE6737" size={btnSize} 
                 onClick={() => handleAddToCart({ Brand, Category, Price, Quantity, Rating, Size, Stock, Title, id, image, imgbag })}>
                  Add to Cart
                </Button>
              </VStack>
            </Box>
           
          )
        )
        }
        
      </Box>
    </Flex>
  
  );
};



export default Men;
