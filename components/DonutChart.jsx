import Svg, { Circle, G } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme';

export default function DonutChart({ data, size = 200, strokeWidth = 22, centerLabel, centerSub }) {
  const total = data.reduce((sum, d) => sum + (d.spent || 0), 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;

  let cumulativeLength = 0;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          {/* background track so the ring always reads as a full circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border || '#2A2E3A'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {data.map((d, i) => {
            const value = d.spent || 0;
            const fraction = value / total;
            const segmentLength = Math.max(0, fraction * circumference - gap);
            const dashOffset = -cumulativeLength;
            cumulativeLength += fraction * circumference;

            if (segmentLength <= 0) return null;

            return (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.centerWrap}>
          {!!centerLabel && <Text style={styles.centerLabel}>{centerLabel}</Text>}
          {!!centerSub && <Text style={styles.centerSub}>{centerSub}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerLabel: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  centerSub: { color: colors.textMuted, fontSize: font.sm, marginTop: 2 },
});
