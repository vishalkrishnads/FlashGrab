import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import NativeAdView, {
  AdvertiserView,
  HeadlineView,
  IconView,
  StarRatingView,
  AdBadge,
  TaglineView,
  NativeMediaView
} from 'react-native-admob-native-ads';
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import ProgressCircleSnail from 'react-native-progress/CircleSnail'
import { adUnitIDs, Events } from './utils';
import dynamicStyles from '../styles/AdView'

export default AdView = React.memo(({ index, media, type, loadOnMount = true }) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef();
  const styles = useDynamicStyleSheet(dynamicStyles)

  const onAdFailedToLoad = () => {
    setError(true);
    setLoading(false);
  };

  const onUnifiedNativeAdLoaded = () => {
    setLoading(false);
    setLoaded(true);
    setError(false);
  };

  const onViewableItemsChanged = (event) => {
    let viewableAds = event.viewableItems.filter(
      (i) => i.key.indexOf('ad') !== -1,
    );

    viewableAds.forEach((adView) => {
      if (adView.index === index && !loaded) {
        setLoading(true);
        setLoaded(false);
        setError(false);
        nativeAdRef.current?.loadAd();
      } else { }
    });
  };

  useEffect(() => {
    if (!loadOnMount) {
      DeviceEventEmitter.addListener(
        Events.onViewableItemsChanged,
        onViewableItemsChanged,
      );
    }

    return () => {
      if (!loadOnMount) {
        DeviceEventEmitter.removeListener(
          Events.onViewableItemsChanged,
          onViewableItemsChanged,
        );
      }
    };
  }, [loaded]);

  useEffect(() => {
    if (loadOnMount) {
      setLoading(true);
      setLoaded(false);
      setError(false)
      nativeAdRef.current?.loadAd();
    }
    return () => {
      setLoaded(false);
    };
  }, [type]);

  return (
    <NativeAdView
      ref={nativeAdRef}
      onAdLoaded={() => console.log("Ad has been loaded")}
      onAdFailedToLoad={onAdFailedToLoad}
      onUnifiedNativeAdLoaded={onUnifiedNativeAdLoaded}
      style={{ flex: 1, alignSelf: 'center', width: '98%' }}
      adUnitID={type === 'image' ? adUnitIDs.image : adUnitIDs.video}
    >
      <AdBadge
            style={styles.ad_badge}
            textStyle={styles.ad_badge_text}
          />
      {loading ? <View style={styles.loading_animation}>
        <ProgressCircleSnail size={50} color={global.accent} />
      </View> : null}
      {!loading ? <View style={[styles.header, { height: media ? '55%' : '100%' }]}>
        <View style={{ height: '100%', width: '30%', alignItems: 'center', justifyContent: 'center' }}>
          <IconView style={styles.icon} />
        </View>
        <View style={{ width: '80%', alignSelf: 'center' }}>
          <HeadlineView
            hello="abc"
            style={styles.headlineview}
          />
          <TaglineView
            numberOfLines={2}
            style={styles.tagline}
          />
          <View style={{ flexDirection: 'row' }}>
            <AdvertiserView
              style={styles.advertiserview}
            />
            <StarRatingView />
          </View>
        </View>
      </View> : null}
      {!loading && media ? <View style={styles.body}>
        <NativeMediaView
          style={styles.mediaview}
        />
      </View> : null}
    </NativeAdView>
  );
});
