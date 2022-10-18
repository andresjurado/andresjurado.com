import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import { Flex, Image, Text } from "@chakra-ui/react";

const ImageBlock = ({ blockContent }) => {
  console.log(blockContent);

  return (
    <Flex {...styles.imageContainer}>
      <Image src={"/" + blockContent.image} />
      {blockContent.caption && (
        <Text {...styles.captionText}>{blockContent.caption}</Text>
      )}
    </Flex>
  );
};

ImageBlock.propTypes = {
  blockContent: PropTypes.object.isRequired,
};

export default ImageBlock;
