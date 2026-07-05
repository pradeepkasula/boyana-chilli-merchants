package com.chilli.app.util;

import com.chilli.app.domain.WastageRule;
import com.chilli.app.enums.WastageType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class WastageCalculator {

    private static final int SCALE = 3;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;

    private WastageCalculator() {}

    public record Result(WastageRule matchedRule, BigDecimal wastageAmount, BigDecimal grossWeight) {}

    public static Result calculate(BigDecimal actualWeight, List<WastageRule> rules) {
        WastageRule matched = rules.stream()
                .filter(r -> actualWeight.compareTo(r.getWeightFromKg()) >= 0
                          && actualWeight.compareTo(r.getWeightToKg()) <= 0)
                .findFirst()
                .orElse(null);

        if (matched == null) {
            return new Result(null, BigDecimal.ZERO, actualWeight.setScale(SCALE, ROUNDING));
        }

        BigDecimal wastageAmount;
        if (matched.getWastageType() == WastageType.PERCENTAGE) {
            wastageAmount = actualWeight
                    .multiply(matched.getWastageValue())
                    .divide(BigDecimal.valueOf(100), SCALE, ROUNDING);
        } else {
            wastageAmount = matched.getWastageValue().setScale(SCALE, ROUNDING);
        }

        BigDecimal grossWeight = actualWeight.subtract(wastageAmount).setScale(SCALE, ROUNDING);
        if (grossWeight.compareTo(BigDecimal.ZERO) < 0) {
            grossWeight = BigDecimal.ZERO;
        }

        return new Result(matched, wastageAmount, grossWeight);
    }
}
