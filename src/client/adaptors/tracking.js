'use strict';

import ScrollMagic from '../../server/adaptors/scroll-magic';
import Track from '../../server/adaptors/track';

let pageScrollInitialState = {
  top: false,
  middle: false,
  bottom: false
}

export default class Tracking {
  scrollController = new ScrollMagic.Controller()
  scrollTrackerScene = null
  pageScrollState = {}

  addPageScrollTracking(pageName, pageElement) {
    // NOTE: we're assuming that only one page needs to be tracked at a time, and
    // that tracking state should be reset for each page visit within the same session.
    if (this.scrollTrackerScene) {
      console.warn('Trying to initialise tracking for page before removing previous!');
      removePageScrollTracking();
    }

    Object.assign(this.pageScrollState, pageScrollInitialState);

    let pageHeight = pageElement.clientHeight;
    let foldHeight = window.innerHeight || 400;
    let scrollHeightRatio = (pageHeight - foldHeight) / pageHeight;
    this.scrollTrackerScene = new ScrollMagic.Scene({
        triggerElement: pageElement,
        triggerHook: 'onLeave',
        duration: () => {return pageElement.clientHeight}
      })
      .addTo(this.scrollController)
      .on('progress', (e) => {
        if(!this.pageScrollState.top && e.progress >= foldHeight / pageHeight * scrollHeightRatio) {
          this.pageScrollState.top = true;
          this.trackEvent('hub_page', 'scroll_1', pageName);
        }
        if(!this.pageScrollState.middle && e.progress > scrollHeightRatio / 2) {
          this.pageScrollState.middle = true;
          this.trackEvent('hub_page', 'scroll_2', pageName);
        }
        if(!this.pageScrollState.bottom && e.progress > scrollHeightRatio) {
          this.pageScrollState.bottom = true;
          this.trackEvent('hub_page', 'scroll_3', pageName);
        }
    });
  }

  removePageScrollTracking() {
    this.scrollController.removeScene(this.scrollTrackerScene);
    this.scrollTrackerScene = null;
    this.pageScrollState = {};
  }

  trackEvent(category, action, label) {
    // Google Analytics – for more options see: https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
    Track('send', {
      'hitType': 'event',          // Required.
      'eventCategory': category,   // Required.
      'eventAction': action,      // Required.
      'eventLabel': label
    });
  }
};