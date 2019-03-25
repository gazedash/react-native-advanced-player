import * as React from "react";
import Slider from "react-native-slider";

/**
 * Special Slider to handle both Progress updates and user updates
 */
export class ProgressSlider extends React.Component {
  state = {
    isSliding: false,
    prevValue: 0
  };

  static defaultProps = {
    onSlidingStart: () => {},
    onSlidingComplete: () => {},
    value: 0,
    maximumValue: 100
  };

  handleSlidingStart = (value) => {
    this.props.onSlidingStart();
    this.setState({ isSliding: true, prevValue: value });
  };

  handleSlidingComplete = (value) => {
    this.props.onSlidingComplete(value);
    // to avoid lag/jump when leaving slider
    setTimeout(() => {
      this.setState({ isSliding: false });
    }, 1000);
  };
  render() {
    const { value, maximumValue } = this.props;
    const { isSliding, prevValue } = this.state;
    return (
      <Slider
        {...this.props}
        maximumValue={maximumValue}
        value={isSliding ? prevValue : value}
        onSlidingStart={this.handleSlidingStart}
        onSlidingComplete={this.handleSlidingComplete}
      />
    );
  }
}
