import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Map} from 'immutable'

import './index.scss'
import Image from './components/image'

class ImagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      picked: Map()
    }
    this.handleImageClick = this.handleImageClick.bind(this)
    this.renderImage = this.renderImage.bind(this)
  }

  handleImageClick(image) {
    const {multiple, onPick} = this.props
    const pickedImage = multiple ? this.state.picked : Map()
    const newerPickedImage =
      pickedImage.has(image.value) ?
        pickedImage.delete(image.value) :
        pickedImage.set(image.value, image.src)

    this.setState({picked: newerPickedImage})

    const pickedImageToArray = [];
    newerPickedImage.map((image, i) => pickedImageToArray.push({src: image, value: i}));

    onPick(multiple ? pickedImageToArray : pickedImageToArray[0]);

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
    const {images} = this.props;
    return (
      <div className="image_picker">
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
