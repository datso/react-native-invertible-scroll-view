'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ScrollableMixin from 'react-native-scrollable-mixin';

import cloneReferencedElement from 'react-clone-referenced-element';

type DefaultProps = {
  renderScrollComponent: (props: Object) => ReactElement;
};

class InvertibleScrollView extends Component {
  propTypes = {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired,
  }

  getDefaultProps(): DefaultProps {
    return {
      renderScrollComponent: props => <ScrollView {...props} />,
    };
  }

  getScrollResponder(): ReactComponent {
    return this._scrollComponent.getScrollResponder();
  }

  setNativeProps(props: Object) {
    this._scrollComponent.setNativeProps(props);
  }

  render() {
    var {
      inverted,
      renderScrollComponent,
      ...props,
    } = this.props;

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted);
      } else {
        props.style = [styles.verticallyInverted, props.style];
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted);
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component; },
    });
  }

  _renderInvertedChildren(children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child;
    });
  }
};

Object.assign(InvertibleScrollView.prototype, ScrollableMixin);

let styles = StyleSheet.create({
  verticallyInverted: {
    flex: 1,
    transform: [
      { scaleY: -1 },
    ],
  },
  horizontallyInverted: {
    flex: 1,
    transform: [
      { scaleX: -1 },
    ],
  },
});

module.exports = InvertibleScrollView;
