import React, { Component } from 'react';

require('./revealer.scss');

const CSS_CLASS = 'revealer__element--transition';
const CSS_HIDDEN_CLASS = 'revealer__element--hidden';

class Deferred {
  constructor() {
    let _this = this;

    _this.promise = new Promise((resolve, reject) => {
        _this.resolve = resolve;
        _this.reject = reject;
      }
    );
  }
};

export default class Revealer extends Component {
  componentDidMount() {
    let _this = this;

    //All tag names with src attributes
    let tagNames = [
      'audio',
      'embed',
      'iframe',
      'img',
      'input',
      'script',
      'source',
      'track',
      'video',
    ];

    let nodesToLoad = Array.from(_this.container.querySelectorAll(tagNames.join(',')));
    let promises = nodesToLoad.map(node => {
      let deferred = new Deferred();
      node.addEventListener('load', () => deferred.resolve(node));
      return deferred.promise;
    });

    let initialHandlerPosition = _this.props.initialHandlerPosition || 50;
    _this.mouseIsDown = false;

    Promise.all(promises).then(() => {
      Array.from(_this.container
              .getElementsByClassName(CSS_HIDDEN_CLASS))
              .forEach(
                node => node.classList.remove(CSS_HIDDEN_CLASS)
              );
      _this.container
              .getElementsByClassName('revealer__loading')[0].classList.add(CSS_HIDDEN_CLASS);

      let container = _this.container;
      let handler = _this.handler;
      let graphicContainers = container.getElementsByClassName('revealer__graphic');
      let leftContainer = graphicContainers[0];
      let rightContainer = graphicContainers[1];

      leftContainer.style.position = 'absolute';
      leftContainer.style.top = 0;
      leftContainer.style.left = 0;
      leftContainer.style.width = initialHandlerPosition + '%';

      _this.drivenContainer = leftContainer;

      _this.resetHandler(container.clientWidth * (initialHandlerPosition / 100));
    });

    _this.mouseUp = _this.mouseUp.bind(_this);
    _this.resize = _this.resize.bind(_this);
    _this.touch = _this.touch.bind(_this);

    window.addEventListener('resize', _this.resize);
  }

  resetHandler(width) {
    let _this = this;
    let handler = _this.handler;
    let centerNode = handler.getElementsByClassName('handler__center-element')[0];
    let handlerWidth = Math.max.apply(null, Array.from(_this.handler.children)
      .map(child => child.clientWidth)
      .concat([_this.handler.clientWidth])
    );

    if (centerNode) {
      let top = 'calc(50%';
      top = top + ' - ' + (centerNode.clientHeight / 2) + 'px';
      top = top + ')';
      centerNode.style.top = top;
      centerNode.style.left = -(handlerWidth / 2) + 'px';
    }

    _this.handler.style.left = width + 'px';
  }

  resize() {
    let _this = this;
    _this.resetHandler(Number.parseInt(_this.drivenContainer.clientWidth));
  }

  touch(e, cb) {
    let touch = e.touches[0];
    let evnt = {};

    if (touch) {
      evnt.clientX = touch.clientX;
    }

    return cb.bind(this)(evnt);
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

        if (orgOffset < -hotOffset) {
          _this.moveToTheEnd = true;
        } else if (orgOffset > hotOffset) {
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
        onTouchMove={ (e) => _this.touch(e, _this.mouseMove) }
        ref={ (container) => { _this.container = container; } }
      >
        <div className="revealer__loading revealer__element">Loading...</div>
        <div className="revealer__graphic revealer__element revealer__element--hidden">
          { _this.props.children[0] }
        </div>
        <div
          className="revealer__handler revealer__element revealer__element--hidden"
          onMouseDown={ (e) => _this.mouseDown(e) }
          onMouseUp={ (e) => _this.mouseUp(e) }
          onTouchStart={ (e) => _this.touch(e, _this.mouseDown) }
          onTouchEnd={ (e) => _this.touch(e, _this.mouseUp) }
          onTouchCancel={ (e) => _this.touch(e, _this.mouseUp) }
          ref={ (handler) => { _this.handler = handler; } }
        >
          <div className="handler__center-element">
            <div className="handler__center-spacing"></div>
          </div>
        </div>
        <div className="revealer__graphic revealer__element revealer__element--hidden">
          { _this.props.children[1] }
        </div>
      </div>
    );
  }
}
