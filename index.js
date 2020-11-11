import React, { Component } from 'react'

import {
  TextInput,
  findNodeHandle,
  NativeModules,
  Platform
} from 'react-native'

const mask = NativeModules.RNTextInputMask.mask
const unmask = NativeModules.RNTextInputMask.unmask
const setMask = NativeModules.RNTextInputMask.setMask
export { mask, unmask, setMask }

export default class TextInputMask extends Component {
  static defaultProps = {
    maskDefaultValue: true,
  }

  masked = false

  onChangeText = masked => {
    if (this.props.mask) {
      unmask(this.props.mask, masked, unmasked => {
        this.props.onChangeText && this.props.onChangeText(masked, unmasked);
      })
    } else {
      this.props.onChangeText && this.props.onChangeText(masked)
    }
  }

  setRef = ref => {
    if (ref) {
      this.input = ref.inputRef.current;

      if (typeof this.props.refInput === 'function') {
        this.props.refInput(ref)
      }
    }
  }

  componentDidMount() {
    if (this.props.mask && !this.masked) {
      this.masked = true
      setMask(findNodeHandle(this.input), this.props.mask);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask) {
      setMask(findNodeHandle(this.input), this.props.mask);
    }
  }

  render() {
    return (
      this.props.children
        ? this.props.children({ onChangeText: this.onChangeText, ref: this.setRef })
        : <TextInput
            {...this.props}
            ref={ref => {
              this.input = ref
              if (typeof this.props.refInput === 'function') {
                this.props.refInput(ref)
              }
            }}
            multiline={this.props.mask && Platform.OS === 'ios' ? false : this.props.multiline}
            onChangeText={this.onChangeText}
          />
    );
  }
}
