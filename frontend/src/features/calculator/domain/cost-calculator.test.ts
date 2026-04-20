import { calculateCostBreakdown } from './cost-calculator';

describe('calculateCostBreakdown', () => {
  it('calcula el breakdown completo con costos de máquina', () => {
    const result = calculateCostBreakdown({
      printingTimeHours: 2,
      printingTimeMinutes: 30,
      filamentWeight: 125,
      spoolWeight: 1000,
      spoolPrice: 20,
      powerConsumptionWatts: 200,
      energyCostKwh: 0.2,
      prepTime: 30,
      prepCostPerHour: 30,
      postProcessingTimeInMinutes: 15,
      postProcessingCostPerHour: 20,
      includeMachineCosts: true,
      printerCost: 1000,
      investmentReturnYears: 2,
      repairCost: 1,
      otherCosts: [{ price: 2 }, { price: 3 }],
      profitPercentage: 20,
      vatPercentage: 21,
    });

    expect(result.filamentCost).toBe(2.5);
    expect(result.electricityCost).toBe(0.1);
    expect(result.laborCost).toBe(20);
    expect(result.currentMachineCost).toBeCloseTo(1.4280821918, 6);
    expect(result.otherCostsTotal).toBe(5);
    expect(result.subTotal).toBeCloseTo(29.0280821918, 6);
    expect(result.profitAmount).toBeCloseTo(5.8056164383, 6);
    expect(result.priceBeforeVat).toBeCloseTo(34.8336986301, 6);
    expect(result.vatAmount).toBeCloseTo(7.3150767123, 6);
    expect(result.finalPrice).toBeCloseTo(42.1487753425, 6);
  });

  it('no agrega costos de máquina si includeMachineCosts es false', () => {
    const result = calculateCostBreakdown({
      printingTimeHours: 1,
      printingTimeMinutes: 0,
      filamentWeight: 100,
      spoolWeight: 1000,
      spoolPrice: 10,
      powerConsumptionWatts: 100,
      energyCostKwh: 0.5,
      prepTime: 0,
      prepCostPerHour: 30,
      postProcessingTimeInMinutes: 0,
      postProcessingCostPerHour: 20,
      includeMachineCosts: false,
      printerCost: 500,
      investmentReturnYears: 1,
      repairCost: 10,
      otherCosts: [],
      profitPercentage: 0,
      vatPercentage: 0,
    });

    expect(result.currentMachineCost).toBe(0);
    expect(result.subTotal).toBe(1.05);
    expect(result.finalPrice).toBe(1.05);
  });
});
