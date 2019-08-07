import React, { Component } from 'react';

export default function withPropsChecker(WrappedComponent) {
  return class PropsChecker extends Component {
    componentWillReceiveProps(nextProps) {
      Object.keys(nextProps)
        .filter((key) => nextProps[key] !== this.props[key])
        .forEach((key) => {
          console.log('changed property:', key, 'from', this.props[key], 'to', nextProps[key]);
        });
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
