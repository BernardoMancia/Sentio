import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface CounterProps {
  count: number;
  triggerBounce: boolean;
}

export default function Counter({ count, triggerBounce }: CounterProps) {
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const plusAnim = useRef(new Animated.Value(0)).current;
  const plusOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (triggerBounce && count > 0) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.5,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            friction: 3,
            tension: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      plusAnim.setValue(0);
      plusOpacity.setValue(1);
      Animated.parallel([
        Animated.timing(plusAnim, {
          toValue: -60,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(plusOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [triggerBounce, count]);

  return (
    <View style={styles.container}>
      <View style={styles.countRow}>
        <Animated.Text
          style={[
            styles.count,
            {
              transform: [{ scale: bounceAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {count}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.plusOne,
            {
              opacity: plusOpacity,
              transform: [{ translateY: plusAnim }],
            },
          ]}
        >
          +1
        </Animated.Text>
      </View>
      <View style={styles.divider} />
      <Animated.Text style={[styles.label, { opacity: opacityAnim }]}>
        {count === 0
          ? "nenhum registro hoje"
          : count === 1
          ? "vez hoje"
          : "vezes hoje"}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingVertical: 20,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  count: {
    fontSize: 96,
    fontWeight: "900",
    color: "#ffffff",
    textShadowColor: "rgba(124, 77, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
    letterSpacing: -4,
    includeFontPadding: false,
  },
  plusOne: {
    fontSize: 28,
    fontWeight: "700",
    color: "#a78bfa",
    position: "absolute",
    right: -45,
    top: 10,
    textShadowColor: "rgba(167, 139, 250, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "rgba(124, 77, 255, 0.35)",
    borderRadius: 1,
    marginTop: 4,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "400",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
});
