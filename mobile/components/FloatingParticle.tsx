import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface Props {
  delay: number;
  startX: number;
  size?: number;
  color?: string;
}

export default function FloatingParticle({
  delay,
  startX,
  size = 4,
  color = "#a78bfa",
}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -80,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.2,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -250,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    bottom: "35%",
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
});
