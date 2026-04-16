import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function TapFeedback({
  x,
  y,
  id,
}: {
  x: number;
  y: number;
  id: number;
}) {
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0.7)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0.5)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ring1Scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ring1Opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(ring2Scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(ring2Opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(dotScale, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View
      style={[styles.container, { left: x - 60, top: y - 60 }]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ring1Opacity,
            transform: [
              {
                scale: ring1Scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 2.5],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring2,
          {
            opacity: ring2Opacity,
            transform: [
              {
                scale: ring2Scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dotOpacity,
            transform: [{ scale: dotScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  ring: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#a78bfa",
  },
  ring2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#c084fc",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e9d5ff",
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
});
