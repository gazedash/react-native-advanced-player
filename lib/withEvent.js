import * as React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

type Event = {
  time: number,
  duration: number,
  content: any,
  // id?
  // trackId?
}

type RenderProps = {
  event: Event,
  isShown: boolean,
  showEvent: () => void,
  hideEvent: () => void,
}

type Props = {
  currentTime: number,
  events: Event[],
  onDismiss: (event: Event) => void,
  onShow: (event: Event) => void,
  children: (props: RenderProps) => any,

  // trackId
  // trackPosition
}

type State = {
  isShown: boolean,
}

const findEvent = ({ events, currentTime }) => {
  const pos = Math.floor(currentTime)

  const firstEvent = events.find((e) => {
    return (e.time <= pos && e.end >= pos) || (e.time <= pos && !e.end)
  })

  return firstEvent
}

export function withEvent(WrappedComponent) {
  class Enhance extends React.Component<Props, State> {
    state = {
      event: {},
      isShown: false,
    }

    static defaultProps = {
      onDismiss: () => {},
      onShow: () => {},
    }

    showEvent = (prevEvent = {}) => {
      const { events, currentTime } = this.props
      const event = findEvent({ events, currentTime })
      if (event && event.id === prevEvent.id) {
        return
      }

      event && this.setState({ event, isShown: true })
      if (!event) {
        this.setState({ isShown: false })
      }
    }

    componentDidMount = () => {
      this.showEvent()
    }

    componentDidUpdate = (prevProps, prevState) => {
      if (this.state.isShown !== prevState.isShown) {
        return
      }
      if (this.state.event !== prevState.event) {
        return
      }
      if (this.props.currentTime !== prevProps.currentTime) {
        return this.showEvent(prevState.event)
      }
    }

    render() {
      const { event, isShown } = this.state
      return (
        <WrappedComponent
          event={event}
          isEventShown={isShown}
          {...this.props}
        />
      )
    }
  }

  hoistNonReactStatic(Enhance, WrappedComponent)
  return Enhance
}
