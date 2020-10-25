import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {OrderedMap} from 'immutable'

import './index.scss'
import Image from './components/image'

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: OrderedMap(),
      previousImages: [],
    };
    this.handleImageClick = this.handleImageClick.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  static getDerivedStateFromProps({images}, {previousImages}) {
    if (images.length > 0
      && (previousImages.length == 0 || (
        previousImages.length !== images.length || previousImages[0].value !== images[0].value))
    ) {
      let picked = OrderedMap();
      images
        .filter(image => !isNaN(image.pickIndex))
        .sort((image1, image2) => image1.pickIndex - image2.pickIndex)
        .forEach(({src, value}) => (picked = picked.set(value, src)));
      return {picked, previousImages: images};
    }
    return null;
  }


  handleImageClick(image) {
    const {multiple, onPick} = this.props
    const pickedImage = multiple ? this.state.picked : OrderedMap();
    const newerPickedImage =
      pickedImage.has(image.value) ?
        pickedImage.delete(image.value) :
        pickedImage.set(image.value, image.src)

    this.setState({picked: newerPickedImage}, () => {
      const pickedImageToArray = [];
      newerPickedImage.map((image, i) => pickedImageToArray.push({
        src: image,
        value: i,
        pickIndex: newerPickedImage.toArray().indexOf(image)
      }));

      onPick(multiple ? pickedImageToArray : pickedImageToArray[0]);
    });
  }

  renderImage(image, i) {
    return (
      <Image
        src={image.src}
        isSelected={this.state.picked.has(image.value)}
        pickedIndex={this.state.picked.toArray().indexOf(image.src)}
        onImageClick={() => this.handleImageClick(image)}
        index={i}
        key={i}
        CheckedComponent={this.props.CheckedComponent}
      />
    )
  }

  render() {
    const {images, className} = this.props;
    return (
      <div className={"image_picker"(className ? ' ' + className : "").trim()}>
        {images.map(this.renderImage)}
        <div className="clear"/>
      </div>
    )
  }
}

ImagePicker.propTypes = {
  images: PropTypes.array,
  multiple: PropTypes.bool,
  onPick: PropTypes.func,
  CheckedComponent: PropTypes.elementType
}

export default ImagePicker
