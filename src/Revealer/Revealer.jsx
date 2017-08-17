import React, { Component } from 'react';

require('./revealer.scss');

const CSS_CLASS = 'revealer__element--transition';

export default class Revealer extends Component {
  componentDidMount() {
    let _this = this;
    _this.mouseIsDown = false;

    let deferred = () => {
      let deferred = {};

      deferred.promise = new Promise((resolve, reject) => {
          deferred.resolve = resolve;
          deferred.reject = reject;
        }
      );

      return deferred;
    };

    let leftImageLoaded = _this.leftImageLoaded = deferred();
    let rightImageLoaded = _this.rightImageLoaded = deferred();

    _this.handlerWidth = Math.max.apply(null, Array.from(_this.handler.children)
      .map(child => child.clientWidth)
      .concat([_this.handler.clientWidth])
    );

    leftImageLoaded.promise.then(() => rightImageLoaded.promise).then(() => {
      let container = _this.container;
      let handler = _this.handler;
      let graphicContainers = container.getElementsByClassName('revealer__graphic');
      let leftContainer = graphicContainers[0];
      let rightContainer = graphicContainers[1];
      let leftImage = leftContainer.firstElementChild;
      let rightImage = rightContainer.firstElementChild;

      leftContainer.style.position = 'absolute';
      leftContainer.style.top = 0;
      leftContainer.style.left = 0;
      leftContainer.style.width = '50%';

      _this.drivenContainer = leftContainer;

      console.log(_this.drivenContainer);

      this.resetHandler(container.clientWidth / 2);
    });

    _this.mouseUp = _this.mouseUp.bind(_this);
    _this.resize = _this.resize.bind(_this);

    window.addEventListener('resize', _this.resize);
  }

  resetHandler(width) {
    let _this = this;
    let handler = _this.handler;
    let centerNode = handler.getElementsByClassName('handler__center-element')[0];

    if (centerNode) {
      let top = 'calc(50%';
      top = top + ' - ' + (centerNode.clientHeight / 2) + 'px';
      top = top + ')';
      centerNode.style.top = top;
      centerNode.style.left = -(_this.handlerWidth / 2) + 'px';
    }

    _this.handler.style.left = width + 'px';
  }

  resize() {
    let _this = this;
    _this.resetHandler(Number.parseInt(_this.drivenContainer.clientWidth));
  }

  mouseDown(e) {
    let _this = this;
    _this.mouseIsDown = true;
    _this.pos = e.clientX;
    _this.orgPos = e.clientX;
    _this.drivenContainer.classList.remove(CSS_CLASS);
    _this.handler.classList.remove(CSS_CLASS);
    window.addEventListener('mouseup', _this.mouseUp);
  }

  mouseMove(e) {
    let _this = this;
    if (_this.mouseIsDown) {
      let props = _this.props;
      let handler = _this.handler;
      let container = _this.container;

      let min = 0;
      let max = container.clientWidth;
      let offset = _this.pos - e.clientX;
      let orgOffset = _this.orgPos - e.clientX;

      let hotOffsetOn = props.hotOffsetPercentage !== undefined;
      let hotAreaOn = props.hotAreaPercentage !== undefined;
      let resetHotArea = false;
      let resetHotOffset = false;

      let newLeft = Number.parseInt(handler.style.left) - offset;

      if (newLeft > max) {
        newLeft = max;
      } else if (newLeft < min) {
        newLeft = min;
      }

      if (hotAreaOn) {
        let hotArea = this.container.clientWidth * (props.hotAreaPercentage / 100);

        if (newLeft > this.container.clientWidth - hotArea) {
          _this.moveToTheEnd = true;
        } else if (newLeft < hotArea) {
          _this.moveToTheBeginning = true;
        } else {
          resetHotArea = true;
        }
      } else {
        resetHotArea = true;
      }

      if (hotOffsetOn) {
        let hotOffset = this.container.clientWidth * (props.hotOffsetPercentage / 100);

        if (orgOffset < -hotOffset && (offset < 0)) {
          _this.moveToTheEnd = true;
        } else if (orgOffset > hotOffset && (offset > 0)) {
          _this.moveToTheBeginning = true;
        } else {
          resetHotOffset = true;
        }
      } else {
        resetHotOffset = true;
      }

      if (resetHotArea && resetHotOffset) {
        _this.moveToTheBeginning = false;
        _this.moveToTheEnd = false;
      }

      newLeft = newLeft + 'px';
      handler.style.left = newLeft;
      _this.drivenContainer.style.width = newLeft;

      _this.pos = e.clientX;
    }
  }

  mouseUp() {
    let _this = this;
    _this.mouseIsDown = false;

    let container = _this.container;
    let handler = _this.handler;
    let handlerWidth = _this.handlerWidth;
    let drivenContainer = _this.drivenContainer;

    let min = 0;
    let max = container.clientWidth;

    let addClass = node => {
      node.classList.add(CSS_CLASS);
    };

    let removeClass = node => {
      node.classList.remove(CSS_CLASS);
    };

    if (this.moveToTheBeginning) {
      handler.style.left = min + 'px';
      drivenContainer.style.width = min + 'px';
      addClass(drivenContainer);
      addClass(handler);
    } else if (this.moveToTheEnd) {
      handler.style.left = max + 'px';
      drivenContainer.style.width = max + 'px';
      addClass(drivenContainer);
      addClass(handler);
    } else {
      removeClass(drivenContainer);
      removeClass(handler);
    }

    window.removeEventListener('mouseup', _this.mouseUp);
  }

  componentWillUnmount() {
    let _this = this;
    window.removeEventListener('mouseup', _this.mouseUp);
    window.removeEventListener('resize', _this.resize);
  }

  render() {
    let _this = this;
    return (
      <div
        className="revealer"
        onMouseMove={ (e) => _this.mouseMove(e) }
        ref={ (container) => { _this.container = container; } }
      >
        <div className="revealer__graphic revealer__element">
          <img
            src={ _this.props.leftSrc }
            onLoad={ (e) => _this.leftImageLoaded.resolve() }
          ></img>
        </div>
        <div
          className="revealer__handler revealer__element"
          onMouseDown={ (e) => this.mouseDown(e) }
          onMouseUp={ (e) => _this.mouseUp(e) }
          ref={ (handler) => { _this.handler = handler; } }
        >
          <div className="handler__center-element">
            &#60;&nbsp;&#62;
          </div>
        </div>
        <div className="revealer__graphic revealer__element">
          <img
            src={ _this.props.rightSrc }
            onLoad={ (e) => _this.rightImageLoaded.resolve() }
          ></img>
        </div>
      </div>
    );
  }
}
