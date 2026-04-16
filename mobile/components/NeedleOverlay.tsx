import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";

const NEEDLE_POSITIONS = [
  { x: 180, y: 160, rotation: -25 },
  { x: 320, y: 150, rotation: 20 },
  { x: 150, y: 220, rotation: -40 },
  { x: 350, y: 200, rotation: 35 },
  { x: 230, y: 130, rotation: -10 },
  { x: 290, y: 140, rotation: 15 },
  { x: 200, y: 280, rotation: -30 },
  { x: 310, y: 270, rotation: 25 },
  { x: 160, y: 300, rotation: -45 },
  { x: 340, y: 290, rotation: 40 },
  { x: 250, y: 200, rotation: 5 },
  { x: 210, y: 350, rotation: -15 },
  { x: 300, y: 340, rotation: 10 },
  { x: 170, y: 250, rotation: -35 },
  { x: 335, y: 240, rotation: 30 },
  { x: 240, y: 170, rotation: -5 },
  { x: 270, y: 320, rotation: 20 },
  { x: 190, y: 190, rotation: -20 },
  { x: 260, y: 250, rotation: 12 },
  { x: 220, y: 310, rotation: -28 },
  { x: 280, y: 190, rotation: 18 },
  { x: 195, y: 340, rotation: -38 },
  { x: 330, y: 320, rotation: 33 },
  { x: 155, y: 270, rotation: -42 },
  { x: 305, y: 160, rotation: 22 },
  { x: 245, y: 380, rotation: -8 },
  { x: 275, y: 130, rotation: 8 },
  { x: 215, y: 230, rotation: -18 },
  { x: 290, y: 300, rotation: 28 },
  { x: 175, y: 180, rotation: -32 },
];

const SVG_SIZE = 340;
const VIEWBOX_SIZE = 512;
const SCALE = SVG_SIZE / VIEWBOX_SIZE;

interface NeedleProps {
  x: number;
  y: number;
  rotation: number;
  isNew: boolean;
}

function Needle({ x, y, rotation, isNew }: NeedleProps) {
  const translateY = useRef(new Animated.Value(isNew ? -40 : 0)).current;
  const opacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 5,
          tension: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.sequence([
          Animated.timing(shakeX, {
            toValue: 3,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: -2,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 1,
            duration: 30,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 0,
            duration: 25,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [isNew]);

  const screenX = x * SCALE;
  const screenY = y * SCALE;

  return (
    <Animated.View
      style={[
        styles.needleWrapper,
        {
          left: screenX - 25,
          top: screenY - 50,
          opacity,
          transform: [
            { translateY },
            { translateX: shakeX },
            { rotate: `${rotation}deg` },
          ],
        },
      ]}
    >
      <Svg width={50} height={60} viewBox="0 0 50 60">
        <Line
          x1={25}
          y1={18}
          x2={25}
          y2={56}
          stroke="#c0c0c0"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={0.9}
        />
        <Line
          x1={25}
          y1={56}
          x2={25}
          y2={60}
          stroke="#e0e0e0"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.95}
        />
        <Circle cx={25} cy={14} r={4} fill="#ff4444" opacity={0.85} />
        <Circle cx={24} cy={13} r={1.5} fill="#ff8888" opacity={0.6} />
      </Svg>
    </Animated.View>
  );
}

interface NeedleOverlayProps {
  count: number;
  newNeedleIndex: number;
}

export default function NeedleOverlay({
  count,
  newNeedleIndex,
}: NeedleOverlayProps) {
  const visibleNeedles = NEEDLE_POSITIONS.slice(
    0,
    Math.min(count, NEEDLE_POSITIONS.length)
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {visibleNeedles.map((pos, index) => (
        <Needle
          key={index}
          x={pos.x}
          y={pos.y}
          rotation={pos.rotation}
          isNew={index === newNeedleIndex}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  needleWrapper: {
    position: "absolute",
    width: 50,
    height: 60,
    zIndex: 3,
  },
});
